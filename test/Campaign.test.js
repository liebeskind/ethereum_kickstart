const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)) // Passes in the ABI/Interface. Contract takes object, not JSON.
  .deploy({ data: compiledFactory.bytecode }) // Deploy new instance of the factory.
  .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1000000'
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); // Bracket means take the first element in the array.
  campaign = await new web3.eth.Contract( // Use this because already deployed and sent above.
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  )
})

describe('Campaigns', () => {
  it('Deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call(); // Manager variable in the contract.
    assert.equal(accounts[0], manager);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1],
    });
    // Use .call() because doing data lookup, not modifying any data.
    const isContributor = await campaign.methods.approvers(accounts[1]).call() // Uses the approvers mapping and returns true/false.
    assert(isContributor);
  })

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '5',
        from: accounts[1]
      })
      assert(false); // Should never get to this.
    } catch (err) {
      assert(err); // Should give an err, because not hitting minimum contribution.
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods
    .createRequest('Buy batteries', '100', accounts[1])
    .send({ // Going to modify contract, so need to send
      from: accounts[0],
      gas: '1000000'
    })

    const request = await campaign.methods.requests(0).call();

    assert.equal('Buy batteries', request.description);
  })

  it('processes requests', async() => {
    
    let beginBalance = await web3.eth.getBalance(accounts[1]);
    beginBalance = web3.utils.fromWei(beginBalance, 'ether');
    beginBalance = parseFloat(beginBalance);
    console.log(beginBalance);

    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await campaign.methods
    .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
    .send({from: accounts[0], gas: '1000000'});

    await campaign.methods.approveRequest(0)
    .send({from: accounts[0], gas: '1000000'});

    await campaign.methods.finalizeRequest(0)
    .send({from: accounts[0], gas: '1000000'});

    let balance = await web3.eth.getBalance(accounts[1]); // Returns a string, which we have to convert into ether, then actual number to make comparison.
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    console.log(balance);
    assert(balance == beginBalance+5); // We're not sure exactly how much it is, but will be higher than 104.
  })
})
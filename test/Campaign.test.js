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
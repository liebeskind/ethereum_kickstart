const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const fs = require("fs");
const compiledFactory = require("./build/CampaignFactory.json");
const mnemonic = require("../mnemonic");
const infuraToken = require("../infuraToken");

const provider = new HDWalletProvider(mnemonic, infuraToken);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to ", result.options.address);

  const deploymentInfo = `
  Contract deployed from account: ${accounts[0]}
  To: ${result.options.address}
  AtTime: ${new Date()}
  `;

  fs.writeFile("contractDeploymentInfo.txt", deploymentInfo, err => {
    if (err) throw err;
    console.log("Contract deployment info file has been saved.");
  });
};
deploy();

import web3 from './web3'; // Using instance from version we created.
import campaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(campaignFactory.interface), // ABI
  '0x39e32Dd4EDCCf4EbE3BDD6690867e6b86474E452' // Where we deployed our campaignFactory contract previously.
);

export default instance;
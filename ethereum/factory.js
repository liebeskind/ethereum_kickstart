import web3 from './web3'; // Using instance from version we created.
import campaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(campaignFactory.interface), // ABI
  '0xAa69CbACbDD43C5281A47213661A506cb93822d6' // Where we deployed our campaignFactory contract previously.
);

export default instance;
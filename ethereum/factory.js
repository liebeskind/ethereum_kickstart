import web3 from './web3'; // Using instance from version we created.
import campaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(campaignFactory.interface), // ABI
  '0xFBdeD206Ee103E6Fc71cF35cf5C08c72aA205844' // Where we deployed our campaignFactory contract previously.
);

export default instance;
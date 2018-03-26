import web3 from "./web3"; // Using instance from version we created.
import campaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(campaignFactory.interface), // ABI
  "0xB09dC90F43AD41b04628CD67632fdbDE41922579" // Where we deployed our campaignFactory contract previously.
);

export default instance;

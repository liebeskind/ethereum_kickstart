import Web3 from 'web3';
const infuraToken = require('../infuraToken');

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') { // See if we are in the browser and metamask has injected web3 (is running).
  web3 = new Web3(window.web3.currentProvider); // Using this for version control rather than relying on the version injected by Metamask (we won't know the version).
} else { // Not in browser because being rendered on server side by next.js
  // We are not on the server *OR* the user is not running metamask.
  const provider = new Web3.providers.HttpProvider(infuraToken);
  web3 = new Web3(provider);
}

export default web3;
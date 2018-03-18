const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); // Removes the build folder and everything inside of it.

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8'); //contents of campaign file.
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath); //Creates the build folder.

// Loops through the compile folder keys and creates a file for each contract key inside of /build.
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", '') + '.json'), // The replace removes colon from beginning of file name.
    output[contract]
  );
}

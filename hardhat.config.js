require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.4",
  paths: {
    sources: "./blockchain/contracts",  //chemin vers les contrats
    tests: "./blockchain/tests",  // chemin vers les tests
    artifacts: "./blockchain/artifacts",  // chemin vers les artefacts seront générés
  },
  networks: {
    hardhat: {}, 
  },
};

const IslandOwnership = artifacts.require('IslandOwnership');
module.exports = function (_deployer) {
  _deployer.deploy(IslandOwnership);
};

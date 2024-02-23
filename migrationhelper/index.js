const fs = require('fs');
const Umzug = require('umzug');
const path = require('path');
const Sequelize = require('sequelize');
const { sequelize } = require('../models/index.js');

const umzug = new Umzug({
  migrations: {
    // indicates the folder containing the migration .js files
    path: path.join(process.cwd(), './migrations'),
    // inject sequelize's QueryInterface in the migrations
    params: [
      sequelize.getQueryInterface(),
      Sequelize,
    ],
  },
  // indicates that the migration data should be store in the database
  // itself through sequelize. The default configuration creates a table
  // named `SequelizeMeta`.
  storage: 'sequelize',
  storageOptions: {
    sequelize,
  },
});

async function migrate() {
  return umzug.up();
}

async function revert() {
  return umzug.down({ to: 0 });
}

module.exports={
    migrate,revert
}
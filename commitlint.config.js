const path = require('path');

// eslint-disable-next-line import/no-extraneous-dependencies
const { createConfig } = require('@astral/commitlint-config');
// eslint-disable-next-line import/no-extraneous-dependencies
const getDirNames = require('read-dir-names');

const packagesNames = getDirNames(path.resolve(__dirname, 'packages'));

module.exports = createConfig({ scopes: packagesNames, ticketPrefix: 'UIKIT' });

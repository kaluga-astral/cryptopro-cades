// eslint-disable-next-line
module.exports = {
  'packages/cryptopro-cades/**/*.{ts}': [
    'npm run lint --workspace=@astral/cryptopro-cades',
    () => 'npm run lint:types --workspace=@astral/cryptopro-cades',
  ],
  'commander/**/*.{js}': ['npm run lint --workspace=@astral/commander'],
};

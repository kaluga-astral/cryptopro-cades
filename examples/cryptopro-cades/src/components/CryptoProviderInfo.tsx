import { ICryptoProvider } from '@astral/cryptopro-cades';

type CryptoProviderProps = {
  cryptoProvider: ICryptoProvider;
};

export const CryptoProviderInfo = ({ cryptoProvider }: CryptoProviderProps) => (
  <>
    <span style={{ display: 'block' }}>
      <b>Имя:</b> {cryptoProvider.ProviderName}
    </span>
    <span style={{ display: 'block' }}>
      <b>Тип:</b> {cryptoProvider.ProviderType}
    </span>
    <span style={{ display: 'block' }}>
      <b>Версия:</b> {cryptoProvider.MajorVersion}.{cryptoProvider.MinorVersion}
      .{cryptoProvider.BuildVersion}
    </span>
  </>
);

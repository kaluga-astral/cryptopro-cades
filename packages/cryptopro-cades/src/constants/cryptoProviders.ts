import type { ICryptoProvider } from '../types';

/**
 * Справочник типок криптопровайдеров, с которыми работает плагин (для проверки поддержки).
 */
export const CRYPTO_PROVIDERS: ICryptoProvider[] = [
  {
    ProviderType: 75,
    ProviderName: 'Crypto-Pro GOST R 34.10-2001 Cryptographic Service Provider',
  },
  {
    ProviderType: 80,
    ProviderName: 'Crypto-Pro GOST R 34.10-2012 Cryptographic Service Provider',
  },
  {
    ProviderType: 81,
    ProviderName:
      'Crypto-Pro GOST R 34.10-2012 Strong Cryptographic Service Provider',
  },
  {
    ProviderType: 2,
    ProviderName: 'Infotecs Cryptographic Service Provider',
  },
  {
    ProviderType: 77,
    ProviderName: 'Infotecs GOST 2012/512 Cryptographic Service Provider',
  },
  {
    ProviderType: 78,
    ProviderName: 'Infotecs GOST 2012/1024 Cryptographic Service Provider',
  },
].map((c) => ({
  ProviderName: c.ProviderName,
  ProviderType: c.ProviderType,
}));

/**
 * Криптопровайдер по-умолчанию.
 */
export const DEFAULT_CRYPTO_PROVIDER = {
  Default: CRYPTO_PROVIDERS.find((t) => t.ProviderType === 80)!,
  Fallback: CRYPTO_PROVIDERS.find((t) => t.ProviderType === 2)!,
};

/**
 * Криптопровайдеры VipNet.
 */
export const VIP_NET_CRYPTO_PROVIDER_TYPES = Object.freeze([2, 77, 78]);

/**
 * Криптопровайдеры КриптоПРО.
 */
export const CRYPTO_PRO_CRYPTO_PROVIDER_TYPES = Object.freeze([75, 80, 81]);

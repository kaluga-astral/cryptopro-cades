import {
  CRYPTO_PRO_CRYPTO_PROVIDER_TYPES,
  VIP_NET_CRYPTO_PROVIDER_TYPES,
} from '../../constants';
import { SystemInfo } from '../../types/SystemInfo';
import { getCryptoProviders } from '../getCryptoProviders';

const oldestSupportedCryptoProCSPVersion = 4.0;
const oldestSupportedVipnetCSPVersion = 4.4;

/**
 * В данный момент имеется версия не меньше указанной версия Крипто-Провайдера.
 * @param {string} systemInfo информация о системе.
 * @returns {boolean} true, если поддерживается.
 */
export const isSupportedCSPVersion = async (
  systemInfo: SystemInfo
): Promise<boolean> => {
  if (!systemInfo.cspVersion) {
    return false;
  }
  const cryptoProviders = await getCryptoProviders();

  let haveValidCryptoProCSPVersion = false;
  let haveValidVipNetCSPVersion = false;

  if (systemInfo.cryptoProInstalled) {
    const cryptoProCSP = cryptoProviders.find((cp) =>
      CRYPTO_PRO_CRYPTO_PROVIDER_TYPES.includes(cp.ProviderType)
    );

    if (
      cryptoProCSP?.MajorVersion &&
      cryptoProCSP?.MajorVersion >= oldestSupportedCryptoProCSPVersion
    ) {
      haveValidCryptoProCSPVersion = true;
    }
  }

  if (systemInfo.vipNetInstalled) {
    const vipNetCSP = cryptoProviders.find((cp) =>
      VIP_NET_CRYPTO_PROVIDER_TYPES.includes(cp.ProviderType)
    );

    if (vipNetCSP?.MajorVersion) {
      const version = parseFloat(
        vipNetCSP?.MajorVersion + '.' + vipNetCSP?.MinorVersion
      );

      haveValidVipNetCSPVersion = version >= oldestSupportedVipnetCSPVersion;
    }
  }

  return haveValidCryptoProCSPVersion || haveValidVipNetCSPVersion;
};

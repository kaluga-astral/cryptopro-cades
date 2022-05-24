import { CryptoError } from '../errors';
import { SystemInfo } from '../types/SystemInfo';
import { outputDebug } from '../utils';

import { getSystemInfo } from './getSystemInfo';
import { isSupportedCadesVersion } from './internal/isSupportedCadesVersion';
import { isSupportedCSPVersion } from './internal/isSupportedCSPVersion';

/**
 * Проверяет корректность настроек ЭП на машине.
 *
 * @returns {boolean} флаг корректности настроек.
 */
export const isValidSystemSetup = async (): Promise<boolean> => {
  let systemInfo: SystemInfo | null = null;
  let isValid = false;
  const logData = [];
  try {
    try {
      systemInfo = await getSystemInfo();
    } catch (error) {
      throw CryptoError.createCadesError(
        error,
        'Настройки ЭП на данной машине не верны'
      );
    }

    if (!isSupportedCadesVersion(systemInfo.cadesVersion)) {
      throw CryptoError.create(
        'CBP-3',
        'Не поддерживаемая версия плагина.',
        null
      );
    }

    if (!(systemInfo.cryptoProInstalled || systemInfo.vipNetInstalled)) {
      throw CryptoError.create(
        'CBP-8',
        'Не установлен ни один криптопровайдер.',
        null
      );
    }

    if (systemInfo.cspVersion && !isSupportedCSPVersion(systemInfo)) {
      throw CryptoError.create('CBP-4', 'Не поддерживаемая версия CSP', null);
    }
    isValid = true;
  } catch (error) {
    logData.push({ error });
  } finally {
    logData.push({ isValid });
    outputDebug('isValidSystemSetup >>', logData);
  }

  return isValid;
};

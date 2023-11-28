import { CryptoError } from '../errors';
import type { ISystemInfo } from '../types';
import { outputDebug } from '../utils';

import { getSystemInfo } from './getSystemInfo';
import { checkIsSupportedCSPVersion } from './internal/checkIsSupportedCSPVersion';
import { isSupportedCadesVersion } from './internal/isSupportedCadesVersion';

/**
 * Проверяет корректность настроек ЭП на машине.
 * @throws {CryptoError} в случае обнаружения ошибок, если не установлен криптопровайдер или версия не поддерживается.
 */
export const checkIsValidSystemSetup = async (): Promise<void> => {
  let systemInfo: ISystemInfo | null = null;
  const logData = [];

  try {
    try {
      systemInfo = await getSystemInfo();
    } catch (error) {
      throw CryptoError.createCadesError(
        error,
        'Настройки ЭП на данной машине не верны',
      );
    }

    if (!isSupportedCadesVersion(systemInfo.cadesVersion)) {
      throw CryptoError.create(
        'CBP-3',
        'Не поддерживаемая версия плагина.',
        null,
      );
    }

    if (!(systemInfo.cryptoProInstalled || systemInfo.vipNetInstalled)) {
      throw CryptoError.create(
        'CBP-8',
        'Не установлен ни один криптопровайдер.',
        null,
      );
    }

    await checkIsSupportedCSPVersion();
  } catch (error) {
    logData.push({ error });
    throw error;
  } finally {
    outputDebug(
      'checkIsValidSystemSetup >>',
      logData.length === 0 ? 'ok' : logData,
    );
  }
};

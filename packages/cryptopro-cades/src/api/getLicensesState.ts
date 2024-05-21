import {
  CADESCOM_PRODUCT_CSP,
  CADESCOM_PRODUCT_OCSP,
  CADESCOM_PRODUCT_TSP,
  CRYPTO_OBJECTS,
} from '../constants';
import type { ILicensesState } from '../types';
import { outputDebug } from '../utils';

import { createObject } from './createObject';
import { getSystemInfo } from './getSystemInfo';
import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { unwrap } from './internal/unwrap';

/**
 * Кэш информации о состоянии лицензий.
 */
let licensesStateCache: ILicensesState | null = null;

/**
 * Предоставляет информацию о лицензиях продуктов КриптоПро.
 */
export const getLicensesState = (
  resetCache: boolean = false,
): Promise<ILicensesState> => {
  if (resetCache) {
    licensesStateCache = null;
  }

  if (licensesStateCache) {
    return Promise.resolve(licensesStateCache);
  }

  return afterPluginLoaded(async () => {
    if (licensesStateCache) {
      return Promise.resolve(licensesStateCache);
    }

    const licensesState: ILicensesState = {
      csp: null,
      ocsp: null,
      tsp: null,
    };
    const logData = [];

    try {
      const { cryptoProInstalled } = await getSystemInfo();

      // Если установлен VipNet, то возвращаем null'ы
      if (!cryptoProInstalled) {
        return (licensesStateCache = licensesState);
      }

      const oLicense = await createObject(CRYPTO_OBJECTS.license);

      licensesState.csp = {
        isValid: Boolean(await unwrap(oLicense.IsValid(CADESCOM_PRODUCT_CSP))),
        validTo: await unwrap(oLicense.ValidTo(CADESCOM_PRODUCT_CSP)),
        firstInstallDate: await unwrap(
          oLicense.FirstInstallDate(CADESCOM_PRODUCT_CSP),
        ),
        companyName: await unwrap(oLicense.CompanyName(CADESCOM_PRODUCT_CSP)),
        serialNumber: await unwrap(oLicense.SerialNumber(CADESCOM_PRODUCT_CSP)),
      };

      licensesState.tsp = {
        isValid: Boolean(await unwrap(oLicense.IsValid(CADESCOM_PRODUCT_TSP))),
        validTo: await unwrap(oLicense.ValidTo(CADESCOM_PRODUCT_TSP)),
        firstInstallDate: await unwrap(
          oLicense.FirstInstallDate(CADESCOM_PRODUCT_TSP),
        ),
        companyName: await unwrap(oLicense.CompanyName(CADESCOM_PRODUCT_TSP)),
        serialNumber: await unwrap(oLicense.SerialNumber(CADESCOM_PRODUCT_TSP)),
      };

      licensesState.ocsp = {
        isValid: Boolean(await unwrap(oLicense.IsValid(CADESCOM_PRODUCT_OCSP))),
        validTo: await unwrap(oLicense.ValidTo(CADESCOM_PRODUCT_OCSP)),
        firstInstallDate: await unwrap(
          oLicense.FirstInstallDate(CADESCOM_PRODUCT_OCSP),
        ),
        companyName: await unwrap(oLicense.CompanyName(CADESCOM_PRODUCT_OCSP)),
        serialNumber: await unwrap(
          oLicense.SerialNumber(CADESCOM_PRODUCT_OCSP),
        ),
      };

      return (licensesStateCache = licensesState);
    } catch (error) {
      logData.push({ error });
      throw error;
    } finally {
      logData.push({ licensesState });
      outputDebug('getLicensesState >>', logData);
    }
  })();
};

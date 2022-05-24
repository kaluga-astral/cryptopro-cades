import {
  CAPICOM_MY_STORE,
  CAPICOM_STORE_OPEN_MODE,
  STORE_LOCATION,
  STORE_TYPE,
} from '../constants';
import { Certificate } from '../Certificate';
import { IStore } from '../types/cadesplugin/IStore';
import { outputDebug } from '../utils/outputDebug';
import { CryptoError } from '../errors';
import { ICertificates } from '../types/cadesplugin/ICertificates';
import { ICertificate } from '../types/cadesplugin/ICertificate';

import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { openStore } from './openStore';

/**
 * Кэш из запрошенных сертификатов.
 */
const certificatesCache = {};

/**
 * Возвращает список сертификатов из указанного хранилища.
 * @param {IStore} store Хранилище
 * @param {string} storeName Наименование хранилища.
 * @returns {Promise<Certificate[]>} .Список сертификатов.
 */
async function getCertificatesFromStore(store: IStore): Promise<Certificate[]> {
  const result: Certificate[] = [];
  let certificates: ICertificates;
  let certificatesCount = 0;
  try {
    certificates = await store.Certificates;
    certificatesCount = await certificates.Count;
  } catch (err) {
    throw CryptoError.createCadesError(
      err,
      'Ошибка получения списка сертификатов.'
    );
  }

  // проверяем пригодность и превращаем сертификаты в наш внутренний тип
  while (certificatesCount) {
    try {
      const certBin: ICertificate = await certificates.Item(
        certificatesCount--
      );
      const cert: Certificate = await Certificate.CreateFrom(certBin);

      // работаем только с гостовскими сертами
      if (cert.isGost) {
        result.push(cert);
      }
    } catch (err) {
      // не критичная ошибка, просто логируем
      CryptoError.createCadesError(err, 'Ошибка получения сертификата.');
    }
  }

  return result;
}

/**
 * Получить сертификаты из USB токенов.
 * @param {STORE_TYPE} storeType Тип хранилища ключей.
 * @returns {Promise<Certificate[]>} .Список сертификатов из USB токенов.
 */
async function ReadCertificatesFromUsbToken(): Promise<Certificate[]> {
  let store: IStore | null = null;
  try {
    store = await openStore(STORE_LOCATION.CADESCOM_CONTAINER_STORE);
    return await getCertificatesFromStore(store);
  } finally {
    await store?.Close();
  }
}

/**
 * Получить сертификаты из реестра.
 * @param {STORE_TYPE} storeType Тип хранилища ключей.
 * @returns {Promise<Certificate[]>} .Список сертификатов из реестра.
 */
async function ReadCertificatesFromRegistry(): Promise<Certificate[]> {
  let store: IStore | null = null;
  try {
    store = await openStore(
      STORE_LOCATION.CAPICOM_CURRENT_USER_STORE,
      CAPICOM_MY_STORE,
      CAPICOM_STORE_OPEN_MODE.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED
    );
    return await getCertificatesFromStore(store);
  } finally {
    await store?.Close();
  }
}

/**
 * Возвращает список валидных доступных для работы сертификатов.
 *
 * @param {STORE_TYPE} storeType из какого хранилища требуется получить сертификаты (из токена, реестра, все...).
 * @param {resetCache} resetCache перезапросить данные, игнорируя закэшированные данные.
 * @returns {Promise<Certificate[]>} .сертификаты.
 */
export function getCertificates(
  storeType: STORE_TYPE = STORE_TYPE.ALL,
  resetCache: boolean = false
): Promise<Certificate[]> {
  if (certificatesCache[storeType] && !resetCache) {
    return Promise.resolve(certificatesCache[storeType]);
  }
  return afterPluginLoaded(async () => {
    if (certificatesCache[storeType] && !resetCache) {
      return certificatesCache[storeType];
    }
    const logData = [];
    let result: Certificate[] = [];

    try {
      switch (storeType) {
        case STORE_TYPE.USB_TOKEN:
          result = await ReadCertificatesFromUsbToken();
          logData.push({ storeType, result });
          break;

        case STORE_TYPE.REGISTRY:
          result = await ReadCertificatesFromRegistry();
          logData.push({ storeType, result });
          break;

        case STORE_TYPE.ALL:
          result = await ReadCertificatesFromRegistry();
          logData.push({ storeType: 'registry', result });
          const usbTokenCertificates = await ReadCertificatesFromUsbToken();
          logData.push({ storeType: 'usb', result });
          result = result.concat(usbTokenCertificates);
          result = result.filter(
            (cert, index) =>
              result.findIndex(
                (_cert) => _cert.thumbprint === cert.thumbprint
              ) === index
          );
          break;

        default:
          let store: IStore | null = null;
          try {
            store = await openStore();

            result = await getCertificatesFromStore(store);
            logData.push({ storeType: 'default', result });
          } finally {
            await store?.Close();
          }
          break;
      }
    } catch (error) {
      logData.push({ error });
      throw error;
    } finally {
      logData.push({ result });
      outputDebug(`getCertificates(${storeType}) >>`, logData);
    }

    return (certificatesCache[storeType] = result);
  })();
}

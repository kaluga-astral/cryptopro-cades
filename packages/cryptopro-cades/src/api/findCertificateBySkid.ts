import type { Certificate } from '../Certificate';
import { STORE_TYPE } from '../constants';
import { CryptoError } from '../errors';

import { getCertificates } from './../api';

/**
 * Поиск в хранилищах сертификата.
 * @param {string} subjectKeyId -идентификатор ключа субъекта.
 * @param {STORE_TYPE} storeType в каком хранилище требуется поискать сертификат (из токена, реестра, все...).
 * @param {boolean} [checkPrivateKey=true] проводить проверку наличия закрытого ключа.
 * @throws {CryptoError} в случае ошибки.
 * @returns {@Promise<Certificate | undefined>} сертификат.
 */
export async function findCertificateBySkid(
  subjectKeyId: string,
  storeType: STORE_TYPE = STORE_TYPE.ALL,
  checkPrivateKey: boolean = true,
): Promise<Certificate | undefined> {
  if (!subjectKeyId) {
    const errorMessage =
      'Не указан идентификатор ключа субъекта искомого сертификата.';

    throw CryptoError.create('CBP-7', errorMessage, null, errorMessage);
  }

  try {
    return (await getCertificates(storeType, false, checkPrivateKey)).find(
      (c) => c.subjectKeyId == subjectKeyId,
    );
  } catch (err) {
    throw CryptoError.createCadesError(err, 'Ошибка получения сертификата.');
  }
}


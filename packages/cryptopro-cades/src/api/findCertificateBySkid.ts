import type { Certificate } from '../Certificate';
import { CryptoError } from '../errors';

import { getCertificates } from './../api';

/**
 * Поиск в хранилищах сертификата.
 * @param {string} subjectKeyId -идентификатор ключа субъекта.
 * @throws {CryptoError} в случае ошибки.
 * @returns {@Promise<Certificate | undefined>} сертификат.
 */
export async function findCertificateBySkid(
  subjectKeyId: string,
): Promise<Certificate | undefined> {
  if (!subjectKeyId) {
    const errorMessage =
      'Не указан идентификатор ключа субъекта искомого сертификата.';

    throw CryptoError.create('CBP-7', errorMessage, null, errorMessage);
  }

  try {
    return (await getCertificates()).find(
      (c) => c.subjectKeyId == subjectKeyId,
    );
  } catch (err) {
    throw CryptoError.createCadesError(err, 'Ошибка получения сертификата.');
  }
}

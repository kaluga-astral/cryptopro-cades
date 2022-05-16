import { CAPICOM_CERTIFICATE_FIND_TYPE } from '../constants';
import { Certificate } from '../Certificate';
import { CryptoError } from '../errors';

import { openStore } from './openStore';

/**
 * Поиск в хранилищах сертификата.
 * @param {string} thumbprint -отпечаток искомого сертификата.
 * @returns {Promise<Certificate | undefined>} сертификат.
 */
export async function findCertificateByThumbprint(
  thumbprint: string
): Promise<Certificate | undefined> {
  if (!thumbprint) {
    const errorMessage = 'Не указан отпечаток искомого сертификата.';
    throw CryptoError.create('CBP-7', errorMessage, null, errorMessage);
  }
  try {
    const cert = await (
      await (
        await (
          await openStore()
        ).Certificates
      ).Find(
        CAPICOM_CERTIFICATE_FIND_TYPE.CAPICOM_CERTIFICATE_FIND_SHA1_HASH,
        thumbprint
      )
    ).Item(1);

    return cert ? await Certificate.CreateFrom(cert) : undefined;
  } catch (err) {
    throw CryptoError.createCadesError(err, 'Ошибка получения сертификата.');
  }
}

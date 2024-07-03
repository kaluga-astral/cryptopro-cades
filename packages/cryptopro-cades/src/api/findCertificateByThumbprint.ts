import { CAPICOM_CERTIFICATE_FIND_TYPE } from '../constants';
import { Certificate } from '../Certificate';
import { CryptoError } from '../errors';
import type { IStore } from '../types';

import { openStore } from './openStore';
import { unwrap } from './internal/unwrap';

/**
 * Поиск в хранилищах сертификата.
 * @param {string} thumbprint -отпечаток искомого сертификата.
 * @param {boolean} [checkPrivateKey=true] проводить проверку наличия закрытого ключа.
 * @throws {CryptoError} в случае ошибки.
 * @returns {Promise<Certificate | undefined>} сертификат.
 */
export async function findCertificateByThumbprint(
  thumbprint: string,
  checkPrivateKey: boolean = true,
): Promise<Certificate | undefined> {
  if (!thumbprint) {
    const errorMessage = 'Не указан отпечаток искомого сертификата.';

    throw CryptoError.create('CBP-7', errorMessage, null, errorMessage);
  }

  let store: IStore | null = null;

  try {
    store = await openStore();

    const certificates = await unwrap(store.Certificates);
    const certFind = await unwrap(
      certificates.Find(
        CAPICOM_CERTIFICATE_FIND_TYPE.CAPICOM_CERTIFICATE_FIND_SHA1_HASH,
        thumbprint,
      ),
    );
    const cert = await unwrap(certFind.Item(1));

    return cert
      ? await Certificate.CreateFrom(cert, checkPrivateKey)
      : undefined;
  } catch (err) {
    throw CryptoError.createCadesError(err, 'Ошибка получения сертификата.');
  } finally {
    await unwrap(store?.Close());
  }
}

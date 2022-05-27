import { ICertificate } from '../types';
import { CAPICOM_CERT_INFO_TYPE } from '../constants';

import { canAsync } from './internal/canAsync';

/**
 * Получение информации из Сертификата.
 * @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/certificate-getinfo
 * @example
 *  const simpleName = await getCertInfo(cert, CAPICOM_CERT_INFO_TYPE.CAPICOM_CERT_INFO_SUBJECT_SIMPLE_NAME);
 *
 * @param {ICertificate} cert - объект сертификата.
 * @param {number|string} what - параметр, по которому находим и отдаем значение.
 * @throws {CryptoError} в случае ошибки.
 * @returns {string} запрошенная информация из сертификата.
 */
export async function getCertInfo(
  cert: ICertificate,
  what: CAPICOM_CERT_INFO_TYPE
): Promise<string> {
  const result = cert.GetInfo(what);

  if (canAsync() && result instanceof Promise) {
    return result;
  }
  return result;
}

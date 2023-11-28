import type { ICertificate } from '../types';
import type { CAPICOM_CERT_INFO_TYPE } from '../constants';

import { unwrap } from './internal/unwrap';

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
export function getCertInfo(
  cert: ICertificate,
  what: CAPICOM_CERT_INFO_TYPE,
): Promise<string> {
  return unwrap(cert.GetInfo(what));
}

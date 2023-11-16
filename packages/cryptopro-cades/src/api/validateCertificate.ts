import { Certificate } from '../Certificate';
import type { ICertificate } from '../types';

/**
 * Валидация сертификата.
 *
 *  @example
 *  validateCertificate(cert, async (cert) => await (await cert.IsValid()).Result)
 *
 * @param {ICertificate|Certificate} certificate - собственно сертификат.
 * @param {Function} customValidationFunc - иные условия валидации сертификата.
 * @throws {CryptoError} в случае ошибки.
 * @returns {Promise<string|null>} .null, если сертификат валиден.
 */
export async function validateCertificate(
  certificate: Certificate | ICertificate,
  customValidationFunc?: (
    cert: Certificate | ICertificate,
  ) => Promise<string | null>,
): Promise<string | null> {
  let result: string | null = null;
  const cert: Certificate =
    certificate instanceof Certificate
      ? certificate
      : // парсим если пришло сырое
        await Certificate.CreateFrom(certificate);

  if (customValidationFunc) {
    result = await customValidationFunc(cert);
  } else {
    const errors = [];

    if (!cert.hasPrivateKey) {
      errors.push('закрытый ключ недоступен');
    }

    const now = new Date();

    if (cert.notAfter && now < cert.notAfter) {
      errors.push('истёк срок его действия');
    }

    if (cert.notBefore && now > cert.notBefore) {
      errors.push('срок действия не наступил');
    }

    if (!cert.isGost) {
      errors.push('алгоритмы ГОСТ не поддерживаются');
    }

    if (errors.length) {
      result = 'Сертификат не прошел проверки: ' + errors.join(', ');
    }
  }

  return result;
}

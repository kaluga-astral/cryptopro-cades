import { Buffer } from 'buffer';

import { Certificate as x509Certificate } from 'pkijs';
import { fromBER } from 'asn1js';

import type { Certificate } from '../Certificate';
import {
  GOST_KEY_ALGORITHM_OIDS,
  attributeOids,
  subjectKeyIdExtensionOid,
} from '../constants/oids-dictionary';
import { CryptoError } from '../errors';

import { bufferToHex } from './bufferToHex';

/**
 * Получить данные из сертификата.
 * @param target Объект данных (issuer или subject).
 * @param attributeName Наименование извлекаемого атрибута.
 * @throws {CryptoError} в случае ошибки.
 * @returns Извлеченные данные.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseValue(target: any, attributeName: string): string {
  if (!target) {
    const errorMessage = `Не задан объект для извлечения атрибута ${attributeName}`;

    throw CryptoError.create('CBP-7', errorMessage, null, errorMessage);
  }

  return target?.typesAndValues?.find(
    ({ type }: { type: string }): boolean =>
      type == attributeOids[attributeName],
  )?.value?.valueBlock?.value;
}

/**
 * Нормализовать ИНН.
 * @param inn ИНН.
 * @returns нормализованный ИНН.
 * @example
 * in 004028031214, out 4028031214
 * in 402701356218, out 402701356218
 */
function normalizeInn(inn: string | null): string | null {
  return inn && inn.length == 12 && inn.startsWith('00')
    ? inn.substring(2, 12)
    : inn;
}

/**
 * Парсит данные сертификата.
 * @param certificate Сертификат.
 * @throws {CryptoError} в случае ошибки.
 */
export function parseCertificate(certificate: Certificate) {
  if (!certificate.certificateBase64Data) {
    const errorMessage = 'Не загружена открытая часть сертификата.';

    throw CryptoError.create('CBP-7', errorMessage, null, errorMessage);
  }

  try {
    const asn1 = fromBER(
      new Uint8Array(Buffer.from(certificate.certificateBase64Data, 'base64'))
        .buffer,
    );

    const parsedCert = new x509Certificate({ schema: asn1.result });

    const publishKeyAlgorithm =
      parsedCert.subjectPublicKeyInfo.algorithm.algorithmId;

    certificate.algorithm = publishKeyAlgorithm;
    certificate.isGost = GOST_KEY_ALGORITHM_OIDS.includes(publishKeyAlgorithm);

    const subjectKeyIdentifierExtension = parsedCert.extensions?.find(
      ({ extnID }: { extnID: string }): boolean =>
        extnID === subjectKeyIdExtensionOid,
    );

    certificate.subjectKeyId = bufferToHex(
      subjectKeyIdentifierExtension?.parsedValue?.valueBlock?.valueHex,
    );

    Object.keys(certificate.issuer).forEach((key) => {
      certificate.issuer[key] = parseValue(parsedCert.issuer, key);
    });

    Object.keys(certificate.subject).forEach((key) => {
      certificate.subject[key] = parseValue(parsedCert.subject, key);
    });

    certificate.issuer.inn = normalizeInn(certificate.issuer.inn);
    certificate.issuer.innLe = normalizeInn(certificate.issuer.innLe);
    certificate.subject.innLe = normalizeInn(certificate.subject.innLe);
    certificate.subject.inn = normalizeInn(certificate.subject.inn);

    // TODO: здесь можно допарсить данные из открытой части сертификата
  } catch (error) {
    throw CryptoError.create(
      'CBP-10',
      'Не удалось распарсить данные сертификата.',
      error,
    );
  }
}

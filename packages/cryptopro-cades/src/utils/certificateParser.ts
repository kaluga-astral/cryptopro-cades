import { Buffer } from 'buffer';

// @ts-ignore // TOOD: разобраться почему не находит модуль.
import { Certificate as x509Certificate } from 'pkijs';
import { fromBER } from 'asn1js';

import { Certificate } from '../Certificate';
import {
  GOST_KEY_ALGORITHM_OIDS,
  subjectKeyIdExtensionOid,
} from '../constants/oids-dictionary';
import { CryptoError } from '../errors';

import { bufferToHex } from './bufferToHex';

/**
 * Парсит данные сертификата.
 * @param certificate Сертификат.
 */
export function parseCertificate(certificate: Certificate) {
  if (!certificate.certificateBase64Data) {
    const errorMessage = 'Не загружена открытая часть сертификата.';
    throw CryptoError.create('CBP-7', errorMessage, null, errorMessage);
  }
  const asn1 = fromBER(
    new Uint8Array(Buffer.from(certificate.certificateBase64Data, 'base64'))
      .buffer
  );
  const parsedCert = new x509Certificate({ schema: asn1.result });

  const publishKeyAlgorithm =
    parsedCert.subjectPublicKeyInfo.algorithm.algorithmId;
  certificate.algorithm = publishKeyAlgorithm;
  certificate.isGost = GOST_KEY_ALGORITHM_OIDS.includes(publishKeyAlgorithm);

  const subjectKeyIdentifierExtension = parsedCert.extensions.find(
    ({ extnID }: { extnID: string }): boolean =>
      extnID === subjectKeyIdExtensionOid
  );
  certificate.subjectKeyId = bufferToHex(
    subjectKeyIdentifierExtension?.parsedValue?.valueBlock?.valueHex
  );

  // TODO: здесь можно допарсить данные из открытой части сертификата
}

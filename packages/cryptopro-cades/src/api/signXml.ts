import { Buffer } from 'buffer';

import { CryptoError } from '../errors';
import {
  CADESCOM_XML_SIGNATURE_TYPE,
  CRYPTO_OBJECTS,
  GOST_KEY_ALGORITHM_TYPES,
  XML_SIGNATURE_GOST_ALGORITHM_TYPE,
} from '../constants';
import { CPSigner, ICertificate } from '../types';
import { Certificate } from '../Certificate';
import { ISignedXml } from '../types/cadesplugin/ISignedXml';

import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { createObject } from './createObject';
import { setCryptoProperty } from './internal/setCryptoProperty';
import { validateCertificate } from './validateCertificate';

/**
 * Получить алгоритм вычисления подписи для Xml.
 * @param {Certificate} certificate сертификат.
 * @returns {string} алгоритм вычисления подписи.
 */
export const getXmlSignAlgorithmType = (certificate: Certificate): string => {
  switch (certificate.algorithm) {
    case GOST_KEY_ALGORITHM_TYPES.GOST_R3410_12_256:
      return XML_SIGNATURE_GOST_ALGORITHM_TYPE.XmlDsigGost3410Url2012256;

    case GOST_KEY_ALGORITHM_TYPES.GOST_R3410_12_512:
      return XML_SIGNATURE_GOST_ALGORITHM_TYPE.XmlDsigGost3410Url2012512;

    default:
      throw CryptoError.create(
        'CBP-9',
        `Неизвестный алгоритм (${certificate.algorithm}) при выборе типа алгоритма подписи XmlDSig.`,
        null
      );
  }
};

/**
 * Получить алгоритм вычисления хэша.
 * @param {Certificate} certificate сертификат.
 * @returns {string} алгоритм вычисления хэша.
 */
export const getXmlHashAlgorithmType = (certificate: Certificate): string => {
  switch (certificate.algorithm) {
    case GOST_KEY_ALGORITHM_TYPES.GOST_R3410_12_256:
      return XML_SIGNATURE_GOST_ALGORITHM_TYPE.XmlDsigGost3411Url2012256;

    case GOST_KEY_ALGORITHM_TYPES.GOST_R3410_12_512:
      return XML_SIGNATURE_GOST_ALGORITHM_TYPE.XmlDsigGost3411Url2012512;

    default:
      throw CryptoError.create(
        'CBP-9',
        `Неизвестный алгоритм (${certificate.algorithm}) при выборе типа алгоритма хэширования xml.`,
        null
      );
  }
};

/**
 * Подписать входные данные указанным сертификатом в формате XmlDSig.
 * @param {ICertificate | Certificate} certificate -сертификат пользователя.
 * @param {ArrayBuffer | string} data -входные данные для подписи в формате Base64 или ArrayBuffer.
 * @param {CADESCOM_XML_SIGNATURE_TYPE} xmlSignatureType - тип xml подписи.
 * @param {boolean} [doNotValidate=false] - не проводить валидацию сертификата.
 * @returns {Promise<string>} файл подписи в кодировке Base64.
 */
export const signXml = (
  certificate: ICertificate | Certificate,
  data: ArrayBuffer | string,
  xmlSignatureType: CADESCOM_XML_SIGNATURE_TYPE = CADESCOM_XML_SIGNATURE_TYPE.CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED,
  doNotValidate: boolean = false
): Promise<string> => {
  return afterPluginLoaded(async () => {
    if (!data) {
      const errorMessage = 'Не указаны данные для подписания.';
      throw CryptoError.create('CBP-7', errorMessage, null, errorMessage);
    }
    if (!certificate) {
      const errorMessage =
        'Не указан сертификат для вычисления электронной подписи.';
      throw CryptoError.create('CBP-7', errorMessage, null, errorMessage);
    }

    const base64String =
      data instanceof ArrayBuffer ? Buffer.from(data).toString('base64') : data;

    const cert: Certificate =
      certificate instanceof Certificate
        ? certificate
        : // парсим если пришло сырое
          await Certificate.CreateFrom(certificate);

    if (!doNotValidate && !!cert) {
      const errorMessage = await validateCertificate(cert);

      if (errorMessage) {
        throw CryptoError.create(
          'CBP-6',
          'Сертификат не прошел проверку при подписи.',
          null,
          errorMessage
        );
      }
    }

    const signer: CPSigner = await createObject(CRYPTO_OBJECTS.signer);
    const signedData: ISignedXml = await createObject(CRYPTO_OBJECTS.signedXml);

    // заполнение параметров для подписи
    try {
      setCryptoProperty(signer, 'Certificate', cert.certificateBin);

      // в криптопро браузер плагине не поддерживается подпись/расшифровка бинарных данных,
      // поэтому подписываем предварительно конвертированный в Base64
      setCryptoProperty(signedData, 'Content', base64String);

      // указываем тип подписи
      setCryptoProperty(signedData, 'SignatureType', xmlSignatureType);

      // указываем алгоритм подписи
      setCryptoProperty(
        signedData,
        'SignatureMethod',
        getXmlSignAlgorithmType(cert)
      );

      // указываем алгоритм хэширования
      setCryptoProperty(
        signedData,
        'DigestMethod',
        getXmlHashAlgorithmType(cert)
      );
    } catch (err) {
      throw CryptoError.createCadesError(
        err,
        'Ошибка при заполнении параметров подписания.'
      );
    }

    try {
      const signResult = signedData.Sign(signer);

      return signResult instanceof Promise ? await signResult : signResult;
    } catch (error) {
      throw CryptoError.createCadesError(
        error,
        'Ошибка при вычислении электронной подписи.'
      );
    }
  })();
};

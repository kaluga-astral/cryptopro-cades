import {
  ALLOW_EXPORT_FLAG,
  AT_KEYEXCHANGE,
  CERTIFICATE_TEMPLATE_MAJOR_VERSION,
  CERTIFICATE_TEMPLATE_MINOR_VERSION,
  CERT_POLICY_QUALIFIER_TYPE,
  CRYPTO_OBJECTS,
  CSP_NAME_MAX_LENGTH,
  SUBJECT_SIGN_TOOL_OID,
  XCN_CRYPT_STRING_BASE64,
  XCN_CRYPT_STRING_BASE64REQUESTHEADER,
} from '../constants';
import { CryptoError } from '../errors';
import { type CreateCSRInputDTO } from '../types/СreateCSRInputDTO';
import { outputDebug } from '../utils';

import { createObject } from './createObject';
import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { convertStringToUTF8ByteArray } from './internal/convertStringToUTF8ByteArray';
import { setCryptoProperty } from './internal/setCryptoProperty';

/**
 * Функция, формирующая контейнер и запрос на сертификат за один криптосеанс
 * @param {CreateCSRInputDTO} data данные для формирования контейнера и запроса на сертификат
 * @returns {Promise<string>} Строка, содержащая CSR в DER формате
 */
export const createCSR = (data: CreateCSRInputDTO): Promise<string> => {
  return afterPluginLoaded(async () => {
    const logData = [];

    logData.push({ data });

    try {
      // Формируем приватный ключ
      const pKey = await createObject(CRYPTO_OBJECTS.privateKey);

      await setCryptoProperty(pKey, 'ProviderName', data.providerName);
      await setCryptoProperty(pKey, 'ProviderType', data.providerCode);
      await setCryptoProperty(pKey, 'ContainerName', data.containerName);

      // containerPin === undefined –> КриптоПро и Випнет показывают свои окна для ввода пина
      // containerPin === ''        –> КриптоПро не защищает контейнер паролем, Випнет показывает свое окно
      if (data.containerPin !== undefined) {
        await setCryptoProperty(pKey, 'Pin', data.containerPin);
      }

      await setCryptoProperty(
        pKey,
        'ExportPolicy',
        data.isExportable ? ALLOW_EXPORT_FLAG : 0,
      );

      // помечаем, что ключ и для шифрования, и для подписывания
      // @see https://learn.microsoft.com/ru-ru/windows/win32/api/certenroll/ne-certenroll-x509keyspec
      await setCryptoProperty(pKey, 'KeySpec', AT_KEYEXCHANGE);

      // инициализируем запрос на сертификат
      const certRequestPkcs10 = await createObject(
        CRYPTO_OBJECTS.certificateRequest,
      );

      await certRequestPkcs10.InitializeFromPrivateKey(0x1, pKey, '');

      // описываем аттрибуты Subject сертификата
      const distinguishedName = await createObject(
        CRYPTO_OBJECTS.distinguishedName,
      );
      const dnValue = data.certAttributes
        .map((attr) => `${attr.oid}="${attr.value}"`)
        .join(', ');

      await distinguishedName.Encode(dnValue);
      await setCryptoProperty(certRequestPkcs10, 'Subject', distinguishedName);

      // объект с расширениями, который будем наполнять
      const extensions = await certRequestPkcs10.X509Extensions;

      // key usages сертификата
      const keyUsageExt = await createObject(CRYPTO_OBJECTS.extensionKeyUsage);

      await keyUsageExt.InitializeEncode(data.keyUsage);
      await extensions.Add(keyUsageExt);

      // описываем enhanced key usages сертификата
      const enhKeyUsageCollection = await createObject(
        CRYPTO_OBJECTS.objectIds,
      );

      for (const enhKeyOid of data.enhKeyUsage) {
        const enhKeyUsageOid = await createObject(CRYPTO_OBJECTS.objectId);

        await enhKeyUsageOid.InitializeFromValue(enhKeyOid);
        await enhKeyUsageCollection.Add(enhKeyUsageOid);
      }

      const enhancedKeyUsageExt = await createObject(
        CRYPTO_OBJECTS.extensionEnhancedKeyUsage,
      );

      await enhancedKeyUsageExt.InitializeEncode(enhKeyUsageCollection);
      // добавляем enhanced key usages в расширения сертификата
      await extensions.Add(enhancedKeyUsageExt);

      // описываем политики сертификата
      const certPolicyCollection = await createObject(
        CRYPTO_OBJECTS.certificatePolicies,
      );

      for (const policy of data.certPolicies) {
        const policyOid = await createObject(CRYPTO_OBJECTS.objectId);

        await policyOid.InitializeFromValue(policy.oid);

        const certPolicy = await createObject(CRYPTO_OBJECTS.certificatePolicy);

        await certPolicy.Initialize(policyOid);

        // если oid не полностью определяет политику, то необходимо определить и добавить квалификатор
        if (Boolean(policy.value.length)) {
          const policyQualifier = await createObject(
            CRYPTO_OBJECTS.policyQualifier,
          );

          await policyQualifier.InitializeEncode(
            policy.value,
            CERT_POLICY_QUALIFIER_TYPE.UNKNOWN,
          );

          const policyQualifierCollection = await certPolicy.PolicyQualifiers;

          await policyQualifierCollection.Add(policyQualifier);
        }

        await certPolicyCollection.Add(certPolicy);
      }

      const certPoliciesExt = await createObject(
        CRYPTO_OBJECTS.extensionCertificatePolicies,
      );

      await certPoliciesExt.InitializeEncode(certPolicyCollection);
      // добавляем политики в расширения сертификата
      await extensions.Add(certPoliciesExt);

      // subject sign tool (custom)
      // Необходимо добавлять руками, т.к. плагин может вписать только CryptoPRO CSP 5.0
      // @see https://aleksandr.ru/blog/dobavlenie_subjectsigntool_v_kriptopro_ecp_browser_plug_in
      // TODO: 09.2024 это поле станет необязательным, можно удалить код после доработок на УЦ
      const subjectSignToolOid = await createObject(CRYPTO_OBJECTS.objectId);

      await subjectSignToolOid.InitializeFromValue(SUBJECT_SIGN_TOOL_OID);

      // необходимо обрезать название (на деле оно всегда < 128 символов)
      const shortName = data.signTool.slice(0, CSP_NAME_MAX_LENGTH);
      const utf8arr = convertStringToUTF8ByteArray(shortName);

      // @see https://learn.microsoft.com/ru-ru/windows/win32/seccertenroll/about-utf8string
      const utf8stringTag = 0x0c;

      utf8arr.unshift(utf8stringTag, utf8arr.length);

      const base64String = btoa(
        // @ts-ignore TODO: обновить версию TS, 4.8.3 -> 4.9.5
        String.fromCharCode.apply(null, new Uint8Array(utf8arr)),
      );

      const subjectSignToolExt = await createObject(CRYPTO_OBJECTS.extension);

      await subjectSignToolExt.Initialize(
        subjectSignToolOid,
        XCN_CRYPT_STRING_BASE64,
        base64String,
      );

      // добавляем способ подписания в расширения сертификата
      await extensions.Add(subjectSignToolExt);

      // описываем и добавляем identification kind
      const identificationKindExt = await createObject(
        CRYPTO_OBJECTS.extensionIdentificationKind,
      );

      await identificationKindExt.InitializeEncode(data.identificationKind);
      await extensions.Add(identificationKindExt);

      // описываем и добавляем шаблон сертификата (если есть)
      if (data.templateOid) {
        const templateOid = await createObject(CRYPTO_OBJECTS.objectId);

        await templateOid.InitializeFromValue(data.templateOid);

        const templateExt = await createObject(
          CRYPTO_OBJECTS.extensionTemplate,
        );

        await templateExt.InitializeEncode(
          templateOid,
          CERTIFICATE_TEMPLATE_MAJOR_VERSION,
          CERTIFICATE_TEMPLATE_MINOR_VERSION,
        );

        extensions.Add(templateExt);
      }

      // добавляем NameValuePair со сроком действия сертификата для УЦ Основания
      if (data.validityPeriod && data.validityPeriodUnits) {
        const validityPeriodObj = await createObject(
          CRYPTO_OBJECTS.nameValuePair,
        );

        await validityPeriodObj.Initialize(
          'ValidityPeriod',
          data.validityPeriod,
        );

        const validityPeriodUnitsObj = await createObject(
          CRYPTO_OBJECTS.nameValuePair,
        );

        await validityPeriodUnitsObj.Initialize(
          'ValidityPeriodUnits',
          String(data.validityPeriodUnits),
        );

        const nameValuePairsObj = await certRequestPkcs10.NameValuePairs;

        await nameValuePairsObj.Add(validityPeriodUnitsObj);
        await nameValuePairsObj.Add(validityPeriodObj);
      }

      // запрос на сертификат
      const enroll = await createObject(CRYPTO_OBJECTS.enrollment);

      await enroll.InitializeFromRequest(certRequestPkcs10);

      const csr = await enroll.CreateRequest(
        XCN_CRYPT_STRING_BASE64REQUESTHEADER,
      );

      logData.push({ csr });

      return csr;
    } catch (error) {
      logData.push({ error });

      throw CryptoError.createCadesError(
        error,
        'Ошибка при формировании контейнера.',
      );
    } finally {
      outputDebug('createCSR >>', logData);
    }
  })();
};

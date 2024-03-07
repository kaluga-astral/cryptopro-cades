import {
  ALLOW_EXPORT_FLAG,
  AT_KEYEXCHANGE,
  CERT_POLICY_QUALIFIER_TYPE,
  CRYPTO_OBJECTS,
  CSP_NAME_MAX_LENGTH,
  SUBJECT_SIGN_TOOL_OID,
  XCN_CRYPT_STRING_BASE64,
  XCN_CRYPT_STRING_BASE64REQUESTHEADER,
} from '../constants';
import { outputDebug } from '../utils';

import { createObject } from './createObject';
import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { convertStringToUTF8ByteArray } from './internal/convertStringToUTF8ByteArray';
import { setCryptoProperty } from './internal/setCryptoProperty';

type Props = {
  providerName: string;
  providerCode: number;
  containerName: string;
  isExportable: boolean;
  attributes: { oid: string; value: string }[];
  /**
   * Сумма флагов назначения ключа
   * @see https://learn.microsoft.com/ru-ru/windows/win32/api/certenroll/ne-certenroll-x509keyusageflags
   */
  keyUsage: number;
  /**
   * Массив oid'ов
   */
  enhKeyUsage: string[];
  certPolicies: { oid: string; value: string }[];
  signTool: string;
  identificationKind: number;
};

/**
 *
 * @param {Props} data
 * @returns {Promise<string>} Строка, содержащая CSR в DER формате
 */
export const createCertificateSigningRequest = (
  data: Props,
): Promise<string> => {
  return afterPluginLoaded(async () => {
    const logData = [];

    try {
      // Формируем приватный ключ
      const pKey = await createObject(CRYPTO_OBJECTS.privateKey);

      await setCryptoProperty(pKey, 'ProviderName', data.providerName);
      await setCryptoProperty(pKey, 'ProviderType', data.providerCode);
      await setCryptoProperty(pKey, 'ContainerName', data.containerName);

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
      const dnValue = data.attributes
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
        const enhKeyUsageObjectId = await createObject(CRYPTO_OBJECTS.objectId);

        await enhKeyUsageObjectId.InitializeFromValue(enhKeyOid);
        await enhKeyUsageCollection.Add(enhKeyUsageObjectId);
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
        const policyObject = await createObject(CRYPTO_OBJECTS.objectId);

        await policyObject.InitializeFromValue(policy.oid);

        const Policy = await createObject(CRYPTO_OBJECTS.certificatePolicy);

        await Policy.Initialize(policyObject);

        // если oid не полностью определяет политику, то необходимо определить и добавить квалификатор
        if (Boolean(policy.value.length)) {
          const policyQualifier = await createObject(
            CRYPTO_OBJECTS.policyQualifier,
          );

          await policyQualifier.InitializeEncode(
            policy.value,
            CERT_POLICY_QUALIFIER_TYPE.UNKNOWN,
          );

          const policyQualifierCollection = await Policy.PolicyQualifiers;

          await policyQualifierCollection.Add(policyQualifier);
        }

        await certPolicyCollection.Add(Policy);
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
      const subjectSignToolObject = await createObject(CRYPTO_OBJECTS.objectId);

      await subjectSignToolObject.InitializeFromValue(SUBJECT_SIGN_TOOL_OID);

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
        subjectSignToolObject,
        XCN_CRYPT_STRING_BASE64,
        base64String,
      );

      // добавляем способ подписания в расширения сертификата
      await extensions.Add(subjectSignToolExt);

      // identification kind
      const identificationKindExt = await createObject(
        CRYPTO_OBJECTS.extensionIdentificationKind,
      );

      await identificationKindExt.InitializeEncode(data.identificationKind);
      await extensions.Add(identificationKindExt);

      // запрос
      const enroll = await createObject(CRYPTO_OBJECTS.enrollment);

      await enroll.InitializeFromRequest(certRequestPkcs10);

      const certReq = await enroll.CreateRequest(
        XCN_CRYPT_STRING_BASE64REQUESTHEADER,
      );

      return certReq;
    } catch (error) {
      logData.push({ error });
      throw error.message;
    } finally {
      outputDebug('createCertificateSigningRequest >>', logData);
    }
  })();
};

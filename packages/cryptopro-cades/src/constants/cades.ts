/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Хранилище персональных сертификатов пользователя.
 */
export const CAPICOM_MY_STORE = 'My';

/**
 * Тип подписи XML-документа.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_enum/cadescom_xml_signature_type
 */
export enum CADESCOM_XML_SIGNATURE_TYPE {
  /**
   * Вложенная подпись.
   */
  CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED = 0,

  /**
   * Оборачивающая подпись.
   */
  CADESCOM_XML_SIGNATURE_TYPE_ENVELOPING = 1,

  /**
   * Подпись по шаблону.
   */
  CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE = 2,
}

/**
 * Тип подписи XAdES-XML-документа.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_enum/cadescom_xades_type
 */
export enum CADESCOM_XADES_TYPE {
  /**
   * Тип подписи по умолчанию (XAdES-X Long Type 1).
   */
  CADESCOM_XADES_DEFAULT = 0x00000010,

  /**
   * Тип подписи XAdES-A.
   */
  CADESCOM_XADES_A = 0x000007d0,

  /**
   * Тип подписи XAdES BES.
   */
  CADESCOM_XADES_BES = 0x00000020,

  /**
   * Тип подписи XAdES T.
   */
  CADESCOM_XADES_T = 0x00000050,

  /**
   * Тип подписи XAdES-X Long Type 1.
   */
  CADESCOM_XADES_X_LONG_TYPE_1 = 0x000005d0,

  /**
   * Тип подписи XMLDSIG.
   */
  CADESCOM_XMLDSIG_TYPE = 0x00000000,
}

/**
 * Тип усовершенствованной подписи.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_enum/cadescom_cades_type
 */
export const enum CADESCOM_CADES_TYPE {
  /**
   * Тип подписи по умолчанию (CAdES-X Long Type 1).
   */
  CADESCOM_CADES_DEFAULT = 0,

  /**
   * Тип подписи CAdES BES.
   */
  CADESCOM_CADES_BES = 1,

  /**
   * Тип подписи CAdES T.
   */
  CADESCOM_CADES_T = 0x5,

  /**
   * Тип подписи CAdES-X Long Type 1.
   */
  CADESCOM_CADES_X_LONG_TYPE_1 = 0x5d,

  /**
   * Тип подписи PKCS7.
   */
  CADESCOM_PKCS7_TYPE = 0xffff,
}

/**
 * Типы криптографических алгоритмов для XmlDsig
 * @see https://docs.cryptopro.ru/cades/plugin/plugin-methods?id=Константы
 * @see https://docs.cryptopro.ru/cades/plugin/plugin-samples/plugin-samples-sign-xml
 */
export enum XML_SIGNATURE_GOST_ALGORITHM_TYPE {
  /**
   * Алгоритм подписи для XmlDsig, ГОСТ 2001.
   */
  XmlDsigGost3410Url = 'urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102001-gostr3411',

  /**
   * URL Алгоритм подписи для XmlDsig, ГОСТ 2001.
   */
  XmlDsigGost3410UrlObsolete = 'http://www.w3.org/2001/04/xmldsig-more#gostr34102001-gostr3411',

  /**
   * Алгоритм хеширования для XmlDsig, ГОСТ 2001.
   */
  XmlDsigGost3411Url = 'urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr3411',

  /**
   * URL Алгоритм хеширования для XmlDsig, ГОСТ 2001.
   */
  XmlDsigGost3411UrlObsolete = 'http://www.w3.org/2001/04/xmldsig-more#gostr3411',

  /**
   * Алгоритм хеширования для XmlDsig, ГОСТ 2012 (256).
   */
  XmlDsigGost3411Url2012256 = 'urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34112012-256',

  /**
   * Алгоритм подписи для XmlDsig, ГОСТ 2012 (256).
   */
  XmlDsigGost3410Url2012256 = 'urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102012-gostr34112012-256',

  /**
   * Алгоритм хеширования для XmlDsig, ГОСТ 2012 (512).
   */
  XmlDsigGost3411Url2012512 = 'urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34112012-512',

  /**
   * Алгоритм подписи для XmlDsig, ГОСТ 2012 (512).
   */
  XmlDsigGost3410Url2012512 = 'urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102012-gostr34112012-512',
}

/**
 * The CAPICOM_CERTIFICATE_INCLUDE_OPTION enumeration type defines which certificates in a chain are saved.
 * This enumeration type was introduced in CAPICOM 2.0.
 * @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/capicom-certificate-include-option
 */
export enum CAPICOM_CERTIFICATE_INCLUDE_OPTION {
  /**
   * Saves all certificates in the chain with the exception of the root entity.
   */
  CAPICOM_CERTIFICATE_INCLUDE_CHAIN_EXCEPT_ROOT = 0,

  /**
   * Saves the complete certificate chain.
   */
  CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN = 1,

  /**
   * Saves only the end entity certificate.
   */
  CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY = 2,
}

/**
 * Способ кодирования данных для подписи.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_enum/cadescom_content_encoding_type
 */
export enum CADESCOM_ENCODING_TYPE {
  /**
   * Data is saved as a base64-encoded string or a pure binary sequence. This encoding type is used only for input data that has an unknown encoding type. Introduced in CAPICOM 2.0.
   */
  CADESCOM_ENCODE_ANY = -1,

  /**
   * Data is saved as a base64-encoded string.
   */
  CADESCOM_ENCODE_BASE64 = 0,

  /**
   * Data is saved as a pure binary sequence.
   */
  CADESCOM_ENCODE_BINARY = 1,
}

/**
 * Enumeration type indicates the encoding type used.
 * @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/capicom-encoding-type
 */
export enum CAPICOM_ENCODING_TYPE {
  /**
   * Data is saved as a base64-encoded string or a pure binary sequence. This encoding type is used only for input data that has an unknown encoding type. Introduced in CAPICOM 2.0.
   */
  CAPICOM_ENCODE_ANY = 0xffffffff,

  /**
   * Data is saved as a base64-encoded string.
   */
  CAPICOM_ENCODE_BASE64 = 0,

  /**
   * Data is saved as a pure binary sequence.
   */
  CAPICOM_ENCODE_BINARY = 1,
}

/**
 * Используется как параметр при открытии Хранилища через @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/store-open
 * Позволяет задать уровень доступа к открываемому Хранилищу.
 * @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/capicom-store-open-mode
 */
export enum CAPICOM_STORE_OPEN_MODE {
  /**
   * Open the store in read-only mode.
   */
  CAPICOM_STORE_OPEN_READ_ONLY = 0,

  /**
   * Open the store in read/write mode.
   */
  CAPICOM_STORE_OPEN_READ_WRITE = 1,

  /**
   * Open the store in read/write mode if the user has read/write permissions. If the user does not have read/write permissions, open the store in read-only mode.
   */
  CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = 2,

  /**
   * Open existing stores only; do not create a new store. Introduced by CAPICOM 2.0.
   */
  CAPICOM_STORE_OPEN_EXISTING_ONLY = 128,

  /**
   * Include archived certificates when using the store. Introduced by CAPICOM 2.0.
   */
  CAPICOM_STORE_OPEN_INCLUDE_ARCHIVED = 256,
}

/**
 * Типы для указания расположения хранилища сертификатов.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_enum/cadescom_store_location
 * @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/capicom-store-location
 */
export enum STORE_LOCATION {
  /**
   * Хранилище сертификатов в памяти компьютера. Любые изменения недопустимы.
   */
  CAPICOM_MEMORY_STORE = 0,
  CADESCOM_MEMORY_STORE = 0,

  /**
   * Хранилище сертификатов компьютера. Если открыто на чтение/запись, то у вас есть права на изменения.
   */
  CAPICOM_LOCAL_MACHINE_STORE = 1,
  CADESCOM_LOCAL_MACHINE_STORE = 1,

  /**
   * Хранилище сертификатов текущего пользователя. Доступ для изменения доступен для текущего пользователя.
   */
  CAPICOM_CURRENT_USER_STORE = 2,
  CADESCOM_CURRENT_USER_STORE = 2,

  /**
   * Хранилище сертификатов в Active Directory.. Доступно только для чтения. Нельзя добавить или удалить сертификаты из данного хранилища.
   */
  CAPICOM_ACTIVE_DIRECTORY_USER_STORE = 3,

  /**
   * Хранилище сертификатов на смарткартах (поддерживается только с КриптоПро CSP 5.0.11823 и выше). Объявлено и доступно с CAPICOM 2.0.
   */
  CAPICOM_SMART_CARD_USER_STORE = 4,

  /**
   * Хранилище сертификатов из контейнеров закрытых ключей. В данный Store попадают все сертификаты из контейнеров закрытых ключей, которые доступны в системе в момент открытия.
   * Доступно с CAdESCOM Plugin 2.0.13292
   */
  CADESCOM_CONTAINER_STORE = 100,
}

/**
 * The CAPICOM_CERT_INFO_TYPE enumeration type defines what information is to be queried from a certificate.
 * @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/capicom-cert-info-type
 * @type {number}
 */
export enum CAPICOM_CERT_INFO_TYPE {
  /**
   * Returns the display name from the certificate subject.
   */
  CAPICOM_CERT_INFO_SUBJECT_SIMPLE_NAME = 0,

  /**
   * Returns the display name of the issuer of the certificate.
   */
  CAPICOM_CERT_INFO_ISSUER_SIMPLE_NAME = 1,

  /**
   * Returns the email address of the certificate subject.
   */
  CAPICOM_CERT_INFO_SUBJECT_EMAIL_NAME = 2,

  /**
   * Returns the email address of the issuer of the certificate.
   */
  CAPICOM_CERT_INFO_ISSUER_EMAIL_NAME = 3,

  /**
   * Returns the UPN of the certificate subject. Introduced in CAPICOM 2.0.
   */
  CAPICOM_CERT_INFO_SUBJECT_UPN = 4,

  /**
   * Returns the UPN of the issuer of the certificate. Introduced in CAPICOM 2.0.
   */
  CAPICOM_CERT_INFO_ISSUER_UPN = 5,

  /**
   * Returns the DNS name of the certificate subject. Introduced in CAPICOM 2.0.
   */
  CAPICOM_CERT_INFO_SUBJECT_DNS_NAME = 6,

  /**
   * Returns the DNS name of the issuer of the certificate. Introduced in CAPICOM 2.0.
   */
  CAPICOM_CERT_INFO_ISSUER_DNS_NAME = 7,
}

/**
 * The CAPICOM_CERTIFICATE_FIND_TYPE enumeration type defines the type of search criteria used to find specific certificates. This enumeration type was introduced in CAPICOM 2.0.
 * @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/capicom-certificate-find-type
 * @type {number}
 */
export enum CAPICOM_CERTIFICATE_FIND_TYPE {
  /**
   * Returns certificates matching a specified SHA1 hash.
   */
  CAPICOM_CERTIFICATE_FIND_SHA1_HASH = 0,

  /**
   * Returns certificates whose subject name exactly or partially matches a specified subject name.
   */
  CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1,

  /**
   * Returns certificates whose issuer name exactly or partially matches a specified issuer name.
   */
  CAPICOM_CERTIFICATE_FIND_ISSUER_NAME = 2,

  /**
   * Returns certificates whose root subject name exactly or partially matches a specified root subject name.
   */
  CAPICOM_CERTIFICATE_FIND_ROOT_NAME = 3,

  /**
   * Returns certificates whose template name matches a specified template name.
   */
  CAPICOM_CERTIFICATE_FIND_TEMPLATE_NAME = 4,

  /**
   * Returns certificates that have an extension that matches a specified extension.
   */
  CAPICOM_CERTIFICATE_FIND_EXTENSION = 5,

  /**
   * Returns certificates that have an extended property whose property identifier matches a specified property identifier.
   */
  CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY = 6,

  /**
   * Returns certificates in the store that have either an enhanced key usage extension or property combined with a usage identifier.
   */
  CAPICOM_CERTIFICATE_FIND_APPLICATION_POLICY = 7,

  /**
   * Returns certificates containing a specified policy OID.
   */
  CAPICOM_CERTIFICATE_FIND_CERTIFICATE_POLICY = 8,

  /**
   * Returns certificates whose time is valid.
   */
  CAPICOM_CERTIFICATE_FIND_TIME_VALID = 9,

  /**
   * Returns certificates whose time is not yet valid.
   */
  CAPICOM_CERTIFICATE_FIND_TIME_NOT_YET_VALID = 10,

  /**
   * Returns certificates whose time has expired.
   */
  CAPICOM_CERTIFICATE_FIND_TIME_EXPIRED = 11,

  /**
   * Returns certificates containing a key that can be used in the specified manner.
   */
  CAPICOM_CERTIFICATE_FIND_KEY_USAGE = 12,
}

/**
 * The CAPICOM_KEY_USAGE enumeration defines the ways in which a key can be used. Introduced in CAPICOM 2.0.
 * @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/capicom-key-usage
 * @type {number}
 */
export enum CAPICOM_KEY_USAGE {
  /**
   * The key can be used to create a digital signature.
   */
  CAPICOM_DIGITAL_SIGNATURE_KEY_USAGE = 128,

  // other enums omited.
}

//region (cert.Find(..)) https://docs.microsoft.com/en-us/windows/win32/seccrypto/capicom-propid
/**
 * Возвращает DWORD значение, указывающее на закрытый ключ из
 *  CERT_KEY_CONTEXT_PROP_ID, если он есть.
 *  Иначе, если CERT_KEY_PROV_INFO_PROP_ID есть,
 *  то он будет источником dwKeySpec.
 *  (Find(CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY,CERT_KEY_SPEC_PROP_ID)
 *   - вернет сертификаты, у к-ых есть ссылка на закрытый ключ)
 * @type {number}
 */
export const CERT_KEY_SPEC_PROP_ID = 6;

/**
 * Свойства хэш объекта.
 * @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/capicom-propid
 * @type {number}
 */
export enum CAPICOM_PROPID {
  /**
   * Неизвестный тип свойства.
   */
  CAPICOM_PROPID_UNKNOWN = 0,

  /**
   * Обработчик ключа контейнера с Криптопровайдером.
   */
  CAPICOM_PROPID_KEY_PROV_HANDLE = 1,
  /**
   * Вывод только сертификатов с информацией о контейнерах с Криптопровайдером.
   */
  CAPICOM_PROPID_KEY_PROV_INFO = 2,

  /**
   * The properties of a hash object.
   */
  CAPICOM_PROPID_HASH_PROP = 3,

  /**
   * A SHA1 hash object.
   */
  CAPICOM_PROPID_SHA1_HASH = 3,

  /**
   * An MD5 hash object.
   */
  CAPICOM_PROPID_MD5_HASH = 4,

  /**
   * The key context.
   */
  CAPICOM_PROPID_KEY_CONTEXT = 5,

  /**
   * The specifications for a key.
   */
  CAPICOM_PROPID_KEY_SPEC = 6,

  /**
   * Information about whether the hash of the public key is reserved.
   */
  CAPICOM_PROPID_PUBKEY_HASH_RESERVED = 8,

  /**
   * A certificate trust list (CTL) usage.
   */
  CAPICOM_PROPID_CTL_USAGE = 9,

  /**
   * An enhanced key usage (EKU).
   */
  CAPICOM_PROPID_ENHKEY_USAGE = 9,

  /**
   * The location of the next update to the certificate revocation list (CRL).
   */
  CAPICOM_PROPID_NEXT_UPDATE_LOCATION = 10,

  /**
   * A human-readable name.
   */
  CAPICOM_PROPID_FRIENDLY_NAME = 11,

  /**
   * A file that contains a private key.
   */
  CAPICOM_PROPID_PVK_FILE = 12,

  /**
   * A human-readable description.
   */
  CAPICOM_PROPID_DESCRIPTION = 13,

  /**
   * The state of the access.
   */
  CAPICOM_PROPID_ACCESS_STATE = 14,

  /**
   * A hash of the signature.
   */
  CAPICOM_PROPID_SIGNATURE_HASH = 15,

  /**
   * Smart card data.
   */
  CAPICOM_PROPID_SMART_CARD_DATA = 16,

  /**
   * An Encrypting File System (EFS).
   */
  CAPICOM_PROPID_EFS = 17,

  /**
   * Data created using the cryptographic protocols and algorithms owned by the National Institute of Standards and Technology (NIST).
   */
  CAPICOM_PROPID_FORTEZZA_DATA = 18,

  /**
   * Information about whether the object is archived.
   */
  CAPICOM_PROPID_ARCHIVED = 19,

  /**
   * A key identifier.
   */
  CAPICOM_PROPID_KEY_IDENTIFIER = 20,

  /**
   * Auto-enrollment information for a certificate.
   */
  CAPICOM_PROPID_AUTO_ENROLL = 21,

  /**
   * Parameters for a public key algorithm.
   */
  CAPICOM_PROPID_PUBKEY_ALG_PARA = 22,

  /**
   * Information used to update dynamic cross certificates.
   */
  CAPICOM_PROPID_CROSS_CERT_DIST_POINTS = 23,

  /**
   * Information about whether the object is reserved in Internet Explorer 3.0.
   */
  CAPICOM_PROPID_ISSUER_PUBLIC_KEY_MD5_HASH = 24,

  /**
   * The MD5 hash of the subject's public key.
   */
  CAPICOM_PROPID_SUBJECT_PUBLIC_KEY_MD5_HASH = 25,

  /**
   * Information about the certificate's enrollment.
   */
  CAPICOM_PROPID_ENROLLMENT = 26,

  /**
   * A date stamp.
   */
  CAPICOM_PROPID_DATE_STAMP = 27,

  /**
   * The MD5 hash of the issuer's serial number.
   */
  CAPICOM_PROPID_ISSUER_SERIAL_NUMBER_MD5_HASH = 28,

  /**
   * The MD5 hash of the subject's name.
   */
  CAPICOM_PROPID_SUBJECT_NAME_MD5_HASH = 29,

  /**
   * Extended information about an error.
   */
  CAPICOM_PROPID_EXTENDED_ERROR_INFO = 30,

  /**
   * Information about the renewal of a certification authority.
   */
  CAPICOM_PROPID_RENEWAL = 64,

  /**
   * An archived hash of a key.
   */
  CAPICOM_PROPID_ARCHIVED_KEY_HASH = 65,

  /**
   * Information about the first reservation.
   */
  CAPICOM_PROPID_FIRST_RESERVED = 66,

  /**
   * Information about the most recent reservation.
   */
  CAPICOM_PROPID_LAST_RESERVED = 0x00007fff,

  /**
   * Information about the first user.
   */
  CAPICOM_PROPID_FIRST_USER = 0x00008000,

  /**
   * Information about the most recent user.
   */
  CAPICOM_PROPID_LAST_USER = 0x0000ffff,
}

export const CAPICOM_OID_OTHER = 0;

export const CAPICOM_OID_KEY_USAGE_EXTENSION = 10;

export const CAPICOM_EKU_CLIENT_AUTH = 2;

export const CAPICOM_EKU_SMARTCARD_LOGON = 5;

export const CAPICOM_EKU_OTHER = 0;

export const CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME = 0;

export const CAPICOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_NAME = 1;

export const CAPICOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_DESCRIPTION = 2;

export const CADESCOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME = 0;

export const CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_NAME = 1;

export const CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_DESCRIPTION = 2;

export const CADESCOM_AUTHENTICATED_ATTRIBUTE_MACHINE_INFO = 0x100;

export const CADESCOM_ATTRIBUTE_OTHER = -1;

export const CADESCOM_STRING_TO_UCS2LE = 0;

export const CADESCOM_BASE64_TO_BINARY = 1;

export const CADESCOM_DISPLAY_DATA_NONE = 0;

export const CADESCOM_DISPLAY_DATA_CONTENT = 1;

export const CADESCOM_DISPLAY_DATA_ATTRIBUTE = 2;

/**
 * Тип алгоритма шифрования.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_enum/cadescom_encryption_algorithm
 */
export enum CADESCOM_ENCRYPTION_ALGORITHM {
  /**
   * Алгоритм RSA RC2.
   */
  CADESCOM_ENCRYPTION_ALGORITHM_RC2 = 0,

  /**
   * Алгоритм RSA RC4.
   */
  CADESCOM_ENCRYPTION_ALGORITHM_RC4 = 1,

  /**
   * Алгоритм DES.
   */
  CADESCOM_ENCRYPTION_ALGORITHM_DES = 2,

  /**
   * Алгоритм 3DES.
   */
  CADESCOM_ENCRYPTION_ALGORITHM_3DES = 3,

  /**
   * Алгоритм AES.
   */
  CADESCOM_ENCRYPTION_ALGORITHM_AES = 4,

  /**
   * Алгоритм ГОСТ 28147-89.
   */
  CADESCOM_ENCRYPTION_ALGORITHM_GOST_28147_89 = 25,
}

/**
 * Тип алгоритма хэширования.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_enum/cadescom_hash_algorithm
 */
export enum CADESCOM_HASH_ALGORITHM {
  /**
   * Алгоритм SHA1.
   */
  CADESCOM_HASH_ALGORITHM_SHA1 = 0,

  /**
   * Алгоритм MD2.
   */
  CADESCOM_HASH_ALGORITHM_MD2 = 1,

  /**
   * Алгоритм MD4.
   */
  CADESCOM_HASH_ALGORITHM_MD4 = 2,

  /**
   * Алгоритм MD5.
   */
  CADESCOM_HASH_ALGORITHM_MD5 = 3,

  /**
   * Алгоритм SHA1 с длиной ключа 256 бит.
   */
  CADESCOM_HASH_ALGORITHM_SHA_256 = 4,

  /**
   * Алгоритм SHA1 с длиной ключа 384 бита.
   */
  CADESCOM_HASH_ALGORITHM_SHA_384 = 5,

  /**
   * Алгоритм SHA1 с длиной ключа 512 бит.
   */
  CADESCOM_HASH_ALGORITHM_SHA_512 = 6,

  /**
   * Алгоритм ГОСТ Р 34.11-94.
   */
  CADESCOM_HASH_ALGORITHM_CP_GOST_3411 = 100,

  /**
   * Алгоритм ГОСТ Р 34.11-2012 с длиной ключа 256 бит.
   */
  CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256 = 101,

  /**
   * 	Алгоритм ГОСТ Р 34.11-2012 с длиной ключа 512 бит.
   */
  CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_512 = 102,

  /**
   * Алгоритм ГОСТ Р 34.11-94 HMAC.
   */
  CADESCOM_HASH_ALGORITHM_CP_GOST_3411_HMAC = 110,

  /**
   * Алгоритм ГОСТ Р 34.11-2012 HMAC.
   */
  CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256_HMAC = 111,

  /**
   * Алгоритм ГОСТ Р 34.11-2012 HMAC.
   */
  CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_512_HMAC = 112,
}

export const CADESCOM_AllowNone = 0;

export const CADESCOM_AllowNoOutstandingRequest = 0x1;

export const CADESCOM_AllowUntrustedCertificate = 0x2;

export const CADESCOM_AllowUntrustedRoot = 0x4;

export const CADESCOM_SkipInstallToStore = 0x10000000;

export const CADESCOM_InstallCertChainToContainer = 0x20000000;

export const CADESCOM_UseContainerStore = 0x40000000;

export const ENABLE_CARRIER_TYPE_CSP = 0x01;

export const ENABLE_CARRIER_TYPE_FKC_NO_SM = 0x02;

export const ENABLE_CARRIER_TYPE_FKC_SM = 0x04;

export const ENABLE_ANY_CARRIER_TYPE = 0x07;

export const DISABLE_EVERY_CARRIER_OPERATION = 0x00;

export const ENABLE_CARRIER_OPEN_ENUM = 0x01;

export const ENABLE_CARRIER_CREATE = 0x02;

export const ENABLE_ANY_OPERATION = 0x03;

export const CADESCOM_PRODUCT_CSP = 0;

export const CADESCOM_PRODUCT_OCSP = 1;

export const CADESCOM_PRODUCT_TSP = 2;

/**
 * Тип медиа.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_enum/cadescom_media_type
 */
export const enum CADESCOM_MEDIA_TYPE {
  /**
   * Реестр.
   */
  MEDIA_TYPE_REGISTRY = 0x00000001,

  /**
   * Жесткий диск.
   */
  MEDIA_TYPE_HDIMAGE = 0x00000002,

  /**
   * Облачный носитель.
   */
  MEDIA_TYPE_CLOUD = 0x00000004,

  /**
   * Смарт-карта или любое другое устройство с интерфейсом смарт-карты.
   */
  MEDIA_TYPE_SCARD = 0x00000008,
}

export const XCN_CRYPT_STRING_BASE64HEADER = 0;

export const AT_KEYEXCHANGE = 1;

export const AT_SIGNATURE = 2;

export const CARRIER_FLAG_REMOVABLE = 1;

export const CARRIER_FLAG_UNIQUE = 2;

export const CARRIER_FLAG_PROTECTED = 4;

export const CARRIER_FLAG_FUNCTIONAL_CARRIER = 8;

export const CARRIER_FLAG_SECURE_MESSAGING = 16;

export const CARRIER_FLAG_ABLE_VISUALISE_SIGNATURE = 64;

export const CARRIER_FLAG_VIRTUAL = 128;

/**
 * OID (атрибут) сертификата.
 * The OID object represents an object identifier (OID) that is used by several CAPICOM properties.
 * @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/oid
 */
export interface CAPICOM_OID {
  readonly CAPICOM_OID_OTHER: 0;
  readonly CAPICOM_OID_KEY_USAGE_EXTENSION: 10;
  readonly CAPICOM_OID_AUTHORITY_KEY_IDENTIFIER_EXTENSION: 1;
  readonly CAPICOM_OID_KEY_ATTRIBUTES_EXTENSION: 2;
  readonly CAPICOM_OID_CERT_POLICIES_95_EXTENSION: 3;
  readonly CAPICOM_OID_KEY_USAGE_RESTRICTION_EXTENSION: 4;
  readonly CAPICOM_OID_LEGACY_POLICY_MAPPINGS_EXTENSION: 5;
  readonly CAPICOM_OID_SUBJECT_ALT_NAME_EXTENSION: 6;
  readonly CAPICOM_OID_ISSUER_ALT_NAME_EXTENSION: 7;
  readonly CAPICOM_OID_BASIC_CONSTRAINTS_EXTENSION: 8;
  readonly CAPICOM_OID_SUBJECT_KEY_IDENTIFIER_EXTENSION: 9;
  readonly CAPICOM_OID_PRIVATEKEY_USAGE_PERIOD_EXTENSION: 11;
  readonly CAPICOM_OID_SUBJECT_ALT_NAME2_EXTENSION: 12;
  readonly CAPICOM_OID_ISSUER_ALT_NAME2_EXTENSION: 13;
  readonly CAPICOM_OID_BASIC_CONSTRAINTS2_EXTENSION: 14;
  readonly CAPICOM_OID_NAME_CONSTRAINTS_EXTENSION: 15;
  readonly CAPICOM_OID_CRL_DIST_POINTS_EXTENSION: 16;
  readonly CAPICOM_OID_CERT_POLICIES_EXTENSION: 17;
  readonly CAPICOM_OID_POLICY_MAPPINGS_EXTENSION: 18;
  readonly CAPICOM_OID_AUTHORITY_KEY_IDENTIFIER2_EXTENSION: 19;
  readonly CAPICOM_OID_POLICY_CONSTRAINTS_EXTENSION: 20;
  readonly CAPICOM_OID_ENHANCED_KEY_USAGE_EXTENSION: 21;
  readonly CAPICOM_OID_CERTIFICATE_TEMPLATE_EXTENSION: 22;
  readonly CAPICOM_OID_APPLICATION_CERT_POLICIES_EXTENSION: 23;
  readonly CAPICOM_OID_APPLICATION_POLICY_MAPPINGS_EXTENSION: 24;
  readonly CAPICOM_OID_APPLICATION_POLICY_CONSTRAINTS_EXTENSION: 25;
  readonly CAPICOM_OID_AUTHORITY_INFO_ACCESS_EXTENSION: 26;
  readonly CAPICOM_OID_SERVER_AUTH_EKU: 100;
  readonly CAPICOM_OID_CLIENT_AUTH_EKU: 101;
  readonly CAPICOM_OID_CODE_SIGNING_EKU: 102;
  readonly CAPICOM_OID_EMAIL_PROTECTION_EKU: 103;
  readonly CAPICOM_OID_IPSEC_END_SYSTEM_EKU: 104;
  readonly CAPICOM_OID_IPSEC_TUNNEL_EKU: 105;
  readonly CAPICOM_OID_IPSEC_USER_EKU: 106;
  readonly CAPICOM_OID_TIME_STAMPING_EKU: 107;
  readonly CAPICOM_OID_CTL_USAGE_SIGNING_EKU: 108;
  readonly CAPICOM_OID_TIME_STAMP_SIGNING_EKU: 109;
  readonly CAPICOM_OID_SERVER_GATED_CRYPTO_EKU: 110;
  readonly CAPICOM_OID_ENCRYPTING_FILE_SYSTEM_EKU: 111;
  readonly CAPICOM_OID_EFS_RECOVERY_EKU: 112;
  readonly CAPICOM_OID_WHQL_CRYPTO_EKU: 113;
  readonly CAPICOM_OID_NT5_CRYPTO_EKU: 114;
  readonly CAPICOM_OID_OEM_WHQL_CRYPTO_EKU: 115;
  readonly CAPICOM_OID_EMBEDED_NT_CRYPTO_EKU: 116;
  readonly CAPICOM_OID_ROOT_LIST_SIGNER_EKU: 117;
  readonly CAPICOM_OID_QUALIFIED_SUBORDINATION_EKU: 118;
  readonly CAPICOM_OID_KEY_RECOVERY_EKU: 119;
  readonly CAPICOM_OID_DIGITAL_RIGHTS_EKU: 120;
  readonly CAPICOM_OID_LICENSES_EKU: 121;
  readonly CAPICOM_OID_LICENSE_SERVER_EKU: 122;
  readonly CAPICOM_OID_SMART_CARD_LOGON_EKU: 123;
  readonly CAPICOM_OID_PKIX_POLICY_QUALIFIER_CPS: 124;
  readonly CAPICOM_OID_PKIX_POLICY_QUALIFIER_USERNOTICE: 125;
}

/**
 * Список крипто-объектов для передачи в createObject, (cadesplugin|capicom).CreateObject|CreateObjectAsync()
 */
export const enum CRYPTO_OBJECTS {
  /**
   * Объект позволяющий взаимодействовать с хранилищем сертификатов.
   * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/store
   */
  store = 'CAdESCOM.Store',

  /**
   * Объект задающий параметры создания и содержащий информацию об усовершенствованной подписи.
   * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cpsigner
   */
  signer = 'CAdESCOM.CPSigner',

  /**
   * Объект задающий способ подписания Xml файла.
   * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/signedxml
   */
  signedXml = 'CAdESCOM.SignedXML',

  /**
   * Объект предоставляет свойства и методы для работы с подписанным документом XML.
   * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/about
   */
  about = 'CAdESCOM.About',

  /**
   * Объект предоставляет функционал по усовершенствованной подписи.
   * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cadessigneddata
   */
  signedData = 'CAdESCOM.CadesSignedData',

  /**
   * Объект предоставляет функционал для вычисления хэша.
   * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cphasheddata
   */
  hashedData = 'CAdESCOM.HashedData',

  /**
   * Объект предоставляет функционал по шифрованию/расшифровке сообщения.
   * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cpenvelopeddata
   */
  envelopedData = 'CAdESCOM.CPEnvelopedData',

  /**
   * Объект сертификат.
   * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cpcertificate
   */
  certificate = 'CAdESCOM.Certificate',

  /**
   * Объект позволяет получить информацию о доступных криптопровайдерах.
   * @see https://docs.cryptopro.ru/cades/plugin/certenroll/ccspinformations?id=ccspinformations
   */
  cspInformations = 'X509Enrollment.CCspInformations',
}

/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Типы ГОСТовских алгоритмов.
 */
export enum GOST_KEY_ALGORITHM_TYPES {
  /**
   * Алгоритм ГОСТ Р 34.10-2012 для ключей длины 256 бит.
   */
  GOST_R3410_12_256 = '1.2.643.7.1.1.1.1',

  /**
   * Алгоритм ГОСТ Р 34.10-2012 для ключей длины 512 бит
   */
  GOST_R3410_12_512 = '1.2.643.7.1.1.1.2',
}

/**
 * OID ГОСТовских алгоритмов.
 */
export const GOST_KEY_ALGORITHM_OIDS: string[] = Object.values(
  GOST_KEY_ALGORITHM_TYPES,
);

/**
 * OID SubjectKeyId расширения в сертификате.
 */
export const subjectKeyIdExtensionOid = '2.5.29.14';

/**
 * OID атрибутов сертификата.
 */
export const attributeOids = {
  commonName: '2.5.4.3',
  surname: '2.5.4.4',
  name: '2.5.4.42',
  country: '2.5.4.6',
  locality: '2.5.4.7',
  region: '2.5.4.8',
  street: '2.5.4.9',
  organisation: '2.5.4.10',
  department: '2.5.4.11',
  post: '2.5.4.12',
  ogrnip: '1.2.643.100.5',
  ogrn: '1.2.643.100.1',
  snils: '1.2.643.100.3',
  inn: '1.2.643.3.131.1.1',
  innLe: '1.2.643.100.4',
  email: '1.2.840.113549.1.9.1',
};

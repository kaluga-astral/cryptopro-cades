import type { WithOptionalPromise } from '../WithOptionalPromise';

import type { CPHashedData } from './CPHashedData';
import type { ICertificate } from './ICertificate';

/**
 * Значение электронной подписи.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/rawsignature
 */
export interface IRawSignature {
  /**
   * Вычисляет значение электронной подписи.
   * @param hashedData Объект CPHashedData, соответствующий хэш-значению, для которого следует вычислить значение электронной подписи.
   * @param certificate Сертификат, на ключе которого следует вычислить значение электронной подписи.
   * По умолчанию не задан, при этом выбор сертификата для подписи производится аналогично методу Sign объекта CAPICOM.SignedData
   * при отсутствии первого параметра (только для Windows).
   */
  SignHash(
    hashedData: CPHashedData,
    certificate: ICertificate,
  ): WithOptionalPromise<string>;

  /**
   * Проверяет значение электронной подписи на основе переданного хэш-значения.
   * @param hashedData Объект CAdESCOM.HashedData, соответствующий хэш-значению, для которого следует проверить значение электронной подписи.
   * @param certificate Сертификат, на ключе которого следует проверить значение электронной подписи.
   * @param rawSignature Значение электронной подписи в виде строки шестнадцатеричных цифр, группами по две цифры на байт, разделённых пробелами.
   */
  VerifyHash(
    hashedData: CPHashedData,
    certificate: ICertificate,
    rawSignature: string,
  ): WithOptionalPromise<void>;
}

import type {
  CADESCOM_CADES_TYPE,
  CADESCOM_ENCODING_TYPE,
} from '../../constants';
import type { WithOptionalPromise } from '../WithOptionalPromise';

import type { CPHashedData } from './CPHashedData';
import type { CPSigner } from './CPSigner';

/**
 * Усовершенствованная подпись.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cadessigneddata
 */
export type CadesSignedData = {
  /**
   * Способ кодирования данных для подписи.
   */
  ContentEncoding: WithOptionalPromise<CADESCOM_ENCODING_TYPE>;

  /**
   * Данные для подписи.
   */
  Content: WithOptionalPromise<string>;

  /**
   * Создает усовершенствованную подпись.
   * @param signer Объект CPSigner или CAPICOM.Signer, который будет использован для создания подписи.
   * По умолчанию не задан, при этом выбор сертификата для подписи производится аналогично методу Sign объекта CAPICOM.SignedData при отсутствии первого параметра.
   * Таким же образом выбор сертификата для подписи производится в случае, если параметр signer задан, но не содержит сертификата для подписи.
   * @param cadesType Тип усовершенствованной подписи (см. CADESCOM_CADES_TYPE). По умолчанию CAdES-X Long Type 1.
   * @param bDetached Вид подписи: отделенная (true) или совмещенная (false). По умолчанию совмещенная.
   */
  SignCades(
    signer: CPSigner,
    cadesType: CADESCOM_CADES_TYPE,
    bDetached?: boolean,
  ): WithOptionalPromise<string>;

  /**
   * Создает усовершенствованную подпись.
   * @param hashData Объект HashedData, соответствующий хэш-значению, для которого следует создать подписанное CMS-сообщение.
   * @param signer Объект CPSigner или CAPICOM.Signer, который будет использован для создания подписи.
   * По умолчанию не задан, при этом выбор сертификата для подписи производится аналогично методу Sign объекта CAPICOM.SignedData при отсутствии первого параметра.
   * Таким же образом выбор сертификата для подписи производится в случае, если параметр signer задан, но не содержит сертификата для подписи.
   * @param cadesType Тип усовершенствованной подписи (см. CADESCOM_CADES_TYPE). По умолчанию CAdES-X Long Type 1.
   * @returns Base64 строка.
   */
  SignHash(
    hashData: CPHashedData,
    signer: CPSigner,
    cadesType: CADESCOM_CADES_TYPE,
  ): WithOptionalPromise<string>;

  // тут есть еще методы CoSign, Sign, Verify, CoSignCades, VerifyHash и т.п.
};

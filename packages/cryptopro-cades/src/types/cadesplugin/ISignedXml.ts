import type { WithOptionalPromise } from '../WithOptionalPromise';

import type { CPSigner } from './CPSigner';

/**
 * Предоставляет свойства и методы для работы с подписанным документом XML.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_interface/isignedxml
 */
export interface ISignedXml {
  /**
   * Создает подпись в формате XmlDSig.
   * @param signer Объект CPSigner, который будет использован для создания подписи.
   * @param xpath XPath-запрос для поиска элементов , в которых следует создать подпись.
   * Если данный параметр не задан, то подпись будет создана во всех элементах ,
   * в которых отсутствует или не заполнен вложенный элемент .
   * Данный параметр используется только при создании подписи по шаблону.
   * Для остальных типов подписи параметр XPath будет проигнорирован.
   * @returns Подписанный документ XML.
   */
  Sign(signer: CPSigner, xpath?: string): WithOptionalPromise<string>;

  /**
   * Проверяет подпись под документом XML.
   * @param signedMessage Подписанный документ XML.
   * Документ должен быть в кодировке UTF-8.
   * Если кодировка документа отличается от UTF-8, то его следует закодировать в BASE64.
   * @param xpath XPath-запрос для поиска проверяемых элементов <Signature xmlns="http://www.w3.org/2000/09/xmldsig#>.
   * Если данный параметр не задан, то будут проверены все элементы <Signature xmlns="http://www.w3.org/2000/09/xmldsig#> в документе.
   */
  Verify(signedMessage: string, xpath: string): WithOptionalPromise<void>;
}

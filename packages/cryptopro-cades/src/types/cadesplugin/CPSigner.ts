import type { WithOptionalPromise } from '../WithOptionalPromise';

import type { ICertificate } from './ICertificate';

/**
 * Объект, задающий параметры создания и содержащий информацию об усовершенствованной подписи.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cpsigner
 */
export type CPSigner = {
  /**
   * Сертификат подписанта.
   */
  Certificate: WithOptionalPromise<ICertificate>;

  /**
   * Адрес службы штампов времени.
   */
  TSAAddress: WithOptionalPromise<string>;

  /**
   * Проводить проверку цепочки сертификатов перед созданием подписи,
   * в том числе с учетом сроков действия закрытого ключа (private key usage period).
   */
  CheckCertificate: boolean;

  // тут есть еще много других методов и свойств. см по ссылке выше
};

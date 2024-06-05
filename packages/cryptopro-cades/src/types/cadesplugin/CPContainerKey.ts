import type { WithOptionalPromise } from '../WithOptionalPromise';
import { ICertificate } from './ICertificate';

/**
 * Объект для работы с ключом в ключевом контейнере.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cpcontainerkey
 */
export type CPContainerKey = {
  /**
   * Свойство для получения информации о наличии сертификата для данного ключа в ключевом контейнере.
   * Свойство доступно только для чтения.
   */
  HasCertificate: WithOptionalPromise<boolean>;

  /**
   * Сертификат для данного ключа из ключевого контейнера.
   */
  Certificate: WithOptionalPromise<ICertificate>;

  /**
   * Свойство для получения информации о возможности экспортировать ключ.
   * Свойство доступно только для чтения.
   */
  IsExportable: WithOptionalPromise<boolean>;

  /**
   * Возвращает дату истечения срока действия ключа.
   */
  ExpirationTime: WithOptionalPromise<Date>;

  // тут есть еще много других методов и свойств. см по ссылке выше
};
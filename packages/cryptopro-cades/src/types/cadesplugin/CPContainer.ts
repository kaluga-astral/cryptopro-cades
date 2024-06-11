import type { WithOptionalPromise } from '../WithOptionalPromise';
import { CPContainerKeys } from './CPContainerKeys';

/**
 * Объект для работы с ключевым контейнером.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cpcontainer
 */
export type CPContainer = {
  /**
   * Коллекция ключей, содержащихся в ключевом контейнере.
   */
  Keys: WithOptionalPromise<CPContainerKeys>;

  /**
   * Свойство задает флаг CRYPT_SILENT для запрета графического интерфейса при выполнении операций с данным контейнером.
   * Доступно только для записи. По умолчанию имеет значение false.
   */
  Silent: WithOptionalPromise<boolean>;

  // тут есть еще много других методов и свойств. см по ссылке выше
};
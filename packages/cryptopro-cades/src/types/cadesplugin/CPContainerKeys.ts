import type { WithOptionalPromise } from '../WithOptionalPromise';

import { CPContainerKey } from './CPContainerKey';

/**
 * Объект для работы с коллекцией ключей в ключевом контейнере.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cpcontainerkeys
 */
export type CPContainerKeys = {
  /**
   * Возвращает ключ с заданным индексом из коллекции.
   * @param index Порядковый номер
   */
  ItemByIndex(index: number): WithOptionalPromise<CPContainerKey>;

  /**
   * Возвращает количество ключей в коллекции.
   */
  Count: WithOptionalPromise<number>;
};

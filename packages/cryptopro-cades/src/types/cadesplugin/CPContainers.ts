import type { WithOptionalPromise } from '../WithOptionalPromise';

import { CPContainer } from './CPContainer';

/**
 * Объект для работы с коллекцией ключевых контейнеров.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cpcontainers
 */
export type CPContainers = {
  /**
   * Возвращает ключевой контейнер с заданным индексом из коллекции.
   * @param index Порядковый номер
   */
  ItemByIndex(index: number): WithOptionalPromise<CPContainer>;

  /**
   * Возвращает количество контейнеров.
   */
  Count: WithOptionalPromise<number>;
};

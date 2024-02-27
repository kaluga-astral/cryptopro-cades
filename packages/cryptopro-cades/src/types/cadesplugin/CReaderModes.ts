import type { WithOptionalPromise } from '../WithOptionalPromise';

import { CReaderMode } from './CReaderMode';

/**
 * Объект, содержащий информацию о режимах работы доступного считывателя.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_interface/icpreadermodes
 */
export type CReaderModes = {
  /**
   * Возвращает считыватель с заданным индексом из коллекции.
   * @param index Порядковый номер
   */
  ItemByIndex(index: number): WithOptionalPromise<CReaderMode>;

  /**
   * Возвращает количество считывателей.
   */
  Count: WithOptionalPromise<number>;
};

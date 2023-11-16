import type { WithOptionalPromise } from '../WithOptionalPromise';

/**
 * Хэш-значение данных.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cphasheddata
 */
export type CPHashedData = {
  /**
   * Возвращает или задает алгоритм хэширования.
   */
  Algorithm: WithOptionalPromise<number>;

  /**
   * Возвращает результат операции хэширования.
   */
  Value: WithOptionalPromise<string>;

  /**
   * Способ кодирования данных для хэширования.
   */
  DataEncoding: WithOptionalPromise<number>;

  /**
   * Позволяет проинициализировать объект готовым хэш-значением.
   * @param hash
   */
  SetHashValue(hash: string): WithOptionalPromise<void>;

  /**
   * Вычисляет хэш для заданной строки.
   * @param data строка для вычисления хэша.
   */
  Hash(data: string): WithOptionalPromise<void>;
};

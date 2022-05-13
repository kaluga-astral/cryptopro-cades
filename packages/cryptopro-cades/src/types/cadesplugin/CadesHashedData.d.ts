/**
 * Хэш-значение данных.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cphasheddata
 */
export declare type CPHashedData = {
  /**
   * Возвращает или задает алгоритм хэширования.
   */
  Algorithm: WithPromise<number>;

  /**
   * Возвращает результат операции хэширования.
   */
  Value: WithPromise<string>;

  /**
   * Способ кодирования данных для хэширования.
   */
  DataEncoding: WithPromise<number>;

  /**
   * Позволяет проинициализировать объект готовым хэш-значением.
   * @param hash
   */
  SetHashValue(hash: string): WithPromise<void>;

  /**
   * Вычисляет хэш для заданной строки.
   * @param data строка для вычисления хэша.
   */
  Hash(data: string): WithPromise<void>;
};

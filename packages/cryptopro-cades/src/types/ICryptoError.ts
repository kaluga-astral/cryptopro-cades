/**
 * Общий интерфейс ошибки.
 */
export type IErrorObject = ICryptoError | Error | IAnyError;

/**
 * Неопределенный тип ошибки.
 * Используется в @see CryptoError.
 */
export declare interface IAnyError {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Описывает ошибку криптографического модуля.
 * @see CryptoError
 * @implements CryptoError
 */
export interface ICryptoError extends Error {
  /**
   * Текст сообщения об ошибке, предназначенный для отображению пользователю.
   */
  message: string;

  /**
   * Название ошибки (Основной/короткий текст ошибки).
   * По нему можно идентифицировать место ошибки.
   */
  title: string;

  /**
   * Тип ошибки (обычный - Error, от CAdESCOM plugin - CAdES,...)
   */
  type: string;

  /**
   * Код ошибки.
   */
  code: string;
}

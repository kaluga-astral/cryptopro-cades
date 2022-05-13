/**
 * Общий интерфейс ошибки.
 */
type IErrorObject = ICryptoError | Error | IAnyError;

/**
 * Неопределенный тип ошибки.
 * Используется в @see CryptoError.
 */
export declare interface IAnyError {
  [key: string]: any;
}

/**
 * Описывает ошибку криптографического модуля.
 * @see CryptoError
 * @implements CryptoError
 */
export declare interface ICryptoError extends Error {
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

  /**
   * Стектрейс.
   */
  stack?: String;
}

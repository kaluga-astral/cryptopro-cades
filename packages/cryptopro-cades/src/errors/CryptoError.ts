import { getLastError } from '../api/getLastError';
import { IAnyError, ICryptoError, IErrorObject } from '../types';

import { CRYPTO_PRO_ERRORS, PLUGIN_ERRORS } from './errorCodes';
import PluginConfig from './../PluginConfig';

/**
 * Описывает ошибку криптографического модуля.
 *
 *  @example
 *  try{...}
 *  catch(err){
 *    throw CryptoError.createCadesError(err, "Ошибка инициализации контейнера")
 *  }
 *
 * @class feature/crypto/CryptoError
 * @extends Error
 */
export class CryptoError extends Error implements ICryptoError {
  /**
   * Исходный объект ошибки.
   */
  public InnerError: IErrorObject | null;

  /**
   * Правило для выяснения типа ошибки (источника ошибки).
   */
  private static _RULE_MATCHING_CODE: RegExp =
    /^(.*?)(?:(?:\.?\s?\(?0x)|(?:\.?$))/;

  /**
   * Код ошибки. Максимальная длина 16 символов.
   * Для идентификации также смотрите @see #title @see #type.
   */
  code: string = '';

  /**
   * Название ошибки (Основной/короткий текст ошибки).
   * По нему можно идентифицировать ошибку для изменения #message согласно
   *  требованиям системы.
   */
  title: string = '';

  /**
   * Текст сообщения об ошибке. Для пользователя.
   */
  message: string = '';

  /**
   * Тип ошибки (обычный - Error, от CAdESCOM plugin - CAdES,...)
   */
  type: string = 'Error';

  /**
   * Унаследовано от родительского класса Error.
   */
  name: string = '';

  /**
   * Приватный конструктор. Для создания экземпляра используйте статические методы @createCadesError и @create
   * @param err Объект ошибки.
   */
  private constructor(err: IErrorObject | null) {
    super();
    this.InnerError = err;
    this.message = err?.message;
    this.stack = err?.stack;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CryptoError);
    }
  }

  /**
   * Формирует текстовое представление ошибки в формате Код ошибки: Сообщение для пользователя
   * @returns
   */
  toString() {
    return [this.code, this.message].filter(Boolean).join(': ');
  }

  /**
   * Создает ошибку на основе ошибки от CryptoPro Browser Plugin.
   * @param err Объект ошибки.
   * @param title Описание ошибки (не показывается пользователю)
   * @returns {@CryptoError} Объект ошибки криптографического модуля.
   */
  public static createCadesError(
    err: IErrorObject,
    title: string
  ): CryptoError {
    const cryptoError = new CryptoError(err);

    err = err as IAnyError;
    cryptoError.code = err.code || CryptoError._extractCode(err);
    if (typeof cryptoError.code === 'string' && cryptoError.code.length > 16) {
      cryptoError.code = '';
    }
    let extractedMsg = '';
    if (!err.message) {
      extractedMsg = cryptoError._extractMessage(err);
    }
    cryptoError.title = title ?? err.message ?? extractedMsg;
    cryptoError.type = err.type ?? 'CAdES';
    cryptoError.type += ' < @astral/cades-plugin';
    cryptoError.message =
      CRYPTO_PRO_ERRORS.find((res) => res.code == cryptoError.code)?.message ??
      err.message ??
      extractedMsg;

    PluginConfig.notifyError(cryptoError);

    return cryptoError;
  }

  /**
   * Создает формализованную ошибку криптографического модуля с указанным кодом ошибки.
   * @param errorCode Объект ошибки.
   * @param title Описание ошибки (не показывается пользователю).
   * @param err Объект ошибки.
   * @param overrideMessage Текст ошибки который будет указан вместо стандартного из справочника.
   * @returns {@CryptoError} Объект ошибки криптографического модуля.
   */
  public static create(
    errorCode: keyof typeof PLUGIN_ERRORS,
    title: string,
    err: IErrorObject | null,
    overrideMessage?: string
  ): CryptoError {
    const cryptoError = new CryptoError(err);
    cryptoError.InnerError = err;
    cryptoError.type = 'Error';
    cryptoError.code = errorCode;
    cryptoError.title = title; // не показываем пользователю
    cryptoError.message = overrideMessage ?? PLUGIN_ERRORS[cryptoError.code];

    PluginConfig.notifyError(cryptoError);

    return cryptoError;
  }

  /**
   * Извлекаем код ошибки плагина (если это ошибка крипты).
   * @param {Error} err - объект ошибки.
   * @returns {number|string} .
   * @private
   */
  private static _extractCode(err: IErrorObject): number | string {
    const result =
      (err.message?.match(/\(?0x.{2,8}\)?/) ||
        err.message?.match(CryptoError._RULE_MATCHING_CODE) ||
        [])[0] || '';
    return result.replace(/[()]/g, '');
  }

  /**
   * Выдираем из объекта Ошибки сообщение.
   * @param {string|Error} err - объект ошибки, откуда вытащить собщение.
   * @returns {*|string} .
   * @private
   */
  private _extractMessage(err: IErrorObject): string | any {
    const fullErrorData = getLastError(err);
    const msg = typeof err === 'string' ? err : err.message;

    return (fullErrorData?.message || msg || '').replace(` (${this.code})`, '');
  }
}

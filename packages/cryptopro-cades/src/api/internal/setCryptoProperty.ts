import { CryptoError } from '../../errors';
import { deasync } from '../../utils/deasync';

import { canAsync } from './canAsync';

/**
 * описываем структуру параметр OBJ функции ниже.
 * интерфейс ради интерфейса >_<
 */
interface ICryptoObject {
  [key: string]: any;
}

/**
 * Устанавливаем значение в указанное свойство переданного объекта.
 * @param {object} obj - объект-цель.
 * @param {string} key - имя свойства.
 * @param {*} value - значение для свойства.
 * @returns {void} .
 */
export function setCryptoProperty(
  obj: ICryptoObject,
  key: string,
  value: any
): void {
  try {
    if (canAsync()) {
      deasync(obj[`propset_${key}`](value));
    } else {
      // eslint-disable-next-line no-param-reassign
      obj[key] = value;
    }
  } catch (err) {
    throw CryptoError.createCadesError(
      err,
      `Не удалось установить значение в поле ${key}`
    );
  }
}

import { deasync } from '../../utils/deasync';
import { ICertificate } from '../../types';

import { canAsync } from './canAsync';

/**
 * Получение информации из свойства Сертификата или Крипто-объекта.
 *
 *  @example
 *  const ValidFromDate = getCryptoProperty(cert, 'ValidFromDate');
 *
 * @param {*} cert - объект сертификата или иной крипто-объекта.
 * @param {string} what - свойство объекта.
 * @returns {*} .
 */
export function getCryptoProperty(cert: ICertificate, what: string): any {
  return canAsync() ? deasync(cert[what]) : cert[what];
}

import type { WithOptionalPromise } from '../WithOptionalPromise';
import { CPContainers } from './CPContainers';

import { CReaderModes } from './CReaderModes';

/**
 * Объект CCspInformation позволяет получить информацию о криптопровайдере.
 * @see https://docs.cryptopro.ru/cades/plugin/certenroll/ccspinformation
 */
export interface CCspInformation {
  /**
   * Инициализирует объект по имени криптопровайдера
   * @param {string} cryptoProviderName –
   */
  InitializeFromName(cryptoProviderName: string): WithOptionalPromise<void>;

  /**
   * Возвращает коллекцию доступных считывателей
   */
  GetReaderModes(): WithOptionalPromise<CReaderModes>;

  /**
   * 	Коллекция контейнеров, доступных при использовании параметра PP_ENUMCONTAINERS.
   */
  EnumContainers(): WithOptionalPromise<CPContainers>;

  // есть еще другие методы и свойства (см. по ссылке выше),
  // но для получения информации о вставленных токенах нужны только эти
}

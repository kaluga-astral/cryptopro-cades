export type CreateCSRInputDTO = {
  /**
   * Наименование СКЗИ
   */
  providerName: string;

  /**
   * Код СКЗИ
   */
  providerCode: number;

  /**
   * Имя контейнера, который необходимо создать.
   * Если в начало строки вставить Media нужного считывателя, СКЗИ не покажет диалог с выбором хранилища
   */
  containerName: string;

  /**
   * PIN-код для контейнера закрытого ключа.
   */
  containerPin?: string;

  /**
   * Флаг возможности экспорта закрытого ключа
   */
  isExportable: boolean;

  /**
   * Массив аттрибутов поля Subject
   */
  certAttributes: { oid: string; value: string }[];

  /**
   * Сумма флагов назначения ключа
   * @see https://learn.microsoft.com/ru-ru/windows/win32/api/certenroll/ne-certenroll-x509keyusageflags
   */
  keyUsage: number;

  /**
   * Массив oid'ов расширенных вариантов использования ключа
   */
  enhKeyUsage: string[];

  /**
   * Массив политик сертификата. Если передан value, то к политике добавляется квалификатор
   */
  certPolicies: { oid: string; value: string }[];

  /**
   * Subject Sign Tool – человеческое название используемого СКЗИ. С 09.2024 будет необязательным
   */
  signTool: string;

  /**
   * Тип идентификации в соответствии с 795 приказом ФСБ. Принимает значения {0, 1, 2, 3}
   */
  identificationKind: number;

  /**
   * Oid, сообщающий УЦ, какой шаблон следует использовать при выдаче или продлении сертификата
   */
  templateOid?: string;

  /**
   * Единица измерения срока действия будущего сертификата.
   * @important Данное поле распознает только УЦ Основание.
   * */
  validityPeriod?: string;

  /**
   * Срок действия будущего сертификата.
   * @important Данное поле распознает только УЦ Основание.
   * */
  validityPeriodUnits?: number;
};

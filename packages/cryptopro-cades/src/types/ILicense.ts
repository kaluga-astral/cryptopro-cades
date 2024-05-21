/**
 * Объект для работы с лицензиями на продукты КриптоПро.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cplicense?id=%d0%9e%d0%b1%d1%8a%d0%b5%d0%ba%d1%82-cplicense
 */
export type ILicense = {
  /** Сертификат подписанта. */
  companyName: string;

  /** Дата первой установки продукта. Формат DD.MM.YYYY */
  firstInstallDate: string;

  /** Серийный номер лицензии (последние символы скрыты звездочками)  */
  serialNumber: string;

  /** Срок действия лицензии. Строка формата "DD.MM.YYYY" или "Unlimited" или "Expired DD.MM.YYYY" */
  validTo: string;

  /** Флаг валидности лицензии */
  isValid: boolean;
};

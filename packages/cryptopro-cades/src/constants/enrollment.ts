/**
 * Ограничитель длины названия СКЗИ в поле Subject Sign Tool запроса на сертификат.
 * На практике все названия короче 127 символов, но ограничение необходимо,
 * чтобы в крайнем кейсе не сломать структуру запроса.
 *
 * DER формат имеет формат TLV (Type, Length, Value).
 * Длина рассчитывается по следующему принципу:
 * - Если значение первого байта между 0 и 127 включительно,
 *    то это и есть длина содержимого, начинающаяся со следующего байта. (наш случай)
 *
 * - Если первый бит установлен в единицу (то есть значение > 127),
 *    то мы исключаем эту единицу, а полученное значение - это сколько следующих байт содержат
 *    целочисленное значение длины, вычитываем значение из них. (случай, которого избегаем с помощью ограничения длины)
 *
 * @see https://habr.com/ru/articles/722732/
 */
export const CSP_NAME_MAX_LENGTH = 127;

/**
 * Сведения о версии расширения CertificateTemplate
 * @see https://learn.microsoft.com/ru-ru/windows/win32/api/certenroll/nn-certenroll-ix509extensiontemplate
 */
export const CERTIFICATE_TEMPLATE_MAJOR_VERSION = 1;

/**
 * Сведения о версии расширения CertificateTemplate
 * @see https://learn.microsoft.com/ru-ru/windows/win32/api/certenroll/nn-certenroll-ix509extensiontemplate
 */
export const CERTIFICATE_TEMPLATE_MINOR_VERSION = 0;

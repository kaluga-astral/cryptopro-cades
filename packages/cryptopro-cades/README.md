# @astral/cryptopro-cades

Библиотека для взаимодействия с [КриптоПро ЭЦП Browser plug-in](https://www.cryptopro.ru/products/cades/plugin)

[Changelog](changelog.md)

## Установка

TODO

## API surface

* sign - подпись файла (CMS)
* decrypt - расшифровка файла (CMS)
* encrypt - шифрование файла (CMS)
* findCertificateBySkid - поиск по значению из расширения сертификата SubjectKeyId (oid '2.5.29.14')
* findCertificateByThumprint - поиск сертификата по отпечатку (хэш sha-1)
* getCertificates - получение списка сертификатов, с возможностью указать тип хранилища для поиска (токены, реестры или всё и сразу)
    * сертификаты имеют в составе базовую информацию:
        * Открытая часть сертификата в формате Base64
        * Issuer
        * Subject
        * Thumbprint
        * SubjectKeyId
        * Name
        * ProviderName, ProviderType
        * HasPrivateKey
        * IsGost
        * ContainerName
        * И прочие параметры типа email, snils, ogrn, inn и т.п.

* getCryptoProviders - получение списка криптопровайдеров установленных на компьютере пользователя. Название, тип, версия.
* getSystemInfo - получение информации о системе пользователя - версия КриптоПро ЭЦП Browser plug-in, версия CSP (VipNet или CryptoPro)
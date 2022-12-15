# @astral/cryptopro-cades

Библиотека для взаимодействия с [КриптоПро ЭЦП Browser plug-in](https://www.cryptopro.ru/products/cades/plugin)

## Установка

```bash
npm install @astral/cryptopro-cades
```

## API surface

- sign - подпись файла (CMS)
- signXml - подпись файла (XmlDSig). Параметром управляется тип Enveloped, Enveloping, Template.
- decrypt - расшифровка файла (CMS)
- encrypt - шифрование файла (CMS)
- findCertificateBySkid - поиск по значению из расширения сертификата SubjectKeyId (oid '2.5.29.14')
- findCertificateByThumprint - поиск сертификата по отпечатку (хэш sha-1)
- getCertificates - получение списка сертификатов, с возможностью указать тип хранилища для поиска (токены, реестры или всё и сразу)

  - сертификаты имеют в составе базовую информацию:
    - Открытая часть сертификата в формате Base64
    - issuer
      - inn
      - innLe
      - commonName
    - subject
      - commonName
      - surname
      - name
      - country
      - locality
      - street
      - organization
      - department
      - post
      - ogrnip
      - ogrn
      - snils
      - innLe
      - inn
      - email
    - subjectName
    - thumbprint
    - subjectKeyId
    - name
    - providerName, providerType
    - hasPrivateKey
    - isGost
    - notBefore, notAfter,
    - algorithm

- getCryptoProviders - получение списка криптопровайдеров установленных на компьютере пользователя. Название, тип, версия.
- getSystemInfo - получение информации о системе пользователя - версия КриптоПро ЭЦП Browser plug-in, версия CSP (VipNet или CryptoPro)

- pluginConfig - возможность включить вывод отладочной информации, подписываться на все создаваемые исключения, отключать проверку корректности системы.

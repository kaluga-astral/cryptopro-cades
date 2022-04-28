# GIT

# Формат коммитов и pull requests

Для коммитов и pull requests включен commitlint. Ниже описан формат.

```
${ENUM}(${PACKAGE_NAME}): ${Что было сделано?}
```

ENUM:
- feat
- bug
- wip (work in progress)
- refactor
- doc
- build
- chore

PACKAGE_NAME:
- cryptopro-cades

## Примеры

### Valid
```
wip(cryptopro-cades): Начата работа на добавлением пропса color
```

```
feat(cryptopro-cades): Добавлен пропс color
```

### Invalid
```
feat(cryptopro-cades): Добавил пропс color
```

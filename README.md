# planfix-toggl-client

Клиент для [planfix-toggl-server](https://github.com/viasite/planfix-toggl-server), сам по себе ценности не представляет.

Деплой: при каждом пуше запускается travis, собирает приложение и выкладывает в gh-pages ветку. Ее использует planfix-toggl-server при сборке дистрибутива.

В package.json создано несколько задач для упрощения деплоя:

- `version` - запускается при переключении версии, делает всё, что нужно: changelog, push, release
- `release` - сам по себе не используется, только через `version`
- `deploy` - для ручной выкладки на `gh-pages`, мимо travis

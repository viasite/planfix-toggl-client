# planfix-toggl-client

Клиент для [planfix-toggl-server](https://github.com/viasite/planfix-toggl-server), сам по себе ценности не представляет.

Деплой: при каждом пуше запускается travis, собирает приложение и выкладывает в gh-pages ветку. Ее использует planfix-toggl-server при сборке дистрибутива.

В package.json создано несколько задач для упрощения деплоя:

- `version` - запускается при переключении версии, делает всё, что нужно: changelog, push, release
- `release` - сам по себе не используется, только через `version`
- `deploy` - для ручной выкладки на `gh-pages`, мимо travis

## Установка
Используйте yarn, npm не работает, возникает ошибка на import pages/index.vue, см:

- https://github.com/nuxt/nuxt.js/issues/4839
- https://github.com/webpack/webpack/issues/8656

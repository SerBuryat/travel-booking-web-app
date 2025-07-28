# Создать страницу для вкладки `Home`

## User story
При загрузке приложения, пользователь, первым делом, видит страницу `Home` (первая иконка в панели навигации).
На этой странице пользователь видит: поисковую строку по сервисам, список всех категорий, популярные сервисы (ограниченное кол-ов, штук 6), две ссылки `Registry service` и `Private policy`.

## Техническое задание

- Реализовать страницу `Home` (первая иконка для `Navbar`)
- Добавить список всех `tcategories`
- Добавить популярные сервисы (данные можно получить через `ServiceRepositry.getPopularServiceByNameLike(popularCount = 6)`)
- Также, в загаловке для популярных, добавить кнопку `All`, которая открывает список всех `tservices desc tservices.priority`
- В конце две кнопки `Registry service` и `Private policy`

## Верстка

- В самом верху, в `<Header>`, как и на других страницах `SearchBar`
- Ниже список `tcategories` в виде иконок с названием категорий
- Верхний ряд категорий крупные иконки, второй ряд, иконки поменьше
- Список категорий имеет `scrollbar` по вертикали
- Ниже идет список популярных сервисов в виде: сверху подпись `Popular` справа, а слева кнопка `All`, далее список из 6 популярных сервисов в 2 колонки
- В самом низу две кнопки `Registry service` и `Private policy`, в одну колонку

## Дизайн

- Список категорий: верхний ряд размер иконок - `1/3`, нижний ряд размер иконок - `1/4`
- Список популярных сервисов: `Popular` `fontSize = 13px`, `weight = 400`, кнопка `All` - в виде текста, `fontColor = #007AFF`, `fontSize = 16px`, `weight = 600`, описание популярного сервиса можно брать `ShortViewServiceComponent`
- `Registry service` и `Private policy` - две текстовые кнопки: `fontSize = 13px`, `weight = 400`, `align = center`

## Функциональность

- для списка всех категорий создать `CategoryRepository.getAllCategories()` и отдельный `use client` компонент `AllCategoriesForHomeComponent` и передавать в него список категорий
- список популярных сервисов, для получения данных - `ServiceRepositry.getPopularServiceByNameLike(popularCount = 6)`, для отображения `ShortViewServiceComponent`, для этого также создаем `useClient` компонент `PopularServicesForHomeComponent` и передаем в него популярные сервисы
- `Registry service` и `Private policy` - открывают модельное окно, каждая со своим простым draft наполнением, на твой выбор исходя из контекста нашего приложения, для каждой создаем `use client` `PrivatePolicyButton` и `use client` `RegistryServiceButton`

## Рекомендации

Придерживаться текущей структуры проекта.
`/repository` - для получения данных из БД
Модель `page` серверный компонент, который загружает данные, `use client` компоненты отображают эти данные.
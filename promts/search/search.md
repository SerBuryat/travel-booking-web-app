# Search feature

Create `search` feature for `SearchBar` component.

## Functionality

- User type `<user-words-typed-in>` in `SearchBar` component
- Click `enter` (or relative on mobile phone)
- Router push user to `/catalog/services?search=<user-words-typed-in>`
- `/catalog/services` server page goes to DB and search in `tservices.name like %<user-words-typed-in>%`
- `/catalog/services` server page send found `tservices` to `SearchedServicesView` `use client` component which 
  shows found `tservices`

## Todo

- remove all mock features for `SearchBar` component;
- create function `getAllServiceByLikeName()` in `ServiceRepository` which helps to find `tservices` where 
`<user-words-typed-in>` may be at start/middle/end of `tservices.name`
- `<user-words-typed-in>` must be at least 3 chars to enable searching (if not show the hint with `red` color is 
  search field)
- create `/catalog/services` page
- create `SearchedServicesView`
- create `CancelSerachButton` - push user to `/catalog`
- create `AllServicesButton` - push to `/catalog/services?ids=1,2,3,4,5,6,7`, `ids` list of `tservices`

## Layout

- `<Header>`: `SearchBar` 2/3 size and `CancelSerachButton` at the right with 1/4 size
- Lower, the list of `ChildCategoryButton`, as example, `/catalog/<catalogId>/services`
- `ChildCategoryButton` list get from `tcategories where tcategories.id in 
(<list-of-categories-id-from-found-tservices-in-search>)`
- Lower, `Popular` text at the left and `AllServicesButton` button at the right
- Lower found `tservices` only first 2 example in row, 2 column
- Found services is `ShortViewServiceComponent` component
- Lower, `Catalog` components - list of parent categories

## Design

- `CancelSerachButton` and `AllServicesButton` - texted blue buttons
- `SearchBar`: when user click on it, move `search glass` icon to the left of the `SearchBar` and on the left add 
  `x` circle grey button

## Recommendations 

- if some component reuse from several places, move it to components
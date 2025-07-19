# Services v1

Page with list of `services`(`tservice where tcategories_id = <categoryId>`).

## Layout

- in the `<header>` component (`CategoryHeaderComponent`) with `tcategories.name` and as a background `tcategories.
photo`
- lower `SearchBar` component like in the `category` page
- lower list of `ShortViewServiceComponent` (`tservices`) including this `category`
- `ShortViewServiceComponent` list layout is 2 columns with 2 services on each
- `ShortViewServiceComponent` list is scrollable
- every `ShortViewServiceComponent` include: `tservices.photo`(there is no column `photo` in table `tservices` yet, 
  I add it later, just use some random gradient picture), `name`, `description`

## Design

- `CategoryHeaderComponent`: `name` - font color white, font weight 700, align center, `photo` - background (if no 
  `photo` use some random gradient picture)
- `CategoryHeaderComponent` has radius `10px`
- `ShortViewServiceComponent`: `tservices.photo` as a header, `name` - font color black, font weight 600, 
  `description` - font color `#707579`, font weight `400`, if `description` is huge just - hide it
- `ShortViewServiceComponent` has radius `10px`
- `ShortViewServiceComponent` list components has white blur effect when goes to `navbar`, this blur hides overflow

## Functionality

- create api `/catalog/[categoryId]/services` to fetch `services` by `categoryId`
- make `ShortViewServiceComponent` clickable, after click just show modal windows with `service`: `name`, 
  `description`, etc.

## Recommendations

- don't create `service` page for single `service` we create it later!
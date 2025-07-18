# Catalog v1

Page with list of `categories`(`tcategories`).

## Layout

- list of horizontal components each with  `tcategories.photo`, `tcategories.name` and arrow `>` which shows - this 
  element is interactive
- scrollable in vertical, 8 elements shows, other is need to be scrolled 

## Design 

- `category` component: `photo` on the left, `name` in the middle, `>` on the right
- `category` has border at the bottom: 80% size of `category` component with and light-grey-color
- `photo` - `40x40` size with rounded borders
- `>` - `16x16` size 
- `name` - `17px` font size

## Functionality

- (mock) just show a message in model windows with list all service (`tservices`) found by `tcategories_id` or 
  message `no services found for category: {id} - {code} - {name}` 

## Recommendations

- for `entities` we just use only: `tcategories` and `tservices` and their FK `tcategories_id`, don't create all 
  entities and for `tservices` use only `id`, `description`, `tcategories_id`, `price`
- use best practice according nextjs + prisma in case of `entity`, `repository` etc.
- common design choices for our app: font - inter, 

# Catalog v2

## Layout 

- remove previous requirement about only 8 elements of category shows, use all screen with until `navbar` at the bottom
- show vertical scroll only when user scrolling

## Design

- `photo` form is not a circle but rectangle with rounded corners `10px`
- `name` not in the middle between `photo` and `>` but closer to `name`, gap `20px` between `photo` and `name`
- `name` `weight = 400` 
- `>` `color = #707579`
- `searchbar` placeholder with `magnifying glass` image or icon and `Search` word 
- `searchbar` background color `#7676801F`
- `searchbar` rounded rectangle form with `10px` radius

## Functionality
- at the top of page remove title `Catalog` and add `searchbar`
- `searchbar` use most uses component for this (it's just mock for now, lets we show user message what he types in)

# Catalog v3

## Layout

- `searchbar` is sticky at the top of screen
- when scrolling categories, last one, is partly covered by `navbar`, `category` must visible, full component

## Design

- put placeholder (glass and word) in the middle of `searchbar`
- categories list element must be less width than `navbar` (make `navbar` wider or `categories` list less via 
  `margin` for whole `categories` list element)
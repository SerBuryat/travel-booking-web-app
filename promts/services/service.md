# Service v1

Page with single `service`(`tservice where id = <serviceId>`).

## Layout

- `Header` component - `photo` carousel (now just use color gradient images instead `photo` list)
- Lower `name`
- Lower `address` (there is no `address` column now, just use mock text `address`)
- Lower `description`: word `Description` and then `description`

## Design

- `photo` carousel - full width screen
- `description` - font size `24px`, weight `700`
- `address` - font size `15px`, color `#AAAAAA`, weight `400`
- `Description` word - font size `15px`, color `#707579`
- `description` text - font size `17px`, color `black`, weight `400`
- full `description` component has background color `light gray`

## Functionality

- create api to get `service` by `id`
- `photo` carousel has `dots` at the bottom of image which show the current `photo`
- each `photo` carousel has timeout for showing - `5 sec` then go to the next `photo`

# Recommendations

- for `photo` carousel use some famous component or library (if there is no, create `ImageCarousel` component)
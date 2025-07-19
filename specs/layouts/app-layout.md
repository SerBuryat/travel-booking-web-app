# App layout 

## General

- According to `Next.js` practices use `router layouts` for our app
- Use next layout structure
```
<header>
<main>
<footer>
```
- `<footer>` in the every page will be `navbar` (now, there is no need to inject `navbar` just create `Footer` 
  component inject there once `navbar` and use it on every page)
- `<main>` has the main page content for every page
- `<header>` for `catalog` it will be `searchbar` for every other just title (create `Header` component and inject 
  `children` components inside)
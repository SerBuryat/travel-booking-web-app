import { NavbarButtonConfig } from './Navbar';
import HomeIcon from './HomeIcon';
import CatalogIcon from './CatalogIcon';
import ProfileIcon from './ProfileIcon';
import MapIcon from './MapIcon';
import RequestsIcon from './RequestsIcon';

// Constants for each page
export const HOME = '/home';
export const CATALOG = '/catalog';
export const SERVICES = '/services';
export const PROFILE = '/profile';
export const MAP = '/map';
export const REQUESTS = '/requests';

// Individual button configurations
export const HOME_BUTTON: NavbarButtonConfig = {
  href: HOME,
  icon: HomeIcon,
  title: 'Home',
};

export const CATALOG_BUTTON: NavbarButtonConfig = {
  href: CATALOG,
  icon: CatalogIcon,
  title: 'Catalog',
};

export const PROFILE_BUTTON: NavbarButtonConfig = {
  href: PROFILE,
  icon: ProfileIcon,
  title: 'Profile',
  badgeContent: 4,
};

export const MAP_BUTTON: NavbarButtonConfig = {
  href: MAP,
  icon: MapIcon,
  title: 'Map',
};

export const REQUESTS_BUTTON: NavbarButtonConfig = {
  href: REQUESTS,
  icon: RequestsIcon,
  title: 'Requests',
};

// Complete navbar configuration
export const NAVBAR_BUTTONS: NavbarButtonConfig[] = [
  HOME_BUTTON,
  CATALOG_BUTTON,
  MAP_BUTTON,
  REQUESTS_BUTTON,
  PROFILE_BUTTON,
];
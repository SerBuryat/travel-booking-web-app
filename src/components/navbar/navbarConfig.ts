import { NavbarButtonConfig } from './Navbar';
import HomeIcon from './HomeIcon';
import CatalogIcon from './CatalogIcon';
import ServicesIcon from './ServicesIcon';
import ProfileIcon from './ProfileIcon';

// Constants for each page
export const HOME = '/home';
export const CATALOG = '/catalog';
export const SERVICES = '/services';
export const PROFILE = '/profile';

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

export const SERVICES_BUTTON: NavbarButtonConfig = {
  href: SERVICES,
  icon: ServicesIcon,
  title: 'Services',
};

export const PROFILE_BUTTON: NavbarButtonConfig = {
  href: PROFILE,
  icon: ProfileIcon,
  title: 'Profile',
  badgeContent: 4,
};

// Complete navbar configuration
export const NAVBAR_BUTTONS: NavbarButtonConfig[] = [
  HOME_BUTTON,
  CATALOG_BUTTON,
  SERVICES_BUTTON,
  PROFILE_BUTTON,
];
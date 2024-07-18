import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

// NOTE: We did not use React Components for Icons, because
//  you may want to get the config from the server.

// NOTE: First level elements are groups.

export interface LayoutConfig {
  navItems: NavItemConfig[];
}

export const layoutConfig = {
  navItems: [
    {
      key: 'administration',
      title: 'Administration',
      items: [
        { key: 'home', title: 'Home', href: paths.dashboard.overview, icon: 'house' },
        {
          key: 'customers',
          title: 'Customers',
          href: paths.dashboard.customers.list,
          icon: 'users',
        },
        {
          key: 'invoices',
          title: 'Invoices',
          href: paths.dashboard.invoices.list,
          icon: 'receipt',
        },
        {
          key: 'societies',
          title: 'Societies',
          href: paths.dashboard.societies.list,
          icon: 'briefcase',
        },
        {
          key: 'properties',
          title: 'Properties',
          href: paths.dashboard.properties.list,
          icon: 'building-apartment',
        },
        {
          key: 'orders',
          title: 'Orders',
          href: paths.dashboard.orders.list,
          icon: 'shopping-cart-simple',
        },
        {
          key: 'facilities',
          title: 'Facilities',
          href: paths.dashboard.facilities.list,
          icon: 'hardHat',
        },
        {
          key: 'bookings',
          title: 'Bookings',
          href: paths.dashboard.bookings.list,
          icon: 'calendar',
        },
        {
          key: 'prestation',
          title: 'Prestation',
          href: paths.dashboard.prestation,
          icon: 'calendar',
        },
      ],
    },
  ],
} satisfies LayoutConfig;

// Default menu settings configurations

export interface MenuItem {
  title: string;
  icon: string;
  page: string;
  isExternalLink?: boolean;
  issupportExternalLink?: boolean;
  badge: { type: string, value: string };
  submenu: {
    items: Partial<MenuItem>[];
  };
  section: string;
}

export interface MenuConfig {
  horizontal_menu: {
    items: Partial<MenuItem>[]
  };
  vertical_menu: {
    items: Partial<MenuItem>[]
  };
}

export const MenuSettingsConfig: MenuConfig = {
  horizontal_menu: {
    items: [
      {
        title: 'Dashboard',
        icon: 'la-home',
        page: '/dashboard/dashboard-view',
      },
      {
        title: 'Templates',
        icon: 'la-television',
        page: 'null',
        submenu: {
          items: [
            {
              title: 'Horizontal',
              page: 'null'
            },
            {
              title: 'Vertical',
              page: 'null'
            },
          ]
        }
      },
      { section: 'PRINCIPAL', icon: 'la-ellipsis-h' },
      {
        title: 'Ventas',
        icon: 'la-shopping-cart',
        page: '/sale/sale-view',
      },
      { section: 'GESTIÓN', icon: 'la-ellipsis-h' },
      {
        title: 'Productos',
        icon: 'feather ft-clipboard',
        page: '/product/product-view',
      }, {
        title: 'Ciclos',
        icon: 'la-book',
        page: '/cicle/cicle-view',
      },
      { section: 'PERSONAL', icon: 'la-ellipsis-h' },
      {
        title: 'Usuarios',
        icon: 'feather ft-users',
        page: '/worker/worker-view',
      },
    ]
  },
  vertical_menu: {
    items: [
      {
        title: 'Dashboard',
        icon: 'la-home',
        page: '/dashboard/dashboard-view',
      },
      {
        title: 'Templates',
        icon: 'la-television',
        page: 'null',
        submenu: {
          items: [
            {
              title: 'Horizontal',
              page: 'null'
            },
            {
              title: 'Vertical',
              page: 'null'
            },
          ]
        }
      },
      { section: 'PRINCIPAL', icon: 'la-ellipsis-h' },
      {
        title: 'Ventas',
        icon: 'la-shopping-cart',
        page: '/sale/sale-view',
      },
      { section: 'GESTIÓN', icon: 'la-ellipsis-h' },
      {
        title: 'Productos',
        icon: 'feather ft-clipboard',
        page: '/product/product-view',
      }, {
        title: 'Ciclos',
        icon: 'la-book',
        page: '/cicle/cicle-view',
      },
      { section: 'PERSONAL', icon: 'la-ellipsis-h' },
      {
        title: 'Usuarios',
        icon: 'feather ft-users',
        page: '/worker/worker-view',
      },
    ]
  }

};






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
      { section: 'GESTIÓN', icon: 'la-ellipsis-h' },
      {
        title: 'Productos',
        icon: 'feather ft-clipboard',
        page: '/product/product-view',
      }, {
        title: 'Asignaciones',
        icon: 'feather ft-file-text',
        page: '/assign/assign-view',
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
      { section: 'GESTIÓN', icon: 'la-ellipsis-h' },
      {
        title: 'Productos',
        icon: 'feather ft-clipboard',
        page: '/product/product-view',
      }, {
        title: 'Asignaciones',
        icon: 'feather ft-file-text',
        page: '/assign/assign-view',
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






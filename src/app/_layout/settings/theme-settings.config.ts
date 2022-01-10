// Default theme settings configurations

export const ThemeSettingsConfig = {
  colorTheme: 'semi-dark', // light, semi-light, semi-dark, dark
  layout: {
    style: 'vertical', // style: 'vertical', horizontal,
    pattern: 'fixed' // fixed, boxed, static
  },
  menuColor: 'menu-dark', // Vertical: [menu-dark, menu-light] , Horizontal: [navbar-dark, navbar-light]
  navigation: 'menu-collapsible', // menu-collapsible, menu-accordation
  menu: 'expand', // collapse, expand
  header: 'fix', // fix, static
  footer: 'static', // fix, static
  customizer: 'off', // on ,off
  headerIcons: {
    maximize: 'on', // on, off
    search: 'off', // on, off
    internationalization: 'off', // on, off
    notification: 'off', // on, off
    email: 'off' // on, off
  },
  brand: {
    brand_name: 'Modern Admin',
    logo: {
      type: 'internal', // internal, url
      value: 'assets/custom/images/logo.png' // recommended location for custom images
      // type:'url',
      // value:'http://evolvision.com/wp-content/uploads/2018/01/envelope4-green.png'
    },
  },
  defaultTitleSuffix: 'Modern Admin - Angular 11+ Bootstrap 4 Admin Dashboard Template'
};

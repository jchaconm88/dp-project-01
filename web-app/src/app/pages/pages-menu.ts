import { FirebaseMenuItem } from "../core/interfaces/firebase-menu-item";

export const MENU_ITEMS: FirebaseMenuItem[] = [
    {
      title: 'E-commerce',
      enabled: true,
      icon: 'shopping-cart-outline',
      link: '/pages/dashboard',
      home: true,
      permission: ['view', 'user']
    },
    {
      title: 'IoT Dashboard',
      enabled: true,
      icon: 'home-outline',
      link: '/pages/iot-dashboard',
      permission: ['view', 'user']
    },
    {
      title: 'FEATURES',
      enabled: true,
      group: true,
    },
    {
      title: 'Sistema',
      enabled: true,
      icon: 'layout-outline',
      children: [
        {
          title: 'Usuarios',
          link: '/system/user',
        },
        {
          title: 'List',
          link: '/pages/layout/list',
        },
        {
          title: 'Infinite List',
          link: '/pages/layout/infinite-list',
        },
        {
          title: 'Accordion',
          link: '/pages/layout/accordion',
        },
        {
          title: 'Tabs',
          pathMatch: 'prefix',
          link: '/pages/layout/tabs',
        },
      ],
    },
    {
      title: 'Forms',
      enabled: true,
      icon: 'edit-2-outline',
      children: [
        {
          title: 'Form Inputs',
          link: '/pages/forms/inputs',
        },
        {
          title: 'Form Layouts',
          link: '/pages/forms/layouts',
        },
        {
          title: 'Buttons',
          link: '/pages/forms/buttons',
        },
        {
          title: 'Datepicker',
          link: '/pages/forms/datepicker',
        },
      ],
    },
    {
      title: 'UI Features',
      enabled: true,
      icon: 'keypad-outline',
      link: '/pages/ui-features',
      children: [
        {
          title: 'Grid',
          link: '/pages/ui-features/grid',
        },
        {
          title: 'Icons',
          link: '/pages/ui-features/icons',
        },
        {
          title: 'Typography',
          link: '/pages/ui-features/typography',
        },
        {
          title: 'Animated Searches',
          link: '/pages/ui-features/search-fields',
        },
      ],
    },
    {
      title: 'Modal & Overlays',
      enabled: true,
      icon: 'browser-outline',
      children: [
        {
          title: 'Dialog',
          link: '/pages/modal-overlays/dialog',
        },
        {
          title: 'Window',
          link: '/pages/modal-overlays/window',
        },
        {
          title: 'Popover',
          link: '/pages/modal-overlays/popover',
        },
        {
          title: 'Toastr',
          link: '/pages/modal-overlays/toastr',
        },
        {
          title: 'Tooltip',
          link: '/pages/modal-overlays/tooltip',
        },
      ],
    },
    {
      title: 'Extra Components',
      enabled: true,
      icon: 'message-circle-outline',
      children: [
        {
          title: 'Calendar',
          link: '/pages/extra-components/calendar',
        },
        {
          title: 'Progress Bar',
          link: '/pages/extra-components/progress-bar',
        },
        {
          title: 'Spinner',
          link: '/pages/extra-components/spinner',
        },
        {
          title: 'Alert',
          link: '/pages/extra-components/alert',
        },
        {
          title: 'Calendar Kit',
          link: '/pages/extra-components/calendar-kit',
        },
        {
          title: 'Chat',
          link: '/pages/extra-components/chat',
        },
      ],
    },
    {
      title: 'Maps',
      enabled: true,
      icon: 'map-outline',
      children: [
        {
          title: 'Google Maps',
          link: '/pages/maps/gmaps',
        },
        {
          title: 'Leaflet Maps',
          link: '/pages/maps/leaflet',
        },
        {
          title: 'Bubble Maps',
          link: '/pages/maps/bubble',
        },
        {
          title: 'Search Maps',
          link: '/pages/maps/searchmap',
        },
      ],
    },
    {
      title: 'Charts',
      enabled: true,
      icon: 'pie-chart-outline',
      children: [
        {
          title: 'Echarts',
          link: '/pages/charts/echarts',
        },
        {
          title: 'Charts.js',
          link: '/pages/charts/chartjs',
        },
        {
          title: 'D3',
          link: '/pages/charts/d3',
        },
      ],
    },
    {
      title: 'Editors',
      enabled: true,
      icon: 'text-outline',
      children: [
        {
          title: 'TinyMCE',
          link: '/pages/editors/tinymce',
        },
        {
          title: 'CKEditor',
          link: '/pages/editors/ckeditor',
        },
      ],
    },
    {
      title: 'Tables & Data',
      enabled: true,
      icon: 'grid-outline',
      children: [
        {
          title: 'Smart Table',
          link: '/pages/tables/smart-table',
        },
        {
          title: 'Tree Grid',
          link: '/pages/tables/tree-grid',
        },
      ],
    },
    {
      title: 'Miscellaneous',
      enabled: true,
      icon: 'shuffle-2-outline',
      children: [
        {
          title: '404',
          link: '/pages/miscellaneous/404',
        },
      ],
    },
    {
      title: 'Auth',
      enabled: true,
      icon: 'lock-outline',
      children: [
        {
          title: 'Login',
          link: '/auth/login',
        },
        {
          title: 'Register',
          link: '/auth/register',
        },
        {
          title: 'Request Password',
          link: '/auth/request-password',
        },
        {
          title: 'Reset Password',
          link: '/auth/reset-password',
        },
      ],
    },
  ];
export interface MenuItem {
  title: string;
  icon?: string;
  link?: string;
  enabled?: boolean;
  permission?: [string, string]; // [recurso, operación]
  children?: MenuItem[];
  home?: boolean;
  pathMatch?: 'full' | 'prefix';
  group?: boolean
  hidden?: boolean
}

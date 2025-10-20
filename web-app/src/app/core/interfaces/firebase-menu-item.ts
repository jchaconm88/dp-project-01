export interface FirebaseMenuItem {
  title: string;
  icon?: string;
  link?: string;
  enabled?: boolean;
  permission?: [string, string]; // [recurso, operación]
  children?: FirebaseMenuItem[];
  home?: boolean;
  pathMatch?: 'full' | 'prefix';
  group?: boolean
  hidden?: boolean
}
import {
  ComponentType, LazyExoticComponent, ReactNode
} from 'react';

/** Везде, где подключается <Router routes={routes}/>, кроме App.tsx, routes: IRoute[] берется из пропсов IProps. */

export interface IRoute {
  path: string;
  exact: boolean;
  private?: boolean;
  component?: LazyExoticComponent<ComponentType<any>>;
  routes?: IRoute[];
  redirect?: string;
  fallback: NonNullable<ReactNode> | null;
}

export const routes: IRoute[] = [
  {
    path: '/schema/:id',
    exact: true,
    fallback: '...'
  }
];

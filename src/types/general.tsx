import type { MapProps } from 'types/map';

interface IProps {
  map: MapProps;
  locale?: 'fa' | 'en';
  styleURL: string;
  sprite?: string;
  title?: string;
  columns?: string[];
}

type Renderable = JSX.Element | undefined | null | false;

export type { IProps, Renderable };

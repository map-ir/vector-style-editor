/// <reference types="react" />
import type { Style } from 'mapbox-gl';
import type { MapProps } from 'types/map';
interface IProps {
    map: MapProps;
    locale?: 'fa' | 'en';
    styleURL: string;
    sprite?: string;
    title?: string;
    columns?: string[];
    onSubmit?: (arg: Style | null) => void;
    onCancle?: (arg: Style | null) => void;
}
type Renderable = JSX.Element | undefined | null | false;
export type { IProps, Renderable };

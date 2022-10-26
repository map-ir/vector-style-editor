/* eslint-disable @typescript-eslint/indent */
import { useEffect, useState } from 'react';
import useGetSelectedLayer from './useGetSelectedLayer';

const useGetStyleKey = (type: string) => {
  const { layer } = useGetSelectedLayer();

  const [property, setProperty] = useState<
    | 'icon-size'
    | 'icon-opacity'
    | 'line-color'
    | 'line-width'
    | 'line-opacity'
    | 'fill-color'
    | 'fill-outline-color'
    | 'fill-opacity'
    | 'circle-radius'
    | 'circle-color'
    | 'circle-opacity'
    | 'circle-stroke-width'
    | 'circle-stroke-color'
    | 'circle-stroke-opacity'
  >();

  const [styleKey, setStyleKey] = useState<'layout' | 'zoom' | 'paint'>();

  useEffect(() => {
    // TODO: circle-stroke-opacity and circle-stroke-color
    if (type === 'opacity') {
      switch (layer?.type) {
        case 'symbol':
          setProperty('icon-opacity');
          break;
        case 'circle':
          setProperty('circle-opacity');
          break;
        case 'line':
          setProperty('line-opacity');
          break;
        case 'fill':
          setProperty('fill-opacity');
          break;
      }
    }
    if (type === 'stroke') {
      switch (layer?.type) {
        case 'fill':
          setProperty('fill-outline-color');
          break;
        case 'circle':
          setProperty('circle-stroke-width');
          break;
      }
    }
    if (type === 'size') {
      switch (layer?.type) {
        case 'symbol':
          setProperty('icon-size');
          break;
        case 'circle':
          setProperty('circle-radius');
          break;
        case 'line':
          setProperty('line-width');
          break;
      }
    }
    if (type === 'color') {
      switch (layer?.type) {
        case 'fill':
          setProperty('fill-color');
          break;
        case 'circle':
          setProperty('circle-color');
          break;
        case 'line':
          setProperty('line-color');
          break;
      }
    }
  }, [layer]);

  useEffect(() => {
    if (property)
      setStyleKey(['icon-size'].includes(property) ? 'layout' : 'paint');
  }, [property]);

  return { styleKey, property };
};

export default useGetStyleKey;

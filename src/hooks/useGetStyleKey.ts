/* eslint-disable @typescript-eslint/indent */
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import { layerState } from 'atoms/map';

function useGetStyleKey(type: string) {
  const layer = useAtomValue(layerState);

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
    console.log(
      '🚀 ~ file: useGetStyleKey.ts ~ line 30 ~ useEffect ~ layer',
      layer
    );
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
    } else if (type === 'stroke-color') {
      switch (layer?.type) {
        case 'fill':
          setProperty('fill-outline-color');
          break;
        case 'circle':
          setProperty('circle-stroke-color');
          break;
      }
    } else if (type === 'stroke-size') {
      switch (layer?.type) {
        case 'circle':
          setProperty('circle-stroke-width');
          break;
      }
    } else if (type === 'stroke-opacity') {
      switch (layer?.type) {
        case 'circle':
          setProperty('circle-stroke-opacity');
          break;
      }
    } else if (type === 'size') {
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
    } else if (type === 'color') {
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
}

export default useGetStyleKey;

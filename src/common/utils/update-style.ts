/* eslint-disable @typescript-eslint/indent */
import { Dispatch, SetStateAction } from 'react';

import type {
  DataDrivenPropertyValueSpecification,
  Map,
  StyleSpecification,
  LayerSpecification,
} from 'maplibre-gl';

const updateStyle = (
  layer_id: string,
  map: Map | undefined,
  type: 'layout' | 'paint' | 'zoom' | 'metadata',
  key: string | number,
  value: DataDrivenPropertyValueSpecification<number[] | number | string>,
  setStyle: Dispatch<SetStateAction<StyleSpecification | null>>
) => {
  if (!map) return;

  switch (type) {
    case 'layout':
      try {
        map?.setLayoutProperty(layer_id, key as string, value);
      } catch (e) {
        console.error(e);
      }
      break;
    case 'paint':
      try {
        map?.setPaintProperty(layer_id, key as string, value);
      } catch (e) {
        console.error(e);
      }
      break;
    case 'zoom':
      try {
        map?.setLayerZoomRange(layer_id, key as number, value as number);
      } catch (e) {
        console.error(e);
      }
      break;
  }

  setStyle((curr_style) => {
    if (!curr_style) return null;

    const selectedLayer = curr_style.layers?.filter((l) => l.id === layer_id);

    const indexOfSelectedLayer = curr_style.layers.findIndex(
      (i) => i.id === selectedLayer[0].id
    );

    const newLayers = ([] as LayerSpecification[]).concat(curr_style.layers);

    switch (type) {
      case 'zoom':
        newLayers[indexOfSelectedLayer] = {
          ...selectedLayer[0],
          minzoom: parseInt(key.toString()),
          maxzoom: parseInt(value.toString()),
        } as LayerSpecification;
        break;
      case 'metadata':
        newLayers[indexOfSelectedLayer] = {
          ...selectedLayer[0],
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          [type]: {
            // @ts-ignore line
            ...selectedLayer[0][type],
            [key]: value,
          },
        } as LayerSpecification;
        break;
      default:
        newLayers[indexOfSelectedLayer] = {
          ...selectedLayer[0],
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          [type]: {
            // @ts-ignore line
            ...selectedLayer[0][type],
            [key]: value,
          },
        } as LayerSpecification;
        break;
    }

    return {
      ...curr_style,
      layers: newLayers,
    };
  });
};

export default updateStyle;

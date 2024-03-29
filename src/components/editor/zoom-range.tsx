import React, { useEffect, useState } from 'react';
import Styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { useAtomValue, useSetAtom } from 'jotai';

import RangeSlider from 'common/range-slider';
import InputNumber from 'common/input-number';
import UpdateStyle from 'common/utils/update-style';

import {
  layerState,
  mapState,
  selectedLayerIDState,
  styleObjState,
} from 'atoms/map';

// import type { Layer } from 'maplibre-gl';

const ZoomrRange = () => {
  const map = useAtomValue(mapState);
  const openLayerID = useAtomValue(selectedLayerIDState);
  const setStyleObj = useSetAtom(styleObjState);
  const layer = useAtomValue(layerState);

  const [zoom, setZoom] = useState([1, 20]);

  useEffect(() => {
    setZoom([layer?.minzoom ?? 1, layer?.maxzoom ?? 20]);
  }, [layer]);

  const zoomChange = (value: number[]) => {
    if (!openLayerID || !map) return;
    UpdateStyle(openLayerID, map, 'zoom', value[0], value[1], setStyleObj);
  };

  return (
    <Wrapper>
      <Title>
        <FormattedMessage id="zoom_range" />
      </Title>
      <Slider>
        <InputNumber
          min={1}
          max={20}
          value={zoom[1]}
          onChange={(number) => zoomChange([zoom[0], number])}
        />
        <RangeSlider
          // defaultValue={[zoom[0], zoom[1]]}
          value={zoom}
          min={1}
          max={20}
          step={1}
          minStepsBetweenThumbs={0}
          aria-label="Zoom"
          onValueChange={(value) => zoomChange(value)}
        />
        <InputNumber
          min={1}
          max={20}
          value={zoom[0]}
          onChange={(number) => zoomChange([number, zoom[1]])}
        />
      </Slider>
    </Wrapper>
  );
};

export default ZoomrRange;

const Wrapper = Styled.div`
width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1em 0;
    gap: 1em;
`;

const Title = Styled.span`
  flex-shrink: 0;
  width: max-content;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: var(--SE-shade-2);
  font-size: 0.8em;
`;

const Slider = Styled.div`
/* flex-grow: 3; */
width: 70%;
display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5em;
`;

import React, { memo, useState } from 'react';
import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';

import deleteLayer from 'common/utils/delete-layer';
import InnerTabs from '../inner-tabs';
import {
  mapState,
  selectedLayerIDState,
  spriteState,
  styleObjState,
} from 'atoms/map';

import type { PointLayer } from '../../types/map';

import { addNewLayer } from 'common/utils/add-new-layer';

import { ReactComponent as Circle } from '../../assets/icons/circle.svg';
import { ReactComponent as Symbol } from '../../assets/icons/symbol.svg';
import { ReactComponent as Heatmap } from '../../assets/icons/heatmap.svg';
// import { ReactComponent as Cluster } from '../../assets/icons/cluster.svg';

interface IProps {
  type: PointLayer;
}
const PointEditor = ({ type }: IProps) => {
  const map = useAtomValue(mapState);
  const setStyleObj = useSetAtom(styleObjState);
  const openLayerID = useAtomValue(selectedLayerIDState);
  const sprite = useAtomValue(spriteState);

  const [layerType, setLayerType] = useState(type);
  const [isHoverSymbol, setIsHoverSymbol] = useState(false);
  const [isHoverCircle, setIsHoverCircle] = useState(false);
  const [isHoverHeat, setIsHoverSymbolHeat] = useState(false);

  const changeLayerType = (layer: PointLayer) => {
    if (!openLayerID || !map) return;
    setLayerType(layer);
    // add new point layer and delete current point layer
    addNewLayer(layer, setStyleObj);
    deleteLayer(openLayerID, map, setStyleObj);
  };

  return (
    <Wrapper>
      <LayerType>
        {sprite && (
          <Symbol
            style={{ cursor: 'pointer' }}
            onClick={() => changeLayerType('symbol')}
            onMouseEnter={() => setIsHoverSymbol(true)}
            onMouseLeave={() => setIsHoverSymbol(false)}
            color={
              layerType === 'symbol' || isHoverSymbol
                ? 'var(--SE-color-primary)'
                : 'var(--SE-shade-4)'
            }
          />
        )}
        <Circle
          style={{ cursor: 'pointer' }}
          onClick={() => changeLayerType('circle')}
          onMouseEnter={() => setIsHoverCircle(true)}
          onMouseLeave={() => setIsHoverCircle(false)}
          color={
            layerType === 'circle' || isHoverCircle
              ? 'var(--SE-color-primary)'
              : 'var(--SE-shade-4)'
          }
        />
        <Heatmap
          style={{ cursor: 'pointer' }}
          onClick={() => changeLayerType('heatmap')}
          onMouseEnter={() => setIsHoverSymbolHeat(true)}
          onMouseLeave={() => setIsHoverSymbolHeat(false)}
          color={
            layerType === 'heatmap' || isHoverHeat
              ? 'var(--SE-color-primary)'
              : 'var(--SE-shade-4)'
          }
        />
        {/* <Cluster
          color={
            layerType === 'cluster'
              ? 'var(--SE-color-primary)'
              : 'var(--SE-shade-4)'
          }
        /> */}
      </LayerType>
      <InnerTabs type={layerType} />
    </Wrapper>
  );
};

export default memo(PointEditor);

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1em;
`;

const LayerType = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border-top: 1px solid var(--SE-shade-5);
  border-bottom: 1px solid var(--SE-shade-5);
  padding: 0.5em 0;
`;

import React, { memo, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import styled from 'styled-components/macro';

import Map from './map';
import Editor from './editor';

import { mapPropsState, styleURLState, styleObjState } from '../atoms/map';

import type { IProps } from 'types/general';
import type { Style } from 'mapbox-gl';

const App = ({ map, locale, styleURL }: IProps) => {
  const setMapProp = useSetAtom(mapPropsState);
  const [styleURLAtom, setStyleURL] = useAtom(styleURLState);
  const setStyleObj = useSetAtom(styleObjState);

  setMapProp(map);
  setStyleURL(styleURL);

  const fetchStyle = (url: string): Promise<Style> => {
    return fetch(url, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res: Style) => res);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    if (styleURLAtom) fetchStyle(styleURLAtom).then((res) => setStyleObj(res));
  }, [styleURLAtom, setStyleObj]);

  return (
    <Wrapper>
      <Editor />
      <Map />
    </Wrapper>
  );
};

export default memo(App);

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  gap: 1em;
`;

import React, { memo, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import styled, { css, createGlobalStyle } from 'styled-components';

import Map from '../common/map';
import Layers from './layers';

import { styleURLState, styleObjState, spriteState } from '../atoms/map';
import { titleState, columnsState, distinctState } from '../atoms/general';

import type { IProps } from '../types/general';
import type { StyleSpecification } from 'maplibre-gl';

const defaultColors = {
  primary: '#ea4c89',
  primary_20: '#ea4c8920',
  secondry: '#2e0767',
  shade_1: '#1c1c1c',
  shade_2: '#808080',
  shade_3: '#C2C2C2',
  shade_4: '#E8E8E8',
  shade_5: '#E0E0E0',
  light_1: '#ffffff',
  light_2: '#FAFAFA',
  success_1: '#20A76E',
  fail_1: '#D10328',
  border_radius_16: '16px',
  border_radius_8: '8px',
  border_radius_4: '4px',
  font_family:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
};

const globalishStyle = css`
  :root {
    --SE-color-primary: ${defaultColors.primary};
    --SE-color-primary-20: ${defaultColors.primary_20};
    --SE-color-secondry: ${defaultColors.secondry};
    --SE-shade-1: ${defaultColors.shade_1};
    --SE-shade-2: ${defaultColors.shade_2};
    --SE-shade-3: ${defaultColors.shade_3};
    --SE-shade-4: ${defaultColors.shade_4};
    --SE-shade-5: ${defaultColors.shade_5};
    --SE-light-1: ${defaultColors.light_1};
    --SE-light-2: ${defaultColors.light_2};
    --SE-success-1: ${defaultColors.success_1};
    --SE-fail-1: ${defaultColors.fail_1};
    --SE-radius-4: ${defaultColors.border_radius_4};
    --SE-radius-8: ${defaultColors.border_radius_8};
    --SE-radius-16: ${defaultColors.border_radius_16};

    --SE-font-family: ${defaultColors.font_family};
  }
`;

const GlobalStyle = createGlobalStyle`
    ${globalishStyle}
`;

const fetchStyle = (url: string) => {
  return fetch(url, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((res: StyleSpecification) => res);
};

function App({
  map,
  locale = 'en',
  styleURL,
  sprite,
  title,
  columns,
  onSubmit,
  onCancel,
  getDistinctValues,
  onMapLoad,
}: IProps) {
  const [styleURLAtom, setStyleURL] = useAtom(styleURLState);
  const setStyleObj = useSetAtom(styleObjState);
  const setTitle = useSetAtom(titleState);
  const setColumns = useSetAtom(columnsState);
  const setDistinctFunc = useSetAtom(distinctState);
  const setSprite = useSetAtom(spriteState);

  useEffect(() => {
    setStyleURL(styleURL);
  }, [styleURL]);

  useEffect(() => {
    setSprite(sprite);
  }, [sprite]);

  useEffect(() => {
    setTitle(title);
  }, [title]);

  useEffect(() => {
    setColumns(columns);
  }, [columns]);

  useEffect(() => {
    if (getDistinctValues)
      setDistinctFunc(() => (col_name: string) => getDistinctValues(col_name));
  }, [getDistinctValues]);

  useEffect(() => {
    if (styleURLAtom)
      fetchStyle(styleURLAtom).then(setStyleObj).catch(console.error);
  }, [styleURLAtom]);

  return (
    <Wrapper locale={locale ?? 'en'}>
      <GlobalStyle />
      <Layers onSubmit={onSubmit} onCancel={onCancel} />
      <Map options={map} onMapLoad={onMapLoad} />
    </Wrapper>
  );
}

export default memo(App);

const Wrapper = styled.div<{ locale: string }>`
  direction: ${(p) => (p.locale === 'fa' ? 'rtl' : 'ltr')};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  gap: 1em;
  font-family: var(--SE-font-family);
`;

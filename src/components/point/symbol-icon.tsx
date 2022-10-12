/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { usePopper } from 'react-popper';
import styled from 'styled-components/macro';
import { FormattedMessage } from 'react-intl';

import Sample from 'common/sample';
import Portal from 'common/portal';
import useOutsideClickHandler from 'hooks/useOutsideClickHandler';
import useGetSelectedLayer from 'hooks/useGetSelectedLayer';
import updateStyle from 'common/utils/update-style';

import {
  selectedLayerIDState,
  spriteState,
  mapState,
  styleObjState,
} from 'atoms/map';

import type { SymbolLayer } from 'mapbox-gl';
import type { Icon } from 'types/map';

let iconName: string;
const SetIcon = () => {
  const map = useAtomValue(mapState);
  const openLayerID = useAtomValue(selectedLayerIDState);
  const sprite = useAtomValue(spriteState);
  const setStyleObj = useSetAtom(styleObjState);

  const [iconRef, setIconRef] = useState<HTMLDivElement | null>(null);
  const [iconWrapperRef, setIconWrapperRef] = useState<HTMLDivElement | null>(
    null
  );

  const [isIconsOpen, setIconsOpen] = useState(false);
  const [icons, setIcons] = useState<Icon>();

  const { styles, attributes } = usePopper(iconRef, iconWrapperRef, {
    placement: 'bottom-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  const getIcons = (spriteURL: string) => {
    void fetch(`${spriteURL}.json`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res: Icon) => setIcons(res));
  };

  useEffect(() => {
    if (sprite) getIcons(sprite);
  }, [sprite]);

  const { layer } = useGetSelectedLayer();

  useEffect(() => {
    iconName = ((layer as SymbolLayer)?.layout?.['icon-image'] ??
      'empty-e71566') as string;
    console.log(
      '🚀 ~ file: symbol-icon.tsx ~ line 70 ~ useEffect ~ iconName',
      iconName
    );
  }, [layer]);

  useOutsideClickHandler(
    useMemo(() => ({ current: iconWrapperRef }), [iconWrapperRef]),
    (e: MouseEvent) => {
      if (!iconRef?.contains(e.target as Node)) setIconsOpen(false);
    }
  );

  return (
    <Row>
      <FormattedMessage id="symbol_type" />
      <Sample
        title={iconName}
        ref={(el) => setIconRef(el)}
        onClick={setIconsOpen.bind(null, !isIconsOpen)}
        img={`${sprite}.png`}
        x={icons?.[iconName]?.x}
        y={icons?.[iconName]?.y}
        width={icons?.[iconName]?.width}
        height={icons?.[iconName]?.height}
      />
      {icons && isIconsOpen && (
        <Portal>
          <IconWrapper
            ref={(el) => {
              setIconWrapperRef(el);
            }}
            style={styles.popper}
            {...attributes.popper}
          >
            {Object.entries(icons)?.map(([key, icon]) => (
              <Sample
                key={key}
                img={`${sprite}.png`}
                x={icon.x}
                y={icon.y}
                width={icon.width}
                height={icon.height}
                title={key}
                onClick={() =>
                  openLayerID &&
                  map &&
                  updateStyle(
                    openLayerID,
                    map,
                    'layout',
                    'icon-image',
                    `${key}`,
                    setStyleObj
                  )
                }
              />
            ))}
          </IconWrapper>
        </Portal>
      )}
    </Row>
  );
};

export default SetIcon;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const IconWrapper = styled.div`
  display: grid;
  grid-template: auto / repeat(4, auto);
  place-items: center;
  height: 10em;
  overflow-y: auto;
  background-color: var(--light-1);
  border: 1px solid var(--shade-4);
  border-radius: var(--radius-8);
  padding: 0.5em;
  box-shadow: 0 0 5px 0 var(--shade-4);
`;
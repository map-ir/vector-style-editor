/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components/macro';
import { useAtomValue, useSetAtom } from 'jotai';

import useGetSelectedLayer from 'hooks/useGetSelectedLayer';
import updateStyle from 'common/utils/update-style';
import ZoomBase from './zoom-base';
import InputNumber from 'common/input-number';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from 'common/select';

import { mapState, selectedLayerIDState, styleObjState } from 'atoms/map';
import { columnsState } from 'atoms/general';

import { Row, Column } from 'common/styles';

import { ReactComponent as Arrow } from '../../assets/icons/arrow-down.svg';
import { ReactComponent as Check } from '../../assets/icons/tick.svg';

const options = ['static', 'dynamic', 'zoom', 'conditional'] as const;
type OptionsType = typeof options[number];

const SetSize = () => {
  const intl = useIntl();
  const map = useAtomValue(mapState);
  const openLayerID = useAtomValue(selectedLayerIDState);
  const setStyleObj = useSetAtom(styleObjState);
  const columns = useAtomValue(columnsState);

  const { layer } = useGetSelectedLayer();

  const [property, setProperty] = useState<string | undefined>(undefined);
  // @ts-ignore line
  const [size, setSize] = useState<number>(layer?.layout?.[property] ?? 1);
  const [method, setMethod] = useState<OptionsType>(options[0]);

  useEffect(() => {
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
  }, [layer]);

  const component = useMemo(() => {
    return {
      static: (
        <InputNumber
          min={1}
          max={5}
          value={size}
          onChange={(number: number) => {
            setSize(number);
            if (property && openLayerID && map)
              updateStyle(
                openLayerID,
                map,
                'layout',
                property,
                number,
                setStyleObj
              );
          }}
        />
      ),
      dynamic: (
        <Selector>
          <Label>
            <FormattedMessage id="value_title" />
          </Label>
          <Select
            dir={intl.locale === 'fa' ? 'rtl' : 'ltr'}
            onValueChange={(value) => {
              if (property && openLayerID && map)
                updateStyle(
                  openLayerID,
                  map,
                  'layout',
                  property,
                  ['get', value],
                  setStyleObj
                );
            }}
          >
            <SelectTrigger
              aria-label={intl.formatMessage({ id: 'value_title' })}
            >
              <SelectValue
                placeholder={intl.formatMessage({ id: 'selection' })}
              />
              <SelectIcon>
                <Arrow />
              </SelectIcon>
            </SelectTrigger>
            <SelectContent>
              <SelectViewport>
                {columns?.map((column) => (
                  <SelectItem key={column} value={column}>
                    <SelectItemText>{column}</SelectItemText>
                    <SelectItemIndicator>
                      <Check />
                    </SelectItemIndicator>
                  </SelectItem>
                ))}
              </SelectViewport>
            </SelectContent>
          </Select>
        </Selector>
      ),
      zoom: <ZoomBase type="value" />,
      conditional: <></>,
    }[method];
  }, [method, size, columns]);

  return (
    <Column>
      <Row>
        <Selector>
          <Label>
            <FormattedMessage id="size_base_on" />
          </Label>
          <Select
            defaultValue={options[0]}
            dir={intl.locale === 'fa' ? 'rtl' : 'ltr'}
            onValueChange={(value: OptionsType) => {
              setMethod(value);
            }}
          >
            <SelectTrigger
              aria-label={intl.formatMessage({ id: 'size_base_on' })}
            >
              <SelectValue
                placeholder={intl.formatMessage({ id: 'selection' })}
              />
              <SelectIcon>
                <Arrow />
              </SelectIcon>
            </SelectTrigger>
            <SelectContent>
              <SelectViewport>
                {options
                  .filter((o) => {
                    if (!columns)
                      return !['dynamic', 'conditional'].includes(o);
                    else return true;
                  })
                  .map((option) => (
                    <SelectItem key={option} value={option}>
                      <SelectItemText>
                        <FormattedMessage id={option} />
                      </SelectItemText>
                      <SelectItemIndicator>
                        <Check />
                      </SelectItemIndicator>
                    </SelectItem>
                  ))}
              </SelectViewport>
            </SelectContent>
          </Select>
        </Selector>
        {method === 'static' && component}
      </Row>
      {method !== 'static' && <Row>{component}</Row>}
    </Column>
  );
};

export default SetSize;

const Selector = styled(Row)`
  justify-content: start;
  gap: 1em;
  padding: 0;
`;

const Label = styled.div`
  width: 12ch;
`;

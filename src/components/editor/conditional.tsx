/* eslint-disable @typescript-eslint/indent */
import React, { useState, useEffect, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import useGetStyleKey from 'hooks/useGetStyleKey';
import updateStyle from 'common/utils/update-style';

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
import InputNumber from 'common/input-number';
// import Gradiant from 'common/gradiant';
import ColorPicker from 'common/color-picker';

import {
  Column,
  Selector,
  Label,
  PairsWrap,
  StyledRow,
  Description,
  Star,
} from 'common/styles';
import { splitArray } from 'common/utils';

import { ReactComponent as Arrow } from '../../assets/icons/arrow-down.svg';
import { ReactComponent as Check } from '../../assets/icons/tick.svg';
import { ReactComponent as Plus } from '../../assets/icons/plus.svg';
import { ReactComponent as Delete } from '../../assets/icons/delete.svg';
import { ReactComponent as Step } from '../../assets/icons/step.svg';
import { ReactComponent as Match } from '../../assets/icons/match.svg';

import {
  layerState,
  mapState,
  selectedLayerIDState,
  styleObjState,
} from 'atoms/map';
import { columnsState, distinctState } from 'atoms/general';

import type { DataDrivenPropertyValueSpecification } from 'maplibre-gl';

interface IProps {
  type:
    | 'size'
    | 'color'
    | 'stroke'
    | 'stroke-color'
    | 'stroke-size'
    | 'stroke-opacity'
    | 'weight'
    | 'intensity';
  method: 'match' | 'step';
  selectedCol: string;
}

const Conditional = ({ type, method, selectedCol }: IProps) => {
  const intl = useIntl();

  const map = useAtomValue(mapState);
  const openLayerID = useAtomValue(selectedLayerIDState);
  const setStyleObj = useSetAtom(styleObjState);
  const columns = useAtomValue(columnsState);
  const distinctFunc = useAtomValue(distinctState);
  const layer = useAtomValue(layerState);

  const { styleKey, property } = useGetStyleKey(type);

  const [conditionType, setCondition] =
    useState<DataDrivenPropertyValueSpecification<number | string>>(method);
  const [pairs, setPairs] = useState<(number | string)[][]>([]); // Pairs of zoom/value or zoom/color
  const [colName, setColName] = useState<string>(selectedCol);
  const [distinctValues, setDistincts] = useState<string[]>([]);

  useEffect(() => {
    // @ts-ignore line
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const expression = layer?.[styleKey]?.[property];
    const minzoom = layer?.minzoom ?? 1;
    const maxzoom = layer?.maxzoom ?? 20;

    if (
      (expression as string[])?.[0] === 'match' ||
      (expression as string[])?.[0] === 'step'
    ) {
      let arr = splitArray((expression as string[])?.slice(2), 2);

      if ((expression as string[])?.[0] === 'step') {
        const popped = arr.pop() ?? [];
        const reversed = arr.map((a) => a.reverse());
        arr = [...reversed, popped];
      }

      setPairs(arr);
    } else {
      const temp = [
        [
          minzoom,
          expression ??
            (['color', 'stroke-color'].includes(type) ? '#C11010' : 1),
        ],
        [maxzoom, ['color', 'stroke-color'].includes(type) ? '#2585f3' : 1],
        [['color', 'stroke-color'].includes(type) ? '#000000' : 1],
      ];
      setPairs(temp);
    }
  }, [layer, property, styleKey]);

  const styleValue = useCallback(
    (value: (number | string)[][]) => {
      let arr = value;
      if (conditionType === 'step') {
        const popped = arr.pop() ?? [];
        const reversed = arr.map((a) => a.reverse());
        arr = [...reversed, popped];
      }
      return [conditionType, ['get', colName], ...arr.flat()];
    },
    [colName, conditionType]
  );

  const applyStyles = useCallback(
    (value: DataDrivenPropertyValueSpecification<number>) => {
      if (openLayerID && map && property && styleKey && value) {
        updateStyle(openLayerID, map, styleKey, property, value, setStyleObj);
      }
    },
    [openLayerID, map, styleKey, property]
  );

  useEffect(() => {
    if (colName)
      void distinctFunc?.(colName).then((res: string[]) => {
        setDistincts(res);
        const arg = styleValue(
          pairs
        ) as DataDrivenPropertyValueSpecification<number>;
        applyStyles(arg);
      });
  }, [colName]);

  useEffect(() => {
    const arg = styleValue(
      pairs
    ) as DataDrivenPropertyValueSpecification<number>;
    applyStyles(arg);
  }, [conditionType]);

  return (
    <Column style={{ width: '100%' }}>
      <StyledRow>
        <Selector>
          <Label>
            <FormattedMessage id="value_title" />
          </Label>
          <Select
            dir={intl.locale === 'fa' ? 'rtl' : 'ltr'}
            defaultValue={colName}
            value={colName}
            onValueChange={(value) => {
              setColName(value);
            }}
          >
            <SelectTrigger
              aria-label={intl.formatMessage({ id: 'value_title' })}
            >
              {/* <EditableInput value="" /> */}
              <SelectValue
                placeholder={intl.formatMessage({ id: 'selection' })}
              >
                {/* <input /> */}
              </SelectValue>
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
        <StyledRow>
          <IconWrapper title="step">
            <Step
              width={30}
              color={
                conditionType === 'step'
                  ? 'var(--SE-color-primary)'
                  : 'var(--SE-shade-2)'
              }
              onClick={() => {
                setCondition('step');
              }}
            />
          </IconWrapper>
          <IconWrapper title="match">
            <Match
              width={30}
              color={
                conditionType === 'match'
                  ? 'var(--SE-color-primary)'
                  : 'var(--SE-shade-2)'
              }
              onClick={() => {
                setCondition('match');
              }}
            />
          </IconWrapper>
        </StyledRow>
      </StyledRow>
      <Column>
        <StyledRow>
          {/* {['color', 'stroke-color'].includes(type) ? (
            <Gradiant
              pairs={pairs}
              min={layer?.minzoom ?? 1}
              max={layer?.maxzoom ?? 20}
              disabled
            />
          ) : (
          )} */}
          <Description>
            <Star>*</Star>
            <FormattedMessage id="size" /> : <FormattedMessage id="value" />
          </Description>
          <Plus
            style={{ cursor: 'pointer' }}
            color={'var(--SE-color-primary)'}
            onClick={() => {
              const temp = [...pairs];
              temp.splice(pairs?.length - 1, 0, [
                'asas',
                ['color', 'stroke-color'].includes(type) ? '#FFB800' : 1,
              ]);
              const arg = styleValue(
                temp
              ) as DataDrivenPropertyValueSpecification<number>;
              applyStyles(arg);
            }}
          />
        </StyledRow>
        {pairs?.map((pair, index) => (
          <StyledRow key={index}>
            <PairsWrap>
              {['color', 'stroke-color'].includes(type) ? (
                // <Sample color={pair?.[1] as string} />
                <ColorPicker
                  value={(pair?.[1] ?? pair?.[0]) as string}
                  onChange={(color) => {
                    const temp = [...pairs];
                    temp[index] = !pair?.[1]
                      ? [color.toUpperCase()]
                      : [temp[index][0], color.toUpperCase()];
                    const arg = styleValue(
                      temp
                    ) as DataDrivenPropertyValueSpecification<number>;
                    applyStyles(arg);
                  }}
                />
              ) : (
                <InputNumber
                  value={(pair?.[1] ?? pair?.[0]) as number}
                  onChange={(value) => {
                    const temp = [...pairs];
                    temp[index] = !pair?.[1]
                      ? [value]
                      : [temp[index][0], value];
                    const arg = styleValue(
                      temp
                    ) as DataDrivenPropertyValueSpecification<number>;
                    applyStyles(arg);
                  }}
                />
              )}{' '}
              {/* value or color */}:
              {!pair?.[1] ? (
                <div>
                  <FormattedMessage id="default" />
                </div>
              ) : (
                <Select
                  dir={intl.locale === 'fa' ? 'rtl' : 'ltr'}
                  defaultValue={pair?.[0] as string}
                  value={pair?.[0] as string}
                  onValueChange={(value) => {
                    const temp = [...pairs];
                    temp[index] = [value, temp[index][1]];
                    const arg = styleValue(
                      temp
                    ) as DataDrivenPropertyValueSpecification<number>;
                    applyStyles(arg);
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
                      {distinctValues?.map((dv) => (
                        <SelectItem key={dv} value={dv}>
                          <SelectItemText>{dv}</SelectItemText>
                          <SelectItemIndicator>
                            <Check />
                          </SelectItemIndicator>
                        </SelectItem>
                      ))}
                    </SelectViewport>
                  </SelectContent>
                </Select>
              )}{' '}
              {/* zoom */}
            </PairsWrap>
            {pair?.[1] ? (
              <Delete
                style={{ cursor: pairs.length < 3 ? 'not-allowed' : 'pointer' }}
                color={
                  pairs.length < 3
                    ? 'var(--SE-shade-3)'
                    : 'var(--SE-color-primary)'
                }
                onClick={() => {
                  if (pairs.length < 3) return;
                  const temp = pairs?.filter((c, index2) => index !== index2);
                  const arg = styleValue(
                    temp
                  ) as DataDrivenPropertyValueSpecification<number>;
                  applyStyles(arg);
                }}
              />
            ) : null}
          </StyledRow>
        ))}
      </Column>
    </Column>
  );
};

export default Conditional;

const IconWrapper = styled.div`
  cursor: pointer;
  display: flex;
`;

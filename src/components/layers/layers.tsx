import React, {
  useState,
  useRef,
  MouseEvent,
  memo,
  useCallback,
  useMemo,
} from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { useIntl } from 'react-intl';
import styled, { css } from 'styled-components';
import Editor, { useMonaco } from '@monaco-editor/react';

import { titleState } from 'atoms/general';
import { styleObjState, selectedLayerIDState, mapState } from 'atoms/map';

import EditableInput from 'common/input_editable';

import GeoIcon from 'common/geo-icon';
import Expandable from 'common/expandable';
import { Row, Icon } from 'common/styles';
import ZoomRange from '../editor/zoom-range';
import SpecEditor from './spec-editor';
import { addNewLayer } from 'common/utils/add-new-layer';
import deleteLayer from 'common/utils/delete-layer';

import useOutsideClickHandler from 'hooks/useOutsideClickHandler';

import type {
  DataDrivenPropertyValueSpecification,
  LayerSpecification,
} from 'maplibre-gl';
// import type { OnValidate } from '@monaco-editor/react/lib/types';
import type { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import type { LayerType } from '../../types/map';

import { ReactComponent as Plus } from '../../assets/icons/plus.svg';
import { ReactComponent as Delete } from '../../assets/icons/delete.svg';
import { ReactComponent as Point } from '../../assets/icons/point.svg';
import { ReactComponent as Line } from '../../assets/icons/line.svg';
import { ReactComponent as Polygon } from '../../assets/icons/polygon.svg';
import { ReactComponent as CodeIcon } from '../../assets/icons/code.svg';
import updateStyle from 'common/utils/update-style';

// type IMarker = Parameters<OnValidate>[0][0];
type PaintKeys = keyof LayerSpecification['paint'];

type IMarker = editor.IMarker;
type IEditor = editor.IStandaloneCodeEditor;
function isValidDataDrivenValue(
  val: unknown
): val is DataDrivenPropertyValueSpecification<string | number | number[]> {
  return (
    typeof val === 'string' ||
    typeof val === 'number' ||
    (Array.isArray(val) && val.every((v) => typeof v === 'number'))
  );
}

interface ILayerMetadata {
  name: string;
}

function LayersStyle() {
  const intl = useIntl();
  const monaco = useMonaco();

  const editorRef = useRef<IEditor>();
  const addLayerRef = useRef<HTMLDivElement>(null);

  const map = useAtomValue(mapState);
  const title = useAtomValue(titleState);
  const [styleObj, setStyleObj] = useAtom(styleObjState);
  const [openLayerID, setOpenLayerID] = useAtom(selectedLayerIDState);

  const [addLayer, isAdding] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useOutsideClickHandler(addLayerRef, isAdding.bind(null, false));

  const styleCode = useMemo(
    () => JSON.stringify(styleObj?.layers) ?? '{}',
    [styleObj?.layers]
  );

  const toggleExpand = (layerID?: string) => {
    setOpenLayerID((currentid: string | undefined) =>
      currentid !== layerID ? layerID : undefined
    );
  };

  const handleAddLayer = (type: string) => {
    addNewLayer(type, setStyleObj);
    isAdding(false);
  };

  const handleChangeCode = useCallback(
    (value: string, markers?: IMarker[]) => {
      if (markers?.length) return; // JSON invalid

      let parsed: unknown;

      try {
        parsed = JSON.parse(value);
      } catch (e) {
        console.error('JSON parse error:', e);
        return;
      }

      if (!Array.isArray(parsed)) return;

      const newLayers = parsed as LayerSpecification[];

      setStyleObj((curr) => {
        if (!curr || !map) return curr;

        const oldLayers = curr.layers;

        newLayers.forEach((newLayer) => {
          const oldLayer = oldLayers.find((l) => l.id === newLayer.id);
          if (!oldLayer) return;

          // PAINT
          if (newLayer.paint) {
            for (const key in newLayer.paint) {
              const val = newLayer.paint[key as PaintKeys];
              const before = oldLayer.paint?.[key as PaintKeys];

              if (
                JSON.stringify(before) !== JSON.stringify(val) &&
                isValidDataDrivenValue(val)
              ) {
                updateStyle(newLayer.id, map, 'paint', key, val, setStyleObj);
              }
            }
          }

          // LAYOUT
          if (newLayer.layout) {
            const newLayout = newLayer.layout as Record<string, unknown>;
            const oldLayout = oldLayer.layout as Record<string, unknown>;

            for (const key in newLayout) {
              const val = newLayout[key];
              const before = oldLayout[key];

              if (
                JSON.stringify(before) !== JSON.stringify(val) &&
                isValidDataDrivenValue(val)
              ) {
                updateStyle(newLayer.id, map, 'layout', key, val, setStyleObj);
              }
            }
          }
        });

        return { ...curr, layers: newLayers };
      });
    },
    [map]
  );

  function formatDocument() {
    void editorRef?.current?.getAction('editor.action.formatDocument')?.run();
  }

  function toggleEditor() {
    if (showEditor) {
      const finalCode = editorRef.current?.getValue();
      const markers: IMarker[] | undefined = monaco?.editor?.getModelMarkers({
        owner: 'json',
      });

      if (finalCode) handleChangeCode(finalCode, markers);
    }
    setShowEditor(!showEditor);
  }

  function renameLayer(layer: LayerSpecification, newName: string) {
    updateStyle(layer.id, undefined, 'metadata', 'name', newName, setStyleObj);
  }

  return (
    <Wrapper>
      <Header>
        <Title>{title}</Title>
        <div ref={addLayerRef}>
          {!addLayer && (
            <Icon
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                isAdding(true);
              }}
            >
              <Plus color={'var(--SE-light-1)'} />
            </Icon>
          )}
          {addLayer && (
            <StyledRow>
              <Icon
                title={intl.formatMessage({ id: 'point' })}
                bg={'var(--SE-light-2)'}
                hover={'var(--SE-color-primary-20)'}
                onClick={() => handleAddLayer('point')}
              >
                <Point color={'var(--SE-color-primary)'} />
              </Icon>
              <Icon
                title={intl.formatMessage({ id: 'line' })}
                bg={'var(--SE-light-2)'}
                hover={'var(--SE-color-primary-20)'}
                onClick={() => handleAddLayer('line')}
              >
                <Line color={'var(--SE-color-primary)'} />
              </Icon>
              <Icon
                title={intl.formatMessage({ id: 'polygon' })}
                bg={'var(--SE-light-2)'}
                hover={'var(--SE-color-primary-20)'}
                onClick={() => handleAddLayer('fill')}
              >
                <Polygon color={'var(--SE-color-primary)'} />
              </Icon>
            </StyledRow>
          )}
        </div>
      </Header>
      {showEditor ? (
        <EditorWrapper>
          <Editor
            height="90vh"
            defaultLanguage="json"
            defaultValue={styleCode}
            loading={
              <span dir="rtl">{intl.formatMessage({ id: 'loading' })}</span>
            }
            options={{
              cursorStyle: 'line',
              formatOnPaste: true,
              formatOnType: true,
              colorDecorators: true,
              minimap: {
                enabled: false,
              },
              autoIndent: 'full',
              automaticLayout: true,
              smoothScrolling: true,
              contextmenu: false,
              // cursorSmoothCaretAnimation: true,
            }}
            keepCurrentModel
            onMount={(editor) => {
              if (editor) editorRef.current = editor;

              /// on first initialization
              editor.onDidChangeModelLanguageConfiguration(formatDocument);

              /// on every initialization after the first one (also the first one)
              editor.onDidLayoutChange(formatDocument);
            }}
          />
        </EditorWrapper>
      ) : (
        <LayersContainer>
          {styleObj?.layers
            ?.filter(
              (layer: LayerSpecification) => !layer?.id?.endsWith('-text-layer')
            )
            ?.map((layer: LayerSpecification) => {
              const { id, type, metadata } = layer;
              const { name = '' } =
                (metadata as ILayerMetadata | undefined) ?? {};

              const open = openLayerID === id;

              return (
                <Expandable
                  key={id}
                  open={open}
                  onOpen={toggleExpand.bind(null, id)}
                  HeaderRenderer={() => (
                    <ExpandHeader>
                      <LayerTitle>
                        <GeoIcon
                          // title={intl.formatMessage({ id: type })}
                          data={type}
                          color={'var(--SE-color-primary)'}
                        />
                        <EditableInput
                          placeholder={intl.formatMessage({
                            id: 'layer_placeholder',
                          })}
                          value={name}
                          onChange={renameLayer.bind(null, layer)}
                        />
                      </LayerTitle>
                      <Delete
                        style={{ cursor: 'pointer' }}
                        color={'var(--SE-shade-3)'}
                        onClick={() => map && deleteLayer(id, map, setStyleObj)}
                      />
                    </ExpandHeader>
                  )}
                >
                  <ExpandBody>
                    <ZoomRange />
                    <SpecEditor type={type as LayerType} />
                  </ExpandBody>
                </Expandable>
              );
            })}
        </LayersContainer>
      )}

      <IconWrapper isRtl={intl.locale === 'fa'}>
        <CodeIcon
          onClick={toggleEditor}
          width={30}
          color={showEditor ? 'var(--SE-color-primary)' : 'var(--SE-shade-2)'}
        />
      </IconWrapper>
    </Wrapper>
  );
}

export default memo(LayersStyle);

const Wrapper = styled.div`
  width: 100%;
  max-height: 92%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1em;
  box-sizing: border-box;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
`;

const ExpandHeader = styled(Header)``;

const LayerTitle = styled(Header)`
  flex-grow: 2;
  justify-content: flex-start;

  input {
    flex-grow: 2;
  }
`;

const Title = styled.h2`
  margin: 0;
`;

const LayersContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1em;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-gutter: stable both-edges;
`;

const ExpandBody = styled(LayersContainer)`
  gap: 0;
  padding-bottom: 1em;
`;

const StyledRow = styled(Row)`
  padding: 0;
  gap: 1em;
`;

const IconWrapper = styled.div<{ isRtl?: boolean }>`
  cursor: pointer;
  position: fixed;
  z-index:9999;
  bottom: 1rem;
  ${(p) =>
    p.isRtl
      ? css`
          right: 2rem;
        `
      : css`
          left: 2rem;
        `}
`;

const EditorWrapper = styled.div`
  direction: ltr;
  width: 100%;
  overflow: hidden;
`;

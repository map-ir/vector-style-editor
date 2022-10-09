import React, { useState, useCallback, useMemo, useEffect } from 'react';

import SectionTab from '../common/section-tab';
import { PageSwitch, Page } from '../common/page-switch';
import { LayerComponent, EditorWrapper } from '../common/styles';
import { symbolTabs, circleTabs, components } from './constans';
import type { ITab } from './constans';

import type { LayerType } from '../types/map';

interface IProps {
  type: LayerType;
}

const InnerTabs = ({ type }: IProps) => {
  const tabs = useMemo(() => {
    return {
      symbol: symbolTabs,
      circle: circleTabs,
      heatmap: symbolTabs,
      cluster: symbolTabs,
      line: symbolTabs,
      fill: symbolTabs,
    }[type];
  }, [type]);

  const currTab = tabs.map((t) => t.id);
  type PageIds = typeof currTab[number];

  const [activePageId, setActivePageId] = useState<PageIds>(
    (tabs.filter((i: ITab<PageIds>) => !i.disabled) as ITab<PageIds>[])[0].id
  );

  const changeTab = useCallback(
    (id: string) => {
      return !(tabs.find((i: ITab<PageIds>) => i.id === id) as ITab<PageIds>)
        ?.disabled
        ? setActivePageId(id as PageIds)
        : undefined;
    },
    [tabs]
  );

  useEffect(() => {
    setActivePageId(
      (tabs.filter((i: ITab<PageIds>) => !i.disabled) as ITab<PageIds>[])[0].id
    );
  }, [type]);

  return (
    <LayerComponent>
      <SectionTab
        tabs={tabs}
        align="start"
        activeTabId={activePageId}
        onTabChange={changeTab}
        horizental={false}
      />

      <PageSwitch pageId={activePageId}>
        {tabs.map((tab) => (
          <Page key={tab?.id} id={tab?.id}>
            <EditorWrapper>{components?.[tab?.id]}</EditorWrapper>
          </Page>
        ))}
      </PageSwitch>
    </LayerComponent>
  );
};

export default InnerTabs;

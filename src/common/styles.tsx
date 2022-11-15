import styled, { css } from 'styled-components/macro';

export const LayerComponent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
  height: 100%;
`;

export const EditorWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 1rem;
  background-color: var(--light-2);
  border-radius: 0 0 var(--radius-8) var(--radius-8);
  box-sizing: border-box;
  & > div:not(:last-of-type) {
    border-bottom: 1px solid var(--shade-4);
  }
`;

export const Select = styled.select`
  appearance: none;
  background-image: url('../assets/icons/arrow-down.svg');
  background-color: var(--light-1);
  border: 1px solid var(--shade-3);
  border-radius: var(--radius-4);
  padding: 0 1em;
  height: 2em;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1em 0;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
`;

export const Selector = styled(Row)`
  justify-content: start;
  gap: 1em;
  padding: 0;
`;

export const Label = styled.div`
  width: 12ch;
`;

export const Icon = styled.div<{ bg?: string; hover?: string }>`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 2em;
  height: 2em;
  background-color: ${(p) => (p.bg ? p.bg : 'var(--color-primary)')};
  border-radius: var(--radius-8);
  ${(p) =>
    p.hover &&
    css`
      &:hover {
        background-color: ${p.hover};
      }
    `}
`;

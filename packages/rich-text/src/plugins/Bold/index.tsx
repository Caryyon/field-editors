import * as React from 'react';
import * as Slate from 'slate-react';
import { css } from 'emotion';
import { SlatePlugin, getRenderLeaf, useStoreEditor } from '@udecode/slate-plugins-core';
import { MARKS } from '@contentful/rich-text-types';
import { getToggleMarkOnKeyDown, isMarkActive, toggleMark } from '@udecode/slate-plugins-common';
import { EditorToolbarButton } from '@contentful/forma-36-react-components';
import { CustomSlatePluginOptions } from 'types';

interface ToolbarBoldButtonProps {
  isDisabled?: boolean;
}

export function ToolbarBoldButton(props: ToolbarBoldButtonProps) {
  const editor = useStoreEditor();

  function handleClick() {
    if (!editor?.selection) return;

    toggleMark(editor, MARKS.BOLD);
    Slate.ReactEditor.focus(editor);
  }

  if (!editor) return null;

  return (
    <EditorToolbarButton
      icon="FormatBold"
      tooltip="Bold"
      label="Bold"
      testId="bold-toolbar-button"
      onClick={handleClick}
      isActive={isMarkActive(editor, MARKS.BOLD)}
      disabled={props.isDisabled}
    />
  );
}

const styles = {
  bold: css({
    fontWeight: 600,
  }),
};

export function Bold(props: Slate.RenderLeafProps) {
  return (
    <strong {...props.attributes} className={styles.bold}>
      {props.children}
    </strong>
  );
}

export function createBoldPlugin(): SlatePlugin {
  return {
    pluginKeys: MARKS.BOLD,
    renderLeaf: getRenderLeaf(MARKS.BOLD),
    onKeyDown: getToggleMarkOnKeyDown(MARKS.BOLD),
    deserialize: () => {
      return {
        leaf: [
          {
            type: MARKS.BOLD,
            deserialize: (element) => {
              // We ignore it otherwise everything will be bold
              const isGoogleBoldWrapper =
                element.id.startsWith('docs-internal-guid') && element.tagName === 'B';

              const isBold =
                ['600', '700', 'bold'].includes(element.style.fontWeight) ||
                ['STRONG', 'B'].includes(element.tagName);

              if (isGoogleBoldWrapper || !isBold) return undefined;

              return {
                [MARKS.BOLD]: true,
              };
            },
          },
        ],
      };
    },
  };
}

export const withBoldOptions: CustomSlatePluginOptions = {
  [MARKS.BOLD]: {
    type: MARKS.BOLD,
    component: Bold,
    hotkey: ['mod+b'],
  },
};
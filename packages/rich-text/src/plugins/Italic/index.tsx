import * as React from 'react';
import * as Slate from 'slate-react';
import { css } from 'emotion';
import {
  SlatePlugin,
  getRenderLeaf,
  useStoreEditor,
  GetNodeDeserializerRule,
} from '@udecode/slate-plugins-core';
import { getToggleMarkOnKeyDown, toggleMark, isMarkActive } from '@udecode/slate-plugins-common';
import { MARKS } from '@contentful/rich-text-types';
import { EditorToolbarButton } from '@contentful/forma-36-react-components';
import { CustomSlatePluginOptions } from 'types';
import { deserializeLeaf } from '../../helpers/deserializer';

interface ToolbarItalicButtonProps {
  isDisabled?: boolean;
}

export function ToolbarItalicButton(props: ToolbarItalicButtonProps) {
  const editor = useStoreEditor();

  function handleClick() {
    if (!editor?.selection) return;

    toggleMark(editor, MARKS.ITALIC);
    Slate.ReactEditor.focus(editor);
  }

  if (!editor) return null;

  return (
    <EditorToolbarButton
      icon="FormatItalic"
      tooltip="Italic"
      label="Italic"
      testId="italic-toolbar-button"
      onClick={handleClick}
      isActive={isMarkActive(editor, MARKS.ITALIC)}
      disabled={props.isDisabled}
    />
  );
}

const styles = {
  italic: css({
    fontStyle: 'italic',
  }),
};

export function Italic(props: Slate.RenderLeafProps) {
  return (
    <em {...props.attributes} className={styles.italic}>
      {props.children}
    </em>
  );
}

export function createItalicPlugin(): SlatePlugin {
  const deserializeRules: GetNodeDeserializerRule[] = [
    { nodeNames: ['I', 'EM'] },
    {
      style: {
        fontStyle: ['italic'],
      },
    },
  ];

  return {
    pluginKeys: MARKS.ITALIC,
    renderLeaf: getRenderLeaf(MARKS.ITALIC),
    onKeyDown: getToggleMarkOnKeyDown(MARKS.ITALIC),
    deserialize: deserializeLeaf(MARKS.ITALIC, deserializeRules),
  };
}

export const withItalicOptions: CustomSlatePluginOptions = {
  [MARKS.ITALIC]: {
    type: MARKS.ITALIC,
    component: Italic,
    hotkey: ['mod+i'],
  },
};
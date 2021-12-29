import * as React from 'react';
import * as Slate from 'slate-react';

import { toggleMark, isMarkActive, someHtmlElement } from '@udecode/plate-core';
import { createUnderlinePlugin as createDefaultUnderlinePlugin } from '@udecode/plate-basic-marks';
import { MARKS } from '@contentful/rich-text-types';
import { FormatUnderlinedIcon } from '@contentful/f36-icons';
import { ToolbarButton } from '../shared/ToolbarButton';
import { useContentfulEditor } from '../../ContentfulEditorProvider';
import { RichTextPlugin } from '../../types';

interface ToolbarUnderlineButtonProps {
  isDisabled?: boolean;
}

export function ToolbarUnderlineButton(props: ToolbarUnderlineButtonProps) {
  const editor = useContentfulEditor();

  function handleClick() {
    if (!editor?.selection) return;

    toggleMark(editor, { key: MARKS.UNDERLINE });
    Slate.ReactEditor.focus(editor);
  }

  if (!editor) return null;

  return (
    <ToolbarButton
      title="Underline"
      testId="underline-toolbar-button"
      onClick={handleClick}
      isActive={isMarkActive(editor, MARKS.UNDERLINE)}
      isDisabled={props.isDisabled}>
      <FormatUnderlinedIcon />
    </ToolbarButton>
  );
}

export function Underline(props: Slate.RenderLeafProps) {
  return <u {...props.attributes}>{props.children}</u>;
}

export const createUnderlinePlugin = (): RichTextPlugin =>
  createDefaultUnderlinePlugin({
    type: MARKS.UNDERLINE,
    component: Underline,
    options: {
      hotkey: ['mod+u'],
    },
    deserializeHtml: {
      rules: [
        {
          validNodeName: ['U'],
        },
        {
          validStyle: {
            textDecoration: ['underline'],
          },
        },
      ],
      query: (el) => {
        return !someHtmlElement(el, (node) => node.style.textDecoration === 'none');
      },
    },
  });
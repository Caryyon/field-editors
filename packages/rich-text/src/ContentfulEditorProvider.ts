import { createContext, useContext } from 'react';

import { FieldExtensionSDK } from '@contentful/app-sdk';
import { usePlateEditorRef, usePlateEditorState } from '@udecode/plate-core';

import { RichTextEditor } from './types';

export function getContentfulEditorId(sdk: FieldExtensionSDK) {
  const { entry, field } = sdk;
  const sys = entry.getSys();

  return `rich-text-editor-${sys.id}-${field.id}-${field.locale}`;
}

export const editorContext = createContext('');

export const ContentfulEditorIdProvider = editorContext.Provider;

export function useContentfulEditorId(id?: string) {
  const contextId = useContext(editorContext);

  if (id) {
    return id;
  }

  if (!contextId) {
    throw new Error(
      'could not find editor id. Please ensure the component is wrapped in <ContentfulEditorIdProvider> '
    );
  }

  return contextId;
}

// This hook re-renders when the value changes
// Use case: Toolbar icons, for example
export function useContentfulEditor(id?: string) {
  const editorId = useContentfulEditorId(id);
  const editor = usePlateEditorState<RichTextEditor>(editorId);

  return editor;
}

// This doesn't re-render when the value changes
export function useContentfulEditorRef(id?: string) {
  const editorId = useContentfulEditorId(id);
  const editor = usePlateEditorRef<RichTextEditor>(editorId);

  return editor;
}

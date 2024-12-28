'use client'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import LexicalToolbar from './LexicalToolbar'
import { HeadingNode } from '@lexical/rich-text'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import theme from './theme'

function onError(error: any) {
  console.error(error)
}

export default function RichTextEditor() {
  const initialConfig = {
    namespace: 'RichTextEditor-1',
    theme,
    onError,
    nodes: [HeadingNode, CodeHighlightNode, CodeNode],
  }

  return (
    <div className='max-w-4xl mx-auto bg-white rounded-lg h-[50vh] p-5'>
      <LexicalComposer initialConfig={initialConfig}>
        <LexicalToolbar></LexicalToolbar>
        <RichTextPlugin
          contentEditable={<ContentEditable className='focus:outline-none' />}
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
      </LexicalComposer>
    </div>
  )
}

'use client'

import { $getRoot, $getSelection } from 'lexical'
import { useEffect } from 'react'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import LexicalToolbar from './LexicalToolbar'
import { HeadingNode } from '@lexical/rich-text'
import theme from './theme'

interface RichTextEditorProps {}

function onError(error: any) {
  console.error(error)
}

// export default function LexicalEditor() {
//   return (<div className="max-2-4xl mx-auto bg-white rounded-lg h-[50vh] p-5"></div>)
// }

export default function RichTextEditor() {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
    nodes: [HeadingNode],
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

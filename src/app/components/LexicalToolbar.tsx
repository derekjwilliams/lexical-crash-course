import { useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'
import React from 'react'

export default function LexicalToolbar() {
  const [editor] =useLexicalComposerContext()
  return (
    <div>Toolbar</div>
  )
}
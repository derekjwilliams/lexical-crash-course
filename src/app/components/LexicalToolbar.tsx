import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { FORMAT_TEXT_COMMAND } from 'lexical'
import React from 'react'

export default function LexicalToolbar() {
  const [editor] = useLexicalComposerContext()
  return (
    <div className="space-x-5">
      <button onClick={() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold") }}>B</button>
      <button className="italic" onClick={() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic") }}>i</button>
    </div>
  )
}
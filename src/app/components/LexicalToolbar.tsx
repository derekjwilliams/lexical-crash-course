import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'
import React, { useCallback, useEffect, useState } from 'react'

export default function LexicalToolbar() {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
    }
  }, [])

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => $updateToolbar())
    })
  }, [editor, $updateToolbar])

  return (
    <div className='space-x-5'>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
        }}>
        B
      </button>
      <button
        className='italic'
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
        }}>
        i
      </button>
    </div>
  )
}

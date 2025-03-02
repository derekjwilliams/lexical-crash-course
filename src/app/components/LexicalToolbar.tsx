import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { mergeRegister } from '@lexical/utils'
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import React, { useCallback, useEffect, useRef, useState, RefObject } from 'react'
import { createPortal } from 'react-dom'
import BlockOptionsDropdownList from './BlockOptionsDropdownList'
import { LOW_PRIORIRTY, RICH_TEXT_OPTIONS } from './LexicalConstants'
import { Bold, Italic, RotateCcw, RotateCw, Strikethrough, Underline } from 'lucide-react'

const LowPriority = LOW_PRIORIRTY

// const handleHeading = () => {
//   editor.update(() => {
//     const selection = $getSelection()
//     if ($isRangeSelection(selection)) {
//       // alert('here')
//       $setBlocksType(selection, () => $createHeadingNode('h1'))
//     }
//   })
// }

export default function LexicalToolbar() {
  const [editor] = useLexicalComposerContext()
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [blockType, setBlockType] = useState('paragraph')
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState(false)

  const supportedBlockTypes = new Set(['paragraph', 'quote', 'code', 'h1', 'h2', 'ul', 'ol'])
  const blockTypeToBlockName = {
    code: 'Code Block',
    h1: 'Large Heading',
    h2: 'Small Heading',
    h3: 'Heading',
    h4: 'Heading',
    h5: 'Heading',
    ol: 'Numbered List',
    paragraph: 'Normal',
    quote: 'Quote',
    ul: 'Bulleted List',
  }

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
    }
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar()
          return false
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        LowPriority
      )
    )
  }, [editor, $updateToolbar])

  return (
    <>
      <div className='space-x-5' ref={toolbarRef}>
        {supportedBlockTypes.has(blockType) && (
          <>
            <button
              className='toolbar-item block-controls'
              onClick={() => setShowBlockOptionsDropDown(!showBlockOptionsDropDown)}
              aria-label='Formatting Options'>
              <span className={'icon block-type ' + blockType} />
              <span className='text'>{blockTypeToBlockName[blockType as keyof typeof blockTypeToBlockName]}</span>
              <i className='chevron-down' />
            </button>
            {showBlockOptionsDropDown &&
              createPortal(
                <BlockOptionsDropdownList
                  editor={editor}
                  blockType={blockType}
                  toolbarRef={toolbarRef}
                  setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
                />,
                document.body
              )}
          </>
        )}

        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
          }}
          className={`toolbar-item-button ${isBold ? 'bg-gray-200' : ''}`}>
          <Bold />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
          }}
          className={`toolbar-item-button ${isItalic ? 'bg-gray-200' : ''}`}>
          <Italic />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
          }}
          className={`toolbar-item-button ${isUnderline ? 'bg-gray-200' : ''}`}>
          <Underline />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
          }}
          className={`toolbar-item-button ${isStrikethrough ? 'bg-gray-200' : ''}`}>
          <Strikethrough />
        </button>
        <button
          disabled={!canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined)
          }}
          className='toolbar-item-button'
          aria-label='Undo'>
          <RotateCcw />
        </button>
        <button
          disabled={!canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined)
          }}
          className='toolbar-item-button'
          aria-label='Redo'>
          <RotateCw />
        </button>
      </div>
    </>
  )
}

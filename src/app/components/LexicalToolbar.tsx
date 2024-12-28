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
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list'
import { $createCodeNode, $isCodeNode, getDefaultCodeLanguage, getCodeLanguages } from '@lexical/code'
import { createPortal } from 'react-dom'

const LowPriority = 1

// const handleHeading = () => {
//   editor.update(() => {
//     const selection = $getSelection()
//     if ($isRangeSelection(selection)) {
//       // alert('here')
//       $setBlocksType(selection, () => $createHeadingNode('h1'))
//     }
//   })
// }

interface BlockOptionsDropdownListProps {
  editor: LexicalEditor // Assuming editor is a LexicalEditor type
  blockType: string // Assuming blockType is a string, update the type as needed
  toolbarRef: RefObject<HTMLElement | null> // Assuming it's a ref to an HTMLElement
  setShowBlockOptionsDropDown: React.Dispatch<React.SetStateAction<boolean>> // Function to update the state
}

const BlockOptionsDropdownList: React.FC<BlockOptionsDropdownListProps> = ({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown,
}) => {
  const dropDownRef = useRef(null)

  useEffect(() => {
    const toolbar = toolbarRef.current
    const dropDown = dropDownRef.current

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect()
      ;(dropDown as HTMLElement).style.top = `${top + 40}px`
      ;(dropDown as HTMLElement).style.left = `${left}px`
    }
  }, [dropDownRef, toolbarRef])

  useEffect(() => {
    const dropDown = dropDownRef.current
    const toolbar = toolbarRef.current

    if (dropDown !== null && toolbar !== null) {
      const handle = (event: { target: any }) => {
        const target = event.target

        if (!(dropDown as HTMLElement).contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false)
        }
      }
      document.addEventListener('click', handle)

      return () => {
        document.removeEventListener('click', handle)
      }
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef])

  const formatParagraph = () => {
    // if (blockType !== "paragraph") {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
    // }
    setShowBlockOptionsDropDown(false)
  }

  const formatLargeHeading = () => {
    if (blockType !== 'h1') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode('h1'))
        }
      })
    }
    setShowBlockOptionsDropDown(false)
  }

  const formatSmallHeading = () => {
    if (blockType !== 'h2') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode('h2'))
        }
      })
    }
    setShowBlockOptionsDropDown(false)
  }

  const formatBulletList = () => {
    if (blockType !== 'ul') {
      editor.focus()
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    } else {
      editor.focus()
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
    setShowBlockOptionsDropDown(false)
  }

  const formatNumberedList = () => {
    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
    setShowBlockOptionsDropDown(false)
  }

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode())
        }
      })
    }
    setShowBlockOptionsDropDown(false)
  }

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode())
        }
      })
    }
    setShowBlockOptionsDropDown(false)
  }

  return (
    <div className='dropdown' ref={dropDownRef}>
      <button className='item' onClick={formatParagraph}>
        <span className='icon paragraph' />
        <span className='text'>Normal</span>
        {blockType === 'paragraph' && <span className='active' />}
      </button>
      <button className='item' onClick={formatLargeHeading}>
        <span className='icon large-heading' />
        <span className='text'>Large Heading</span>
        {blockType === 'h1' && <span className='active' />}
      </button>
      <button className='item' onClick={formatSmallHeading}>
        <span className='icon small-heading' />
        <span className='text'>Small Heading</span>
        {blockType === 'h2' && <span className='active' />}
      </button>
      <button className='item' onClick={formatBulletList}>
        <span className='icon bullet-list' />
        <span className='text'>Bullet List</span>
        {blockType === 'ul' && <span className='active' />}
      </button>
      <button className='item' onClick={formatNumberedList}>
        <span className='icon numbered-list' />
        <span className='text'>Numbered List</span>
        {blockType === 'ol' && <span className='active' />}
      </button>
      <button className='item' onClick={formatQuote}>
        <span className='icon quote' />
        <span className='text'>Quote</span>
        {blockType === 'quote' && <span className='active' />}
      </button>
      <button className='item' onClick={formatCode}>
        <span className='icon code' />
        <span className='text'>Code Block</span>
        {blockType === 'code' && <span className='active' />}
      </button>
    </div>
  )
}
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
        className={`size-8 ${isBold ? 'bg-gray-200' : ''}`}>
        B
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
        }}
        className={`italic size-8 ${isItalic ? 'bg-gray-200' : ''}`}>
        i
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
        }}
        className={`underline size-8 ${isUnderline ? 'bg-gray-200' : ''}`}>
        U
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
        }}
        className={`line-through size-8 ${isStrikethrough ? 'bg-gray-200' : ''}`}>
        S
      </button>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined)
        }}
        className='toolbar-item undo'
        aria-label='Undo'></button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined)
        }}
        className='toolbar-item redo'
        aria-label='Redo'></button>
    </div>
  )
}

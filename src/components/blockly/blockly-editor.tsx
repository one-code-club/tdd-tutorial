'use client'

import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import * as Blockly from 'blockly'
import { javascriptGenerator } from 'blockly/javascript'
import 'blockly/blocks'
import { Card, CardContent } from '@/components/ui/card'
import { registerAllBlocks } from './blocks'
import { registerGenerators } from './generators/javascript'
import { getToolboxConfig } from './toolbox'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/types'

interface BlocklyEditorProps {
  onCodeGenerated?: (code: string) => void
  onExecute?: (code: string) => void
  className?: string
}

export interface BlocklyEditorHandle {
  handleExecute: () => void
  isReady: boolean
  exportWorkspace: () => string | null
  importWorkspace: (json: string) => boolean
  insertBlocks: (blockStates: object[]) => boolean
  resetBlockColours: () => void
  setTestResult: (blockId: string, passed: boolean, errorMessage?: string) => void
}

let registeredLocale: Locale | null = null

const WORKSPACE_STORAGE_KEY = 'tdd-tutorial-workspace'

// Test result block colours
const DEFAULT_TEST_COLOUR = 210  // デフォルト（青）
const TEST_PASS_COLOUR = 120     // 成功（緑）
const TEST_FAIL_COLOUR = 0       // 失敗（赤）

// Save workspace to localStorage
function saveWorkspace(workspace: Blockly.WorkspaceSvg) {
  try {
    const state = Blockly.serialization.workspaces.save(workspace)
    localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save workspace:', error)
  }
}

// Load workspace from localStorage
function loadWorkspace(workspace: Blockly.WorkspaceSvg): boolean {
  try {
    const saved = localStorage.getItem(WORKSPACE_STORAGE_KEY)
    if (saved) {
      const state = JSON.parse(saved)
      Blockly.serialization.workspaces.load(state, workspace)
      return true
    }
  } catch (error) {
    console.error('Failed to load workspace:', error)
  }
  return false
}

// Custom dark theme for better visibility
const darkTheme = Blockly.Theme.defineTheme('darkTheme', {
  name: 'darkTheme',
  base: Blockly.Themes.Classic,
  blockStyles: {
    logic_blocks: {
      colourPrimary: '#4a6cd4',
      colourSecondary: '#3a5cb4',
      colourTertiary: '#2a4c94',
    },
    loop_blocks: {
      colourPrimary: '#49a563',
      colourSecondary: '#398553',
      colourTertiary: '#296543',
    },
    math_blocks: {
      colourPrimary: '#7b5eb5',
      colourSecondary: '#6b4ea5',
      colourTertiary: '#5b3e95',
    },
    text_blocks: {
      colourPrimary: '#49a5a5',
      colourSecondary: '#398585',
      colourTertiary: '#296565',
    },
    list_blocks: {
      colourPrimary: '#8b5e8b',
      colourSecondary: '#7b4e7b',
      colourTertiary: '#6b3e6b',
    },
    colour_blocks: {
      colourPrimary: '#a5745b',
      colourSecondary: '#95644b',
      colourTertiary: '#85543b',
    },
    variable_blocks: {
      colourPrimary: '#c45c8b',
      colourSecondary: '#b44c7b',
      colourTertiary: '#a43c6b',
    },
    variable_dynamic_blocks: {
      colourPrimary: '#c45c8b',
      colourSecondary: '#b44c7b',
      colourTertiary: '#a43c6b',
    },
    procedure_blocks: {
      colourPrimary: '#9b5ca5',
      colourSecondary: '#8b4c95',
      colourTertiary: '#7b3c85',
    },
  },
  categoryStyles: {
    logic_category: { colour: '#4a6cd4' },
    loop_category: { colour: '#49a563' },
    math_category: { colour: '#7b5eb5' },
    text_category: { colour: '#49a5a5' },
    list_category: { colour: '#8b5e8b' },
    colour_category: { colour: '#a5745b' },
    variable_category: { colour: '#c45c8b' },
    procedure_category: { colour: '#9b5ca5' },
  },
  componentStyles: {
    workspaceBackgroundColour: '#e5e7eb',
    toolboxBackgroundColour: '#374151',
    toolboxForegroundColour: '#f3f4f6',
    flyoutBackgroundColour: '#4b5563',
    flyoutForegroundColour: '#f3f4f6',
    flyoutOpacity: 1,
    scrollbarColour: '#6b7280',
    scrollbarOpacity: 0.7,
    insertionMarkerColour: '#000',
    insertionMarkerOpacity: 0.3,
    markerColour: '#000',
    cursorColour: '#000',
  },
  fontStyle: {
    family: 'sans-serif',
    weight: 'bold',
    size: 13,
  },
})

export const BlocklyEditor = forwardRef<BlocklyEditorHandle, BlocklyEditorProps>(function BlocklyEditor({
  onCodeGenerated,
  onExecute,
  className,
}, ref) {
  const { locale, t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null)
  const [isReady, setIsReady] = useState(false)
  const prevLocaleRef = useRef<Locale>(locale)

  const generateCode = useCallback(() => {
    if (!workspaceRef.current) return ''

    try {
      // トップレベルブロックから関数定義とテストケースだけコード生成する
      // ルースコード（関数やテストに属さないブロック）は無視する
      const topBlocks = workspaceRef.current.getTopBlocks(true)
      const functions: string[] = []
      const tests: string[] = []

      for (const block of topBlocks) {
        const blockType = block.type
        if (blockType === 'function_definition') {
          const code = javascriptGenerator.blockToCode(block)
          if (code) functions.push(typeof code === 'string' ? code : code[0])
        } else if (blockType === 'test_case') {
          const code = javascriptGenerator.blockToCode(block)
          if (code) tests.push(typeof code === 'string' ? code : code[0])
        }
        // それ以外のトップレベルブロックは無視する
      }

      // 関数定義を先に、次にテストケースを配置
      const reorderedCode = functions.join('\n') + '\n' + tests.join('\n')

      return reorderedCode
    } catch (error) {
      console.error('Code generation error:', error)
      return ''
    }
  }, [])

  const handleExecute = useCallback(() => {
    const code = generateCode()
    onCodeGenerated?.(code)
    onExecute?.(code)
  }, [generateCode, onCodeGenerated, onExecute])

  const exportWorkspace = useCallback((): string | null => {
    if (!workspaceRef.current) return null
    try {
      const state = Blockly.serialization.workspaces.save(workspaceRef.current)
      return JSON.stringify(state, null, 2)
    } catch {
      return null
    }
  }, [])

  const importWorkspace = useCallback((json: string): boolean => {
    if (!workspaceRef.current) return false
    try {
      const state = JSON.parse(json)

      // Basic schema validation
      if (typeof state !== 'object' || state === null) {
        return false
      }

      // Validate expected Blockly workspace structure
      if (state.blocks !== undefined && typeof state.blocks !== 'object') {
        return false
      }

      Blockly.serialization.workspaces.load(state, workspaceRef.current)
      // Save to localStorage to persist the imported state
      saveWorkspace(workspaceRef.current)
      return true
    } catch {
      return false
    }
  }, [])

  const insertBlocks = useCallback((blockStates: object[]): boolean => {
    if (!workspaceRef.current || blockStates.length === 0) return false
    try {
      // Calculate Y offset to place new blocks below existing ones
      const existingBlocks = workspaceRef.current.getTopBlocks(false)
      let maxY = 0
      for (const block of existingBlocks) {
        const blockRect = block.getBoundingRectangle()
        const bottom = blockRect.bottom
        if (bottom > maxY) {
          maxY = bottom
        }
      }
      // Add padding below existing blocks
      const startY = maxY > 0 ? maxY + 40 : 20
      let offsetY = startY

      for (const blockState of blockStates) {
        // Add position to the block state
        const stateWithPosition = {
          ...blockState,
          x: 20,
          y: offsetY,
        }
        Blockly.serialization.blocks.append(
          stateWithPosition as Blockly.serialization.blocks.State,
          workspaceRef.current,
        )
        // Estimate block height for next block positioning
        offsetY += 200
      }

      // Save to localStorage to persist the inserted blocks
      saveWorkspace(workspaceRef.current)
      return true
    } catch (error) {
      console.error('Failed to insert blocks:', error)
      return false
    }
  }, [])

  // Store TextBubble instances for error messages displayed below test blocks
  const bottomBubblesRef = useRef<Map<string, Blockly.bubbles.TextBubble>>(new Map())

  // Vertical gap between block bottom edge and bubble body (workspace units)
  const BUBBLE_BELOW_OFFSET_TOP = 16
  // Horizontal offset from anchor (workspace units)
  const BUBBLE_BELOW_OFFSET_LEFT = 20

  // Drag-tracking refs for rAF-based bubble follow during block drag
  const isDraggingRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)

  // Update all bottom bubble positions (called when blocks move/resize)
  const updateBubblePositions = useCallback(() => {
    if (!workspaceRef.current) return
    for (const [blockId, bubble] of bottomBubblesRef.current) {
      const block = workspaceRef.current.getBlockById(blockId) as Blockly.BlockSvg | null
      if (block) {
        const blockXY = block.getRelativeToSurfaceXY()
        const hw = block.getHeightWidth()
        // Anchor at the bottom-center of the block
        const anchor = new Blockly.utils.Coordinate(
          blockXY.x + hw.width / 2,
          blockXY.y + hw.height,
        )
        // setAnchorLocation without relayout preserves our custom relative position
        ;(bubble as unknown as Blockly.bubbles.Bubble).setAnchorLocation(anchor)
      } else {
        // Block was deleted — dispose bubble
        bubble.dispose()
        bottomBubblesRef.current.delete(blockId)
      }
    }
  }, [])

  // Continuously update bubble positions during block drag via requestAnimationFrame
  const updateDuringDrag = useCallback(() => {
    if (!isDraggingRef.current) return
    updateBubblePositions()
    rafIdRef.current = requestAnimationFrame(updateDuringDrag)
  }, [updateBubblePositions])

  const startDragTracking = useCallback(() => {
    isDraggingRef.current = true
    rafIdRef.current = requestAnimationFrame(updateDuringDrag)
  }, [updateDuringDrag])

  const stopDragTracking = useCallback(() => {
    isDraggingRef.current = false
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
    // Final position sync after drag ends
    updateBubblePositions()
  }, [updateBubblePositions])

  // Dispose all bottom bubbles
  const disposeAllBottomBubbles = useCallback(() => {
    for (const [, bubble] of bottomBubblesRef.current) {
      bubble.dispose()
    }
    bottomBubblesRef.current.clear()
  }, [])

  const resetBlockColours = useCallback(() => {
    if (!workspaceRef.current) return
    const blocks = workspaceRef.current.getAllBlocks(false)
    blocks.forEach((block) => {
      if (block.type === 'test_case') {
        block.setColour(DEFAULT_TEST_COLOUR)
      }
    })
    // Dispose all error message bubbles
    disposeAllBottomBubbles()
  }, [disposeAllBottomBubbles])

  const setTestResult = useCallback((blockId: string, passed: boolean, errorMessage?: string) => {
    if (!workspaceRef.current) return
    const block = workspaceRef.current.getBlockById(blockId) as Blockly.BlockSvg | null
    if (block && block.type === 'test_case') {
      block.setColour(passed ? TEST_PASS_COLOUR : TEST_FAIL_COLOUR)

      // Clean up existing bubble for this block
      const existingBubble = bottomBubblesRef.current.get(blockId)
      if (existingBubble) {
        existingBubble.dispose()
        bottomBubblesRef.current.delete(blockId)
      }

      if (!passed && errorMessage) {
        const blockXY = block.getRelativeToSurfaceXY()
        const hw = block.getHeightWidth()

        // Anchor at the bottom-center of the block (the tail points here)
        const anchor = new Blockly.utils.Coordinate(
          blockXY.x + hw.width / 2,
          blockXY.y + hw.height,
        )
        // Owner rect tells Blockly the area to avoid overlapping
        const ownerRect = new Blockly.utils.Rect(
          blockXY.y,
          blockXY.y + hw.height,
          blockXY.x,
          blockXY.x + hw.width,
        )

        const bubble = new Blockly.bubbles.TextBubble(
          errorMessage,
          workspaceRef.current,
          anchor,
          ownerRect,
        )

        // Force the bubble body to be positioned BELOW the anchor.
        // This places it outside the block with the tail pointing upward.
        // (left, top) is the bubble's top-left corner relative to the anchor.
        const bubbleBase = bubble as unknown as Blockly.bubbles.Bubble
        bubbleBase.setPositionRelativeToAnchor(
          BUBBLE_BELOW_OFFSET_LEFT,
          BUBBLE_BELOW_OFFSET_TOP,
        )

        bottomBubblesRef.current.set(blockId, bubble)
      }
    }
  }, [])

  useImperativeHandle(ref, () => ({
    handleExecute,
    isReady,
    exportWorkspace,
    importWorkspace,
    insertBlocks,
    resetBlockColours,
    setTestResult,
  }), [handleExecute, isReady, exportWorkspace, importWorkspace, insertBlocks, resetBlockColours, setTestResult])

  // Handle language change - re-register blocks and update toolbox
  useEffect(() => {
    if (prevLocaleRef.current !== locale && workspaceRef.current) {
      // Save current workspace state
      const state = Blockly.serialization.workspaces.save(workspaceRef.current)

      // Re-register blocks and generators with new translations
      registerAllBlocks(t)
      registerGenerators(t)
      registeredLocale = locale

      // Update toolbox with new translations
      workspaceRef.current.updateToolbox(getToolboxConfig(t))

      // Dispose all bottom bubbles before clearing workspace
      disposeAllBottomBubbles()

      // Clear and reload workspace to apply new block definitions
      workspaceRef.current.clear()
      Blockly.serialization.workspaces.load(state, workspaceRef.current)

      prevLocaleRef.current = locale
    }
  }, [locale, t, disposeAllBottomBubbles])

  useEffect(() => {
    if (!containerRef.current || workspaceRef.current) return

    // Register custom blocks if not registered or if locale changed
    if (registeredLocale !== locale) {
      registerAllBlocks(t)
      registerGenerators(t)
      registeredLocale = locale
    }

    // Create workspace
    const workspace = Blockly.inject(containerRef.current, {
      collapse: true,
      toolbox: getToolboxConfig(t),
      grid: {
        spacing: 20,
        length: 3,
        colour: '#9ca3af',
        snap: true,
      },
      trashcan: true,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true,
      },
      zoom: {
        controls: true,
        wheel: false,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      theme: darkTheme,
    })

    workspaceRef.current = workspace
    setIsReady(true)

    // Load saved workspace state
    const hasLoaded = loadWorkspace(workspace)

    // Open the first category by default
    setTimeout(() => {
      const toolbox = workspace.getToolbox() as Blockly.Toolbox | null
      if (toolbox) {
        const items = toolbox.getToolboxItems()
        if (items && items.length > 0) {
          toolbox.setSelectedItem(items[0])
        }
      }
    }, 100)

    // Save workspace on any change and update bottom bubble positions
    const handleChange = (event: Blockly.Events.Abstract) => {
      // Track block drag start/end for real-time bubble following
      if (event.type === Blockly.Events.BLOCK_DRAG) {
        const dragEvent = event as Blockly.Events.BlockDrag
        if (dragEvent.isStart) {
          startDragTracking()
        } else {
          stopDragTracking()
        }
      }

      // Only save on events that modify the workspace
      if (
        event.type === Blockly.Events.BLOCK_CHANGE ||
        event.type === Blockly.Events.BLOCK_CREATE ||
        event.type === Blockly.Events.BLOCK_DELETE ||
        event.type === Blockly.Events.BLOCK_MOVE
      ) {
        saveWorkspace(workspace)
        // Update bottom bubble positions when blocks move or resize
        updateBubblePositions()
      }
    }
    workspace.addChangeListener(handleChange)

    // Ctrl+Wheel zoom handler
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -1 : 1
        const currentScale = workspace.getScale()
        const scaleSpeed = 1.2
        const newScale = delta > 0
          ? currentScale * scaleSpeed
          : currentScale / scaleSpeed
        const clampedScale = Math.max(0.3, Math.min(3, newScale))
        workspace.setScale(clampedScale)
      }
    }
    containerRef.current.addEventListener('wheel', handleWheel, { passive: false })

    // Log if workspace was restored
    if (hasLoaded) {
      console.log('Workspace restored from saved state')
    }

    // Cleanup
    return () => {
      // Stop any in-progress drag tracking
      isDraggingRef.current = false
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      // Dispose all bottom bubbles before workspace disposal
      disposeAllBottomBubbles()
      workspace.removeChangeListener(handleChange)
      containerRef.current?.removeEventListener('wheel', handleWheel)
      workspace.dispose()
      workspaceRef.current = null
    }
  }, [locale, t, updateBubblePositions, disposeAllBottomBubbles, startDragTracking, stopDragTracking])

  return (
    <Card className={cn('bg-gray-800 border-gray-700 flex flex-col', className)}>
      <CardContent className="p-0 flex-1 min-h-0">
        <div
          ref={containerRef}
          className="h-full w-full"
          style={{ minHeight: '400px' }}
        />
      </CardContent>
    </Card>
  )
})

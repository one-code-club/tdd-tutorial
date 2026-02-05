'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as Blockly from 'blockly'
import { javascriptGenerator } from 'blockly/javascript'
import 'blockly/blocks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Trash2 } from 'lucide-react'
import { registerAllBlocks } from './blocks'
import { registerGenerators } from './generators/javascript'
import { toolboxConfig } from './toolbox'
import { cn } from '@/lib/utils'

interface BlocklyEditorProps {
  onCodeGenerated?: (code: string) => void
  onExecute?: () => void
  onClear?: () => void
  isExecuting?: boolean
  className?: string
}

let blocksRegistered = false

const WORKSPACE_STORAGE_KEY = 'tdd-tutorial-workspace'

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

export function BlocklyEditor({
  onCodeGenerated,
  onExecute,
  onClear,
  isExecuting = false,
  className,
}: BlocklyEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null)
  const [isReady, setIsReady] = useState(false)

  const generateCode = useCallback(() => {
    if (!workspaceRef.current) return ''

    try {
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current)
      return code
    } catch (error) {
      console.error('Code generation error:', error)
      return ''
    }
  }, [])

  const handleExecute = useCallback(() => {
    const code = generateCode()
    onCodeGenerated?.(code)
    onExecute?.()
  }, [generateCode, onCodeGenerated, onExecute])

  const handleClear = useCallback(() => {
    if (workspaceRef.current) {
      workspaceRef.current.clear()
      saveWorkspace(workspaceRef.current)
    }
    onClear?.()
  }, [onClear])

  useEffect(() => {
    if (!containerRef.current || workspaceRef.current) return

    // Register custom blocks only once
    if (!blocksRegistered) {
      registerAllBlocks()
      registerGenerators()
      blocksRegistered = true
    }

    // Create workspace
    const workspace = Blockly.inject(containerRef.current, {
      toolbox: toolboxConfig,
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

    // Open the first category ("テスト") by default
    setTimeout(() => {
      const toolbox = workspace.getToolbox() as Blockly.Toolbox | null
      if (toolbox) {
        const items = toolbox.getToolboxItems()
        if (items && items.length > 0) {
          toolbox.setSelectedItem(items[0])
        }
      }
    }, 100)

    // Save workspace on any change
    const handleChange = (event: Blockly.Events.Abstract) => {
      // Only save on events that modify the workspace
      if (
        event.type === Blockly.Events.BLOCK_CHANGE ||
        event.type === Blockly.Events.BLOCK_CREATE ||
        event.type === Blockly.Events.BLOCK_DELETE ||
        event.type === Blockly.Events.BLOCK_MOVE
      ) {
        saveWorkspace(workspace)
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
      workspace.removeChangeListener(handleChange)
      containerRef.current?.removeEventListener('wheel', handleWheel)
      workspace.dispose()
      workspaceRef.current = null
    }
  }, [])

  return (
    <Card className={cn('bg-gray-800 border-gray-700 flex flex-col', className)}>
      <CardHeader className="py-1.5 px-3 border-b border-gray-700 flex flex-row items-center">
        <CardTitle className="text-xs font-medium text-gray-400 flex-shrink-0">
          ブロックエディタ
        </CardTitle>
        <div className="flex-1 flex justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-gray-400 hover:text-white h-7 text-xs px-2"
            disabled={!isReady}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            クリア
          </Button>
          <Button
            size="sm"
            onClick={handleExecute}
            className="bg-green-600 hover:bg-green-700 h-7 text-xs px-3"
            disabled={!isReady || isExecuting}
          >
            <Play className="h-3 w-3 mr-1" />
            {isExecuting ? '実行中...' : '実行'}
          </Button>
        </div>
        <div className="flex-shrink-0 w-20" />
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <div
          ref={containerRef}
          className="h-full w-full"
          style={{ minHeight: '400px' }}
        />
      </CardContent>
    </Card>
  )
}

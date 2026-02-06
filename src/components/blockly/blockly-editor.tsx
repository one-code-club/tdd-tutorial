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
}

let registeredLocale: Locale | null = null

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
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current)

      // Reorder code: function definitions first, then test cases
      // This ensures functions are defined before tests run
      const lines = code.split('\n')
      const functions: string[] = []
      const others: string[] = []

      let inFunction = false
      let braceCount = 0
      let currentFunction: string[] = []

      for (const line of lines) {
        if (!inFunction && line.match(/^function\s+[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+\s*\(/)) {
          inFunction = true
          braceCount = 0
          currentFunction = [line]
        } else if (inFunction) {
          currentFunction.push(line)
        } else {
          others.push(line)
        }

        if (inFunction) {
          braceCount += (line.match(/\{/g) || []).length
          braceCount -= (line.match(/\}/g) || []).length

          if (braceCount === 0) {
            functions.push(currentFunction.join('\n'))
            currentFunction = []
            inFunction = false
          }
        }
      }

      // Put functions first, then the rest (test cases)
      const reorderedCode = functions.join('\n') + '\n' + others.join('\n')

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

  useImperativeHandle(ref, () => ({
    handleExecute,
    isReady,
    exportWorkspace,
    importWorkspace,
  }), [handleExecute, isReady, exportWorkspace, importWorkspace])

  // Handle language change - re-register blocks and update toolbox
  useEffect(() => {
    if (prevLocaleRef.current !== locale && workspaceRef.current) {
      // Save current workspace state
      const state = Blockly.serialization.workspaces.save(workspaceRef.current)

      // Re-register blocks with new translations
      registerAllBlocks(t)
      registeredLocale = locale

      // Update toolbox with new translations
      workspaceRef.current.updateToolbox(getToolboxConfig(t))

      // Clear and reload workspace to apply new block definitions
      workspaceRef.current.clear()
      Blockly.serialization.workspaces.load(state, workspaceRef.current)

      prevLocaleRef.current = locale
    }
  }, [locale, t])

  useEffect(() => {
    if (!containerRef.current || workspaceRef.current) return

    // Register custom blocks if not registered or if locale changed
    if (registeredLocale !== locale) {
      registerAllBlocks(t)
      registerGenerators()
      registeredLocale = locale
    }

    // Create workspace
    const workspace = Blockly.inject(containerRef.current, {
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
  }, [locale, t])

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

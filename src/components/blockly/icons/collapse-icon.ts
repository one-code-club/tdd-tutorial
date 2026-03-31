import * as Blockly from 'blockly'

const ICON_SIZE = 24
// SVG paths for chevron icons (pointing down = expanded, pointing right = collapsed)
const CHEVRON_DOWN_PATH = 'M4,8 L12,17 L20,8' // ▼ expanded
const CHEVRON_RIGHT_PATH = 'M8,4 L17,12 L8,20' // ▶ collapsed

export class CollapseIcon extends Blockly.icons.Icon {
  static readonly TYPE = new Blockly.icons.IconType<CollapseIcon>('collapse_toggle')

  constructor(sourceBlock: Blockly.Block) {
    super(sourceBlock)
  }

  getType(): Blockly.icons.IconType<CollapseIcon> {
    return CollapseIcon.TYPE
  }

  initView(pointerdownListener: (e: PointerEvent) => void): void {
    if (this.svgRoot) return
    super.initView(pointerdownListener)

    // Background circle for click target
    Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.CIRCLE,
      {
        'class': 'blocklyCollapseIconBg',
        'r': '11',
        'cx': '12',
        'cy': '12',
        'fill': 'rgba(255,255,255,0.2)',
        'stroke': 'none',
        'cursor': 'pointer',
      },
      this.svgRoot,
    )

    // Chevron path
    Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.PATH,
      {
        'class': 'blocklyCollapseIconChevron',
        'd': this.sourceBlock.isCollapsed() ? CHEVRON_RIGHT_PATH : CHEVRON_DOWN_PATH,
        'fill': 'none',
        'stroke': 'white',
        'stroke-width': '3',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'cursor': 'pointer',
      },
      this.svgRoot,
    )
  }

  getSize(): Blockly.utils.Size {
    return new Blockly.utils.Size(ICON_SIZE, ICON_SIZE)
  }

  getWeight(): number {
    // Show before other icons (lower weight = shown first/left)
    return -1
  }

  onClick(): void {
    const block = this.sourceBlock
    block.setCollapsed(!block.isCollapsed())
    this.updateChevron()
  }

  isShownWhenCollapsed(): boolean {
    return true
  }

  updateCollapsed(): void {
    // Override to keep icon visible when collapsed (do nothing)
    this.updateChevron()
  }

  private updateChevron(): void {
    if (!this.svgRoot) return
    const chevron = this.svgRoot.querySelector('.blocklyCollapseIconChevron')
    if (chevron) {
      const path = this.sourceBlock.isCollapsed() ? CHEVRON_RIGHT_PATH : CHEVRON_DOWN_PATH
      chevron.setAttribute('d', path)
    }
  }

  dispose(): void {
    super.dispose()
  }
}

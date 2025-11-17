import { Block } from '@slack/types'
import { JSXSlackError } from '../../error'
import { JSXSlack } from '../../jsx'
import { createComponent } from '../../jsx-internals'
import { LayoutBlockProps } from './utils'

interface TableBlock extends Block {
  type: 'table'
  rows: TableCellObject[][]
  column_settings?: ColumnSetting[]
}

interface TableCellObject {
  type: 'raw_text' | 'rich_text'
  text: string
}

interface ColumnSetting {
  align?: 'left' | 'center' | 'right'
  is_wrapped?: boolean
}

interface ColumnSettingProp {
  align?: 'left' | 'center' | 'right'
  wrap?: boolean
}

const tableRowSymbol = Symbol('jsx-slack-table-row')
const tableCellSymbol = Symbol('jsx-slack-table-cell')

export interface TableProps extends LayoutBlockProps {
  children?: JSXSlack.ChildElements
  columnSettings?: ColumnSettingProp[]
}

interface TableRowProps {
  children: JSXSlack.ChildElements
}

interface TableCellProps {
  children: JSXSlack.ChildElements
}

export const TableCell = createComponent<TableCellProps, TableCellObject>(
  'TableCell',
  ({ children }) => {
    const text = JSXSlack.Children.toArray(children)
      .map((child) => {
        if (typeof child === 'string') return child
        if (typeof child === 'number') return String(child)
        return ''
      })
      .join('')

    return Object.defineProperty(
      { type: 'raw_text' as const, text },
      tableCellSymbol,
      { value: true },
    )
  },
)

export const TableRow = createComponent<TableRowProps, TableCellObject[]>(
  'TableRow',
  ({ children }) => {
    const cells: TableCellObject[] = []

    JSXSlack.Children.toArray(children).forEach((child) => {
      if (
        typeof child === 'object' &&
        child !== null &&
        tableCellSymbol in child
      ) {
        cells.push(child as unknown as TableCellObject)
      }
    })

    if (cells.length > 20) {
      throw new JSXSlackError(
        `<TableRow> can contain up to 20 cells, but there are ${cells.length} cells.`,
        children,
      )
    }

    return Object.defineProperty(cells, tableRowSymbol, { value: true })
  },
)

export const Table = createComponent<TableProps, TableBlock>(
  'Table',
  ({ blockId, children, id, columnSettings, ...rest }) => {
    const rows: TableCellObject[][] = []

    if (children) {
      JSXSlack.Children.toArray(children).forEach((child) => {
        if (
          Array.isArray(child) &&
          tableRowSymbol in child
        ) {
          rows.push(child as TableCellObject[])
        }
      })
    }

    if (rows.length > 100) {
      throw new JSXSlackError(
        `<Table> can contain up to 100 rows, but there are ${rows.length} rows.`,
        rest['__source'],
      )
    }

    let column_settings: ColumnSetting[] | undefined

    if (columnSettings) {
      if (columnSettings.length > 20) {
        throw new JSXSlackError(
          `<Table> columnSettings can contain up to 20 items, but there are ${columnSettings.length} items.`,
          rest['__source'],
        )
      }

      column_settings = columnSettings.map((setting) => {
        const result: ColumnSetting = {}
        if (setting.align !== undefined) {
          result.align = setting.align
        }
        if (setting.wrap !== undefined) {
          result.is_wrapped = setting.wrap
        }
        return result
      })
    }

    return {
      type: 'table',
      block_id: blockId || id,
      rows,
      column_settings,
    }
  },
)

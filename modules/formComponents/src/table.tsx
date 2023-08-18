import { CommonStateProps } from "./common";
import {
  decamelize,
  findJoiner,
  makeIntoString,
  NameAnd,
  numberOrUndefined,
  safeArray,
  safeString, stringOrUndefined
} from "@focuson-nw/utils";
import { LensState, reasonFor } from "@focuson-nw/state";
import { Lenses, Transform } from "@focuson-nw/lens";
import {CSSProperties, forwardRef, MutableRefObject, Ref, useEffect, useRef} from "react";
import { PageSelectionContext, replaceTextUsingPath } from "@focuson-nw/pages";

export interface CommonTableProps<S, T, Context> extends CommonStateProps<S, T[], Context> {
  /** If set then the selected index will be copied here as the table items are selected. */
  copySelectedIndexTo?: LensState<S, number, Context>
  /** If set then the selected index will be copied here as the table items are selected */
  copySelectedItemTo?: LensState<S, T, Context>
  joiners?: string | string[];
  prefixFilter?: LensState<S, string, Context>; // column is hard coded. but the prefix is in the state
  prefixColumn?: keyof T;
  maxCount?: string;
  emptyData?: string;
  tableTitle?: string;
  scrollAfter?: string;
  /** A list of fields that we want to be right justified */
  rights?: string[];
}
export interface TableProps<S, T, Context> extends CommonTableProps<S, T, Context> {
  order: (keyof T)[];
}

export function getValueForTable<T> ( o: keyof T, row: T, joiners: undefined | string | string[] ): any {
  return makeIntoString ( o.toString (), row[ o ], findJoiner ( o.toString (), joiners ) );
}

export const transformsForUpdateSelected = <S, T, C> ( copySelectedIndexTo?: LensState<S, number, C>, copySelectedItemTo?: LensState<S, T, C> ) => ( i: number, row: T ): Transform<S, any>[] => {
  const indexTx: Transform<S, number>[] = copySelectedIndexTo ? [ [ copySelectedIndexTo.optional, () => i ] ] : []
  const itemTx: Transform<S, T>[] = copySelectedItemTo ? [ [ copySelectedItemTo.optional, () => row ] ] : []
  return [ ...indexTx, ...itemTx ]
};

export function defaultOnClick<S, Context, T> ( props: CommonTableProps<S, T, Context> ) {
  const { id, state, copySelectedIndexTo, copySelectedItemTo } = props
  return ( i: number, row: T ) => ( e: any ) => {
    if ( copySelectedIndexTo || copySelectedItemTo ) {
      const txs = transformsForUpdateSelected ( copySelectedIndexTo, copySelectedItemTo ) ( i, row )
      state.massTransform ( reasonFor ( 'Table', 'onClick', id, `selected row ${i}` ) ) ( ...txs )
    }
  };
}

export type OneRowFn<T> = (
  row: T, i: number, classForTr: string | undefined,
  rights: string[] | undefined, selectedIndex: number | undefined,
  onClick: ( i: number, row: T ) => ( e: any ) => void,
  onKeyDown: ( i: number, row: T, rowId: string ) => (e: any) => void
) => JSX.Element

export function addClassRowFn<T> ( fn: OneRowFn<T>, classFn: ( t: T ) => string | undefined ): OneRowFn<T> {
  return ( row, i, classForTr, rights, selectedIndex, onClick, onKeyDown ) => {
    const classFromFn = classFn ( row )
    const realClassForTr = classForTr ? `${classForTr} ${classFromFn ? classFromFn : ''}` : classFromFn
    return fn ( row, i, realClassForTr, rights, selectedIndex, onClick, onKeyDown )
  }
}

export type DisplayTitleFn = ( id: string, field: string, i: number ) => JSX.Element
export const defaultDisplayTitleFn: DisplayTitleFn = ( id, field, i ) => <th key={field} id={`${id}.th[${i}]`} role={"columnheader"} aria-colindex={i + 1}>{decamelize ( field, ' ' )}</th>
export const rawTable = <S, T, Context extends PageSelectionContext<S>> (
  titles: any[],
  onClick: ( i: number, row: T ) => ( e: any ) => void,
  oneRow: OneRowFn<T>,
  displayTitleFn?: DisplayTitleFn ) =>
  ( props: CommonTableProps<S, T, Context> ) => {
    const realDisplayTitleFn = displayTitleFn ? displayTitleFn : defaultDisplayTitleFn
    const { id, state, copySelectedIndexTo, copySelectedItemTo, joiners, prefixFilter, prefixColumn, maxCount, emptyData, tableTitle, scrollAfter, rights } = props
    const tbodyScroll: CSSProperties | undefined = scrollAfter ? { height: scrollAfter, overflow: 'auto' } : undefined
    const orderJsx = titles.map ( ( o, i ) => realDisplayTitleFn ( id, o.toString (), i ) )
    const json: T[] = safeArray ( state.optJson (), `Table id: [${id}] path: ${state.optional.description}` )
    const selected = copySelectedIndexTo?.optJson ()
    function selectedClass ( i: number ) { return i === selected ? 'grid-selected' : undefined }
    const tbodyRef = useRef(null)

    const handleSelectTableItem = (e: KeyboardEvent, i: number, row: T) => {
      if (copySelectedIndexTo || copySelectedItemTo) {
        const txs = transformsForUpdateSelected ( copySelectedIndexTo, copySelectedItemTo ) ( i, row )
        state.massTransform ( reasonFor ( 'Table', 'onKeyDown', id, `selected row ${i}` ) ) ( ...txs );
      }
    }

    const handleKeyDown = ( i: number, row: T, rowId: string ) => ( e: any ) => {
      const currentRowRef = tbodyRef.current?.children.namedItem(rowId)
      if (e.keyCode === 32) { e.preventDefault(); handleSelectTableItem(e, i, row); return; }
      switch (e.key) {
        case "ArrowUp":     e.preventDefault(); currentRowRef?.previousElementSibling?.focus(); break;
        case "ArrowDown":   e.preventDefault(); currentRowRef?.nextElementSibling?.focus(); break;
        case "Enter":       e.preventDefault(); handleSelectTableItem(e, i, row); break;
        case " ":           e.preventDefault(); handleSelectTableItem(e, i, row); break;
        default: break;
      }
    }

    const prefixFilterString = prefixFilter?.optJsonOr ( '' )
    const filter = ( t: T ) => prefixColumn && prefixFilter ? getValueForTable ( prefixColumn, t, joiners ).toString ().startsWith ( prefixFilterString ) : true;
    let maxCountInt = maxCount ? Number.parseInt ( maxCount ) : 0;
    let count = 0;
    let tableBody = json.length === 0 && emptyData
      ? <tr id={`${id}[0]`}>
          <td colSpan={titles.length}>{emptyData}</td>
        </tr>
      : json.map ( ( row, i ) =>
        filter ( row ) && (maxCount === undefined || count++ < maxCountInt)
          ? oneRow ( row, i, selectedClass ( i ), rights, selected, onClick, handleKeyDown )
          : null
      );

    const title = tableTitle ? <h2 dangerouslySetInnerHTML={{ __html: replaceTextUsingPath ( state, tableTitle ) }}/> : null
    const tableAriaLabel: string = `${tableTitle ? 'Table Title: ' + tableTitle : ''}: Focus with tab, navigate rows with arrow keys, enter or space to select.`
    const tableAriaHeaders = `headers: ${titles.map((o, index) => (index + 1).toString() + ":" + o.toString()).join(": ")}: `;
    return (
      <>
        <span>(Focus with tab, navigate rows with arrow keys, enter or space to select.)</span>
        <div role={"grid"} aria-colcount={orderJsx.length} aria-rowcount={json.length + 1}>{title}
          <table id={id} className="grid" aria-label={tableAriaLabel}>
            <thead>
              <tr aria-label={tableAriaHeaders} aria-rowindex={1} tabIndex={0}>{orderJsx}</tr>
            </thead>
            <tbody ref={tbodyRef} className="grid-sub" style={tbodyScroll}>{tableBody}</tbody>
          </table>
        </div>
      </>
    )
  };

export function tdClassForTable ( rights: string[] | undefined, s: any ) {
  if ( !rights ) return undefined
  return rights.includes ( s ) ? 'right' : undefined
}

const ariaLabelForTableRow = <T extends any>(i: number, order: ( keyof T )[], row: T, joiners: string | string[] | undefined, getValue: ( o: keyof T, row: T, joiners: undefined | string | string[] ) => any) =>
  `table: row ${i + 1}: ` + order.map(o => `${o.toString()}: ${getValue(o, row, joiners)}:`)


const tabIndexForTableRow = (clazz: string, i: number, selectedIndex: number | undefined): number => {
  if (!selectedIndex) return i == 0 ? 0 : -1
  return clazz ? 0 : -1
}

export const defaultOneRowWithGetValue = <T extends any> ( getValue: ( o: keyof T, row: T, joiners: undefined | string | string[] ) => any ) =>
  ( id: string, order: (keyof T)[], joiners: string | string[] | undefined, ...extraTds: (( i: number, row: T ) => JSX.Element)[] ): OneRowFn<T> =>
    ( row: T, i: number, clazz: string | undefined, rights: string[] | undefined, selectedIndex: number | undefined, onClick: ( i: number, row: T ) => ( e: any ) => void, onKeyDown: ( i: number, row: T, rowId: string ) => ( e: any ) => void, ref?: any ) =>
      ( <tr id={`${id}[${i}]`} role={"row"} aria-label={ariaLabelForTableRow(i, order, row, joiners, getValue)} aria-rowindex={i + 2} className={clazz} key={i} tabIndex={tabIndexForTableRow(clazz, i, selectedIndex)} onClick={onClick ( i, row )} onKeyDown={onKeyDown( i, row, `${id}[${i}]` )}>{order.map ( (o, index) =>
        <td id={`${id}[${i}].${o.toString ()}`} role={"gridcell"} tabIndex={-1} aria-colindex={index + 1} className={tdClassForTable ( rights, o )} key={o.toString ()}>{getValue ( o, row, joiners )}</td> )}{extraTds.map ( ( e, j ) => <td key={`extra${j}`}>{e ( i, row )}</td> )}</tr>);

export const defaultOneRow = defaultOneRowWithGetValue ( getValueForTable )

export function Table<S, T, Context extends PageSelectionContext<S>> ( props: TableProps<S, T, Context> ) {
  const { id, order, joiners } = props
  return rawTable<S, T, Context> ( order, defaultOnClick ( props ), defaultOneRow ( id, order, joiners ) ) ( props )
}

//TODO: Add roving tabindex and useful arialabel to oneRowForStructure()
export const oneRowForStructure = <S, T extends any, Context>
( id: string, state: LensState<S, T[], Context>, paths: NameAnd<( s: LensState<S, T, Context> ) => LensState<S, any, Context>>, ...extraTds: (( i: number, row: T ) => JSX.Element)[] ): OneRowFn<T> =>
  ( row: T, i: number, clazz: string | undefined, rights: string[] | undefined, selectedIndex: number | undefined, onClick: ( i: number, row: T ) => ( e: any ) => void , onKeyDown: ( i: number, row: T, rowId: string ) => ( e: any ) => void ) => {
    const rowState = state.chainLens ( Lenses.nth ( i ) )
    const ariaLabelText: string = `table: row ${i}: ` + Object.entries(row).map(([k, v],colNum) => `column ${colNum}: ${k}: ${v}:`).join(' - ') + ' - end'
    return (<tr id={`${id}[${i}]`} role={"row"} aria-label={ariaLabelText} aria-rowindex={i + 2} className={clazz} key={i} tabIndex={i == 0 ? 0 : -1} onClick={onClick ( i, row )} onKeyDown={onKeyDown( i, row, `${id}[${i}]` )}>{Object.values ( paths ).map ( ( o, col ) => {
      const colState = o ( rowState )
      return <td id={`${id}[${i}].${col}`} role={"gridcell"} tabIndex={-1} aria-colindex={col + 1} className={tdClassForTable ( rights, o )} key={col}>{colState.optJson ()}</td>
    } )}{extraTds.map ( e => <td>{e ( i, row )}</td> )}</tr>);
  }


export interface StructureTableProps<S, T, Context> extends CommonTableProps<S, T, Context> {
  paths: NameAnd<( s: LensState<S, T, Context> ) => LensState<S, any, Context>>;
}
export function StructureTable<S, T, Context extends PageSelectionContext<S>> ( props: StructureTableProps<S, T, Context> ) {
  const { id, state, paths } = props
  return rawTable<S, T, Context> ( Object.keys ( paths ), defaultOnClick ( props ), oneRowForStructure ( id, state, paths ) ) ( props )
}

export interface TableWithHighLightIfOverProps<S, T, Context> extends TableProps<S, T, Context> {
  nameOfCellForMinimum: keyof T
  minimumValue: number
  classNameOfHighlight: string
}
export function TableWithHighLightIfOver<S, T, Context extends PageSelectionContext<S>> ( props: TableWithHighLightIfOverProps<S, T, Context> ) {
  const { id, nameOfCellForMinimum, minimumValue, classNameOfHighlight, order, joiners } = props
  const oneRow = addClassRowFn ( defaultOneRow ( id, order, joiners ), row => {
    const value = numberOrUndefined ( row[ nameOfCellForMinimum ] )
    const shouldHighlight = value !== undefined && minimumValue !== undefined && value <= minimumValue
    return shouldHighlight ? classNameOfHighlight : undefined
  } )
  return rawTable<S, T, Context> ( order, defaultOnClick ( props ), oneRow ) ( props )
}
export interface TableWithHighLightIfOverDataDependantProps<S, T, Context> extends TableProps<S, T, Context> {
  nameOfCellForMinimum: keyof T
  minimumPath: LensState<S, number, Context>
  classNameOfHighlight: string
}
export function TableWithHighLightIfOverDataDependant<S, T, Context extends PageSelectionContext<S>> ( props: TableWithHighLightIfOverDataDependantProps<S, T, Context> ) {
  const { id, nameOfCellForMinimum, minimumPath, classNameOfHighlight, order, joiners } = props
  const minimumValue = minimumPath.optJson ()
  const oneRow = addClassRowFn ( defaultOneRow ( id, order, joiners ), row => {
    const value = numberOrUndefined ( row[ nameOfCellForMinimum ] )
    const shouldHighlight = value !== undefined && minimumValue !== undefined && value <= minimumValue
    return shouldHighlight ? classNameOfHighlight : undefined
  } )
  return rawTable<S, T, Context> ( order, defaultOnClick ( props ), oneRow ) ( props )
}

export interface TableWithHighLightIfCellEqualsValueProps<S, T, Context> extends TableProps<S, T, Context> {
  nameOfCellForEquals: keyof T
  value: string
  classNameOfHighlight: string
}

export function TableWithHighLightIfCellEqualsValue<S, T, Context extends PageSelectionContext<S>> ( props: TableWithHighLightIfCellEqualsValueProps<S, T, Context> ) {
  const { id, nameOfCellForEquals, value, classNameOfHighlight, order, joiners } = props
  const oneRow = addClassRowFn ( defaultOneRow ( id, order, joiners ), row => {
    const tableValue = stringOrUndefined(row[ nameOfCellForEquals ])
    const shouldHighlight = tableValue !== undefined && value !== undefined && tableValue === value
    return shouldHighlight ? classNameOfHighlight : undefined
  } )
  return rawTable<S, T, Context> ( order, defaultOnClick ( props ), oneRow ) ( props )
}
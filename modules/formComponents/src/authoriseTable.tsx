import {LensState, reasonFor} from "@focuson-nw/state";
import {Lenses, Transform} from "@focuson-nw/lens";
import {safeArray} from "@focuson-nw/utils";
import {LabelAndStringInput} from "./labelAndInput";
import {FocusOnContext} from "@focuson-nw/focuson";
import {Layout} from "./layout";
import {
  defaultDisplayTitleFn,
  defaultOnClick,
  defaultOneRowWithGetValue,
  DisplayTitleFn,
  getValueForTable,
  rawTable,
  TableProps
} from "./table";
import {LabelAndFixedNumber} from "./labelAndFixedNumber";
import {ForwardedRef, useEffect, useRef} from "react";


export interface AuthoriseTableData {
  hold?: boolean;
  authorisedBy?: string;
  approvedBy?: string;
  status?: string;
  type: string;
  amount: string;
}

export interface AuthoriseTableProps<S, D extends AuthoriseTableData, C> extends TableProps<S, D, C> {
  firstColumnName?: string
}

const getValueForAuthorisedTable = <T extends AuthoriseTableData> ( o: keyof T, row: T, joiners: undefined | string | string[] ) => {
  return o === 'status' && row[ 'hold' ] ? 'HELD' : getValueForTable ( o, row, joiners );
}

const doSelectionTxsForHaltBox = <S, D extends AuthoriseTableData, C>( state: LensState<S, D[], C>, row: D, id: string, i: number ): void => {
  let newRow = { ...row, hold: !row.hold };
  const thisTx: Transform<S, any> = [ state.optional.chain ( Lenses.nth ( i ) ), row => newRow ]
  state.massTransform ( reasonFor ( `AuthoriseTable[${i}]`, 'onChange', id ) ) ( thisTx );
}

const haltBox = <S, D extends AuthoriseTableData, C> ( state: LensState<S, D[], C>, id: string ) => ( i: number, row: D ) => {
  const onChange = () => {
    doSelectionTxsForHaltBox(state, row, id, i)
  }
  const onKeyDown = (e: any): void => {
    // If (Space) do selection Txns
    if (e.keyCode === 32 || e.key === "Enter") {
      e.stopPropagation()
      e.preventDefault()
      doSelectionTxsForHaltBox(state, row, id, i)
    }
  }
  let tabIndex = -1
  const elements = document.getElementsByClassName('grid-selected')
  if ( elements !== null ) {
    const selected = elements.item(0)
    if (selected !== undefined && selected !== null) {
      const selectedIndexString = selected.id.slice(selected.id.indexOf("[") + 1, -1)
      const selectedIndex = Number.parseInt(selectedIndexString)
      if (i === selectedIndex) tabIndex = 0
    }
  }
  return <input type='checkbox' tabIndex={tabIndex} aria-label={`Halt for row ${i}`} onChange={onChange} checked={row.hold} onKeyDown={onKeyDown}/>
};

function sum<D extends AuthoriseTableData> ( ds: D[], crOrDr: 'CR' | 'DR' ): string {
  return "" + safeArray ( ds ).reduce ( ( acc, v ) => v.type == crOrDr ? acc + Number.parseFloat ( v.amount ) : acc, 0 )
}

function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export const AuthoriseTable = <S, D extends AuthoriseTableData, C extends FocusOnContext<S>> ( props: AuthoriseTableProps<S, D, C> ) => {
  const { state, order, id, joiners, mode, copySelectedItemTo, copySelectedIndexTo, firstColumnName } = props
  const dispTitle: DisplayTitleFn = ( id, field, i ) => i === 0 ? <th key={field} id={`${id}.th[${i}]`}>{firstColumnName}</th> : defaultDisplayTitleFn ( id, field, i );
  const NewRawTable = rawTable<S, D, C> ( [ ...order, 'Halt' ], defaultOnClick ( props ), defaultOneRowWithGetValue ( getValueForAuthorisedTable ) ( id, order, [], haltBox ( state, id ) ), dispTitle )
  const data = state.optJsonOr ( [] )
  const credits = sum ( data, 'CR' )
  const debits = sum ( data, 'DR' )
  // @ts-ignorea
  const approvedByS: LensState<S, string, C> = copySelectedItemTo.focusOn ( 'approvedBy' );
  // @ts-ignore
  const authorisedByS: LensState<S, string, C> = copySelectedItemTo.focusOn ( 'authorisedBy' );

  useEffect(function focusSelectedItem() {
    const elements = document.getElementsByClassName('grid-selected')
    if ( elements !== null ) {
      const selected = elements.item(0)
      if ( selected !== undefined && selected !== null ) {
        //@ts-ignore
        selected.focus()
        if (!isInViewport(selected)) selected.scrollIntoView({ block: "center", behavior: "smooth" })
      }
    }
  })

  return (
    <Layout state={state} details='[[1],[1,1],[1,1,1]]'>
      <NewRawTable {...props }/>
      <LabelAndStringInput id={`${id}.approvedBy`} label='Approved By' state={approvedByS} mode='view' allButtons={{}}/>
      <LabelAndStringInput id={`${id}.authorisedBy`} label='Authorised By' state={authorisedByS} mode='view' allButtons={{}}/>
      <LabelAndFixedNumber id={`${id}.totalCredits`} label='Total Credits' number={credits}/>
      <LabelAndFixedNumber id={`${id}.totalDebuts`} label='Total Debits' number={debits}/>
      <LabelAndFixedNumber id={`${id}.waste`} label='Waste' number={'0.00'}/>
    </Layout>
  )
}
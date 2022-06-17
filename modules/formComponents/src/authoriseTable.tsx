import { LensProps, LensState, reasonFor } from "@focuson/state";
import { Lenses, Transform } from "@focuson/lens";
import { PageMode } from "@focuson/pages";
import { LabelAndStringInput } from "./labelAndInput";
import { FocusOnContext } from "@focuson/focuson";
import { Layout } from "./layout";
import { decamelize } from "@focuson/utils";
import { rawTable, transformsForUpdateSelected } from "./table";


export interface AuthoriseTableData {
  hold?: boolean;
  authorisedBy?: string;
  approvedBy?: string;
  status?: string;
}

export interface AuthoriseTableProps<S, D extends AuthoriseTableData, C> extends LensProps<S, D[], C> {
  id: string;
  order: (keyof D)[];
  mode: PageMode;
  // copySelectedIndexTo: LensState<S, D, C>;
  copySelectedItemTo: LensState<S, D, C>;
  copySelectedIndexTo?: LensState<S, number, C>;
}

const noData = <td>No data</td>;

interface LabelAndFixedNumberProps {
  id: string
  label: string;
  number: string;
}
function LabelAndFixedNumber ( { id, label, number }: LabelAndFixedNumberProps ) {
  return <div className='labelValueButton'><label className='input-label'>{label}</label><input className='input' readOnly type='number' value={number}/></div>
}
export function AuthoriseTable<S, D extends AuthoriseTableData, C extends FocusOnContext<S>> ( props: AuthoriseTableProps<S, D, C> ) {
  const { state, order, id, mode, copySelectedItemTo, copySelectedIndexTo } = props
  const onClick = ( i: number, row: D ) => ( e: any ) => {
    if ( copySelectedIndexTo || copySelectedItemTo ) {
      const txs = transformsForUpdateSelected ( copySelectedIndexTo, copySelectedItemTo ) ( i, row )
      state.massTransform ( reasonFor ( 'Table', 'onClick', id, `selected row ${i}` ) ) ( ...txs )
    }
  }
  function stateFor ( k: keyof D ): LensState<S, any, C> {return copySelectedItemTo.focusOn ( k );}
  const AuthTable = rawTable ( onClick )
  return <Layout details='[[1],[1,1],[1,1,1]]'>
    <AuthTable{...props} />
    <LabelAndStringInput id={`${id}.approvedBy`} label='Approved By' state={stateFor ( 'approvedBy' )} mode='view' allButtons={{}}/>
    <LabelAndStringInput id={`${id}.authorisedBy`} label='Authorised By' state={stateFor ( 'authorisedBy' )} mode='view' allButtons={{}}/>
    <LabelAndFixedNumber id={`${id}.totalCredits`} label='Total Credits' number={'0.00'}/>
    <LabelAndFixedNumber id={`${id}.totalDebuts`} label='Total Debits' number={'0.00'}/>
    <LabelAndFixedNumber id={`${id}.waste`} label='Waste' number={'0.00'}/>
  </Layout>

}
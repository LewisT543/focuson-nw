import { LensState } from "@focuson/state";
import { HasPageSelectionLens, page, PageMode, refFromFirstPage } from "../pageSelection";
import { Lenses, Transform } from "@focuson/lens";
import { RestCommand } from "@focuson/rest";
import { safeArray } from "@focuson/utils";


export interface ModalButtonProps<S, Context> {
  id?: string,
  text: string,
  modal: string,
  state: LensState<S, any, Context>
  focusOn: string[],
  pageMode: PageMode,

  rest?: RestCommand,
  createEmpty?: any
  copyFrom?: string[],
  copyOnClose?: string[],
}


export function ModalButton<S extends any, Context extends HasPageSelectionLens<S>> ( props: ModalButtonProps<S, Context> ): JSX.Element {
  const { id, text } = props
  let onClick = () => {
    const { state, copyFrom, modal, pageMode, rest, focusOn, copyOnClose, createEmpty } = props
    const lookup = ( name: string ) => refFromFirstPage ( state.context.pageSelectionL ) ( name ).getOption ( state.main );
    const fromPath = Lenses.fromPathWith ( lookup )
    const focusOnL = state.optional.chain ( fromPath ( focusOn ) );
    const copyFromL = state.optional.chain ( fromPath ( safeArray ( copyFrom ) ) );
    const copyTx: Transform<S, any>[] = copyFrom ? [ [ focusOnL, ignore => copyFromL.getOption ( state.main ) ] ] : [];
    const emptyTx: Transform<S, any>[] = createEmpty ? [ [ focusOnL, ignore => createEmpty ] ] : [];
    state.massTransform (
      page<S, Context> ( state.context, 'popup', { pageName: modal, firstTime: true, pageMode, rest, focusOn: focusOn, copyOnClose } ),
      ...emptyTx,
      ...copyTx );
  };
  return <button id={id} onClick={onClick}>{text}</button>
}
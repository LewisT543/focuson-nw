import { LensState, reasonFor } from "@focuson-nw/state";
import { NameAnd, SimpleMessage } from "@focuson-nw/utils";
import {  PageSelection, wrapWithErrors } from "@focuson-nw/pages";
import { CommandButtonChangeCommands, commandButtonCommandProcessors, InputProcessorsConfig, processChangeCommandProcessor } from "@focuson-nw/rest";
import { Transform } from "@focuson-nw/lens";
import { FocusOnContext,makeInputProcessorsConfig } from "@focuson-nw/focuson";
import { CustomButtonType, getButtonClassName } from "./common";

export interface ActionButtonProps<S, C> extends CustomButtonType {
  id: string;
  state: LensState<S, any, C>;
  paths: NameAnd<( s: LensState<S, any, C> ) => LensState<S, any, C>>
  action: ( s: LensState<S, any, C>, id: string, paths?: NameAnd<LensState<S, any, C>>, history?: any ) => Transform<S, any>[];
  text: string;
  history?: any;
  enabledBy?: string[][];
  preCommands: CommandButtonChangeCommands[]
  postCommands: CommandButtonChangeCommands[]
}

export function ActionButton<S, C extends FocusOnContext<S>> ( { id, state, action, text, enabledBy, paths, preCommands, postCommands, buttonType, history }: ActionButtonProps<S, C> ) {
  const pathsAsLens = Object.fromEntries ( Object.entries ( paths ).map ( ( [ name, fn ] ) => [ name, fn ( state ) ] ) )
  function onClick ( e: any ) {
    const errorPrefix = `Action button ${id}`
    const config: InputProcessorsConfig<S, SimpleMessage, PageSelection, C> = makeInputProcessorsConfig ( state.main, state.context )
    const processor = commandButtonCommandProcessors ( config ) ( state.main )
    const pre: Transform<S, any>[] = processChangeCommandProcessor ( errorPrefix, processor, preCommands )
    const actions: Transform<S, any>[] = action ( state, id, pathsAsLens, history )
    const post: Transform<S, any>[] = processChangeCommandProcessor ( errorPrefix, processor, postCommands )
    const txs: Transform<S, any>[] = [ ...pre, ...actions, ...post ]
    state.massTransform ( reasonFor ( 'ActionButton', 'onClick', id ) ) ( ...txs )
  }
  return wrapWithErrors ( id, enabledBy, [], ( errorProps, error ) =>
    <button id={id} onClick={onClick} {...errorProps} className={getButtonClassName ( buttonType )} disabled={error}>{text}</button> )
}
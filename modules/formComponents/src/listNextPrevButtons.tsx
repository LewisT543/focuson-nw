import { LensState, reasonFor } from "@focuson-nw/state";
import { disabledFrom, or, safeArray, useOrDefault } from "@focuson-nw/utils";
import { CustomButtonType, getButtonClassName } from "./common";
import { wrapWithErrors } from "@focuson-nw/pages";

export interface ListButtonProps<S, C> extends CustomButtonType {
  id: string;
  title: string;
  enabledBy?: string[][];
  value: LensState<S, number, C>;
  list: LensState<S, any[], C>;
}
export function ListNextButton<S, C> ( { id, title, value, list, enabledBy, buttonType }: ListButtonProps<S, C> ) {
  const index = value.optJson ()
  const i = index ? index : 0
  const listSize = safeArray ( list.optJson () ).length
  const noNextItemCondition: [ boolean, string ] = [ index === undefined || index >= listSize - 1, 'There is no next item' ]
  return wrapWithErrors ( id, enabledBy, [ noNextItemCondition ], ( errorProps, error ) =>
    <button id={id}  {...errorProps} disabled={error}
            onClick={() => value.setJson ( i + 1,
              reasonFor ( 'ListNextButton', 'onClick', id ) )} className={getButtonClassName ( buttonType )}>{title} </button> )
}

export function ListPrevButton<S, C> ( { id, title, value, enabledBy, buttonType }: ListButtonProps<S, C> ) {
  const index = value.optJson ()
  const i = index ? index : 0
  const noPrevItemCondition: [ boolean, string ] = [ index === undefined || index <= 0, 'There is no previous item' ]
  return wrapWithErrors ( id, enabledBy, [ noPrevItemCondition ], ( errorProps, error ) =>
    <button id={id}{...errorProps} disabled={error} onClick={() => value.setJson ( i - 1, reasonFor ( 'ListPrevButton', 'onClick', id ) )} className={getButtonClassName ( buttonType )}>{title}</button> )
}
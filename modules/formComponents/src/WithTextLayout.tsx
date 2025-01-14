import { LensState } from "@focuson-nw/state";
import { FocusOnContext } from "@focuson-nw/focuson";
import { replaceTextUsingPath } from "@focuson-nw/pages";


export interface WithTextLayoutProps<S, C> {
  state: LensState<S, any, C>
  children: JSX.Element | JSX.Element[]
  text: string;
  holderClassName?: string
  textClassName?: string
  childrenClassName?: string
}
export function WithTextLayout<S, C extends FocusOnContext<S>> ( { children, text, holderClassName, textClassName, childrenClassName, state }: WithTextLayoutProps<S, C> ) {
  return <div className={holderClassName}>
    <div className={textClassName} dangerouslySetInnerHTML={{ __html: replaceTextUsingPath ( state, text ) }}/>
    <div className={childrenClassName}>{children}</div>
  </div>
}
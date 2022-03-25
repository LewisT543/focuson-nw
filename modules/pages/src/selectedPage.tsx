import { LensProps, LensState } from "@focuson/state";

import { currentPageSelection, HasPageSelectionLens, mainPage, PageMode, PageSelection, PageSelectionContext } from "./pageSelection";
import { FocusedPage } from "./focusedPage";
import { isMainPageDetails, OnePageDetails, PageConfig } from "./pageConfig";
import { DefaultTemplate, PageTemplateProps } from "./PageTemplate";
import { Loading } from "./loading";
import { Lenses, NameAndLens, Optional } from "@focuson/lens";

export interface HasSelectedPageDebug {
  debug?: SelectedPageDebug
}
export interface SelectedPageDebug {
  selectedPageDebug?: boolean
}

export function SelectedPage<S, Context extends PageSelectionContext<S>> ( { state }: LensProps<S, any, Context> ) {
  let combine = state.context.combine;
  let pages: PageDetailsForCombine[] = findSelectedPageDetails ( state );
  return combine ? combine ( state, pages ) : <div>{pages}</div>
}

export interface PageDetailsForCombine {
  pageType?: string;
  element: JSX.Element;
}

function findSelectedPageDetails<S, Context extends PageSelectionContext<S>> ( state: LensState<S, any, Context> ): PageDetailsForCombine[] {
  // @ts-ignore
  const debug = state.main?.debug?.selectedPageDebug  //basically if S extends SelectedPageDebug..
  let selectedPageData: PageSelection[] = currentPageSelection ( state );
  if ( debug ) console.log ( 'findSelectedPageDetails', selectedPageData )
  return selectedPageData.map ( findOneSelectedPageDetails ( state ) )
}

export function fullState<S, T, C> ( ls: LensState<S, T, C> ): LensState<S, S, C> {
  return ls.copyWithLens ( Lenses.identity () )
}
export const pageState = <S, T, C extends HasPageSelectionLens<S>> ( ls: LensState<S, T, C> ) => <D extends any> (): LensState<S, D, C> => {
  let ps = mainPage ( ls )
  if ( !ps ) throw new Error ( 'no selected page' )
  // @ts-ignore
  let newState: LensState<S, any, C> = fullState ( ls ).focusOn ( ps.pageName );
  return newState
};

export const prefixToLensFromRoot: NameAndLens<any> = { "/": Lenses.identity () };
export const prefixToLensFromBasePath: NameAndLens<any> = { "~/": Lenses.identity () };

export function lensForPageDetails<S, D, Msgs, Config extends PageConfig<S, D, Msgs, Context>, Context extends PageSelectionContext<S>> ( page: OnePageDetails<S, D, Msgs, Config, Context>, base?: string ): Optional<S, any> {
  return isMainPageDetails ( page ) ? page.lens : Lenses.fromPathStringFor<S, D> ( prefixToLensFromBasePath ) ( base )
}
export const findOneSelectedPageDetails = <S, Context extends PageSelectionContext<S>> ( state: LensState<S, any, Context> ) => ( ps: PageSelection ): PageDetailsForCombine => {
  // @ts-ignore
  const debug = state.main?.debug?.selectedPageDebug  //basically if S extends SelectedPageDebug..
  const pages = state.context.pages
  const { pageName, pageMode, focusOn } = ps
  const page = pages[ pageName ]
  if ( !page ) throw Error ( `Cannot find page with name ${pageName}, legal Values are [${Object.keys ( pages ).join ( "," )}]` )
  const { config, pageFunction, pageType } = page

  const lsForPage = state.copyWithLens ( lensForPageDetails ( page, focusOn ) )

  if ( debug ) console.log ( "findOneSelectedPageDetails.pageFunction", pageFunction )
  if ( typeof pageFunction === 'function' ) {// this is for legacy support
    if ( debug ) console.log ( "findOneSelectedPageDetails.legacy display" )
    let element = pageFunction ( { state: lsForPage } );
    if ( debug ) console.log ( "findOneSelectedPageDetails.legacy result", element )
    if ( debug ) console.log ( "findOneSelectedPageDetails.legacy result - json", JSON.stringify ( element ) )
    return { element, pageType }
  } else return displayOne ( config, pageType, pageFunction, lsForPage, pageMode );
};


/** Given a config.ts, a focused page data structure and a lens state (focused on anything...doesn't matter) this will display a page */
export function displayOne<S extends any, D extends any, Msgs, Context> (
  config: PageConfig<S, D, Msgs, Context>,
  pageType: string | undefined,
  focusedPage: FocusedPage<S, D, Context>,
  s: LensState<S, D, Context>, pageMode: PageMode ): PageDetailsForCombine {
  // @ts-ignore
  const debug = s.main?.debug?.selectedPageDebug  //basically if S extends SelectedPageDebug..
  let t = config.template
  const template: ( p: PageTemplateProps<S, D, Context> ) => JSX.Element = t ? t : DefaultTemplate
  if ( debug ) console.log ( "displayMain.template 1", template )
  const loading = config.loading ? config.loading : Loading
  if ( debug ) console.log ( "displayMain.loading 2", loading )
  const element = template ( { state: s, focusedPage, loading, pageMode } )
  if ( debug ) console.log ( "displayMain.element 3", element );
  return { element, pageType }
}


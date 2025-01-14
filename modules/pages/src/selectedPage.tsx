import { LensProps, LensState } from "@focuson-nw/state";

import { currentPageSelection, HasPageSelectionLens, mainPage, mainPageFrom, PageParams, PageSelection, PageSelectionContext } from "./pageSelection";
import { FocusedPage } from "./focusedPage";
import { isArbitraryPageDetails, isMainPageDetails, isModalPageDetails, MainPageDetails, MultiPageDetails, OnePageDetails, PageConfig } from "./pageConfig";
import { DefaultTemplate, PageTemplateProps } from "./PageTemplate";
import { Loading } from "./loading";
import { lensBuilder, Lenses, NameAndLens, Optional, parsePath } from "@focuson-nw/lens";
import { PageMode, safeArray, safeObject, safeString } from "@focuson-nw/utils";
import { ModalContext } from "./modal/modalCommitAndCancelButton";

export interface HasSelectedPageDebug {
  debug?: SelectedPageDebug
}
export interface SelectedPageDebug {
  selectedPageDebug?: boolean
}

export function SelectedPage<S, Context extends PageSelectionContext<S>> ( { state }: LensProps<S, any, Context> ): JSX.Element {
  let combine: ( state: LensState<S, any, any>, pages: PageDetailsForCombine[] ) => JSX.Element = state.context.combine;
  let pages: PageDetailsForCombine[] = findSelectedPageDetails ( state );
  return combine ? combine ( state, pages ) : <div key={0}>Need to define combine<br/>{JSON.stringify ( pages )}</div>
}

export interface PageDetailsForCombine {
  pageType?: string;
  element: JSX.Element;
  pageParams?: PageParams;
  pageDisplayedTime: string;
  state: LensState<any, any, any>
  shouldModalPageCloseOnClickAway: boolean
}

function findSelectedPageDetails<S, Context extends PageSelectionContext<S>> ( state: LensState<S, any, Context> ): PageDetailsForCombine[] {
  // @ts-ignore
  const debug = state.main?.debug?.selectedPageDebug  //basically if S extends SelectedPageDebug..
  try {
    let selectedPageData: PageSelection[] = currentPageSelection ( state );
    if ( debug ) console.log ( 'findSelectedPageDetails - for Combine', selectedPageData )
    let results = selectedPageData.map ( findOneSelectedPageDetails ( state, findMainPageDetails ( selectedPageData, state.context.pages ), selectedPageData.length ) );
    // results.forEach((p, i) =>p.element.key=i)
    return results
  } catch ( e: any ) {
    console.log ( `Error in findSelectedPageDetails`, state.main )
    console.log ( 'stack', e.stack )
    throw e
  }
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


export function lensForPageDetails<S, D, Msgs, Config extends PageConfig<S, D, Msgs, Context>, Context extends PageSelectionContext<S>> ( mainPageD: MainPageDetails<S, D, Msgs, Config, Context>,
                                                                                                                                          currentPageD: OnePageDetails<S, D, Msgs, Config, Context>, base?: string ): Optional<S, any> {
  if ( isMainPageDetails ( currentPageD ) ) return currentPageD.lens
  return parsePath<Optional<S, any>> ( safeString ( base ), lensBuilder<S> ( {
    '/': Lenses.identity (),
    '~': mainPageD.lens,
  }, safeObject ( mainPageD.namedOptionals ) ) )
}
export const fromPathFromRaw = <S, D, Msgs, Config extends PageConfig<S, D, Msgs, Context>, Context extends PageSelectionContext<S>>
( pageSelectionL: Optional<S, PageSelection[]>, pageDetails: MultiPageDetails<S, any> ) => ( s: S, currentLens?: Optional<S, any> ) => {
  let selectedPageData: PageSelection[] = safeArray ( pageSelectionL.getOption ( s ) );
  if ( selectedPageData === undefined ) throw Error ( `Calling lensForPageDetailsFromRaw without a selected page\n ${JSON.stringify ( s )}` )
  const mainPageD: MainPageDetails<S, D, Msgs, Config, Context> = findMainPageDetails ( selectedPageData, pageDetails )
  let prefixes: NameAndLens<S> = {
    '/': Lenses.identity (),
    '~': mainPageD.lens,
  };
  if ( currentLens ) prefixes[ '' ] = currentLens
  const builder = lensBuilder<S> ( prefixes, safeObject ( mainPageD.namedOptionals ) )
  return ( path: string ): Optional<S, any> => parsePath ( path, builder )
};


export const findOneSelectedPageDetails = <S, T, Context extends ModalContext<S>> ( state: LensState<S, T, Context>, page0Details: MainPageDetails<S, any, any, any, Context>, pageCount: number ) =>
  ( ps: PageSelection, index: number ): PageDetailsForCombine => {
    // @ts-ignore
    const debug = state.main?.debug?.selectedPageDebug  //basically if S extends SelectedPageDebug..
    const pages = state.context.pages
    const { pageName, pageMode, focusOn, arbitraryParams } = ps
    const page: OnePageDetails<S, any, any, any, Context> = pages[ pageName ]
    if ( !page ) throw Error ( `Cannot find page with name ${pageName}, legal Values are [${Object.keys ( pages ).join ( "," )}]\nIs this a modal page and you need to add it to the main page?` )


    const { config, pageType } = page
    const lsForPage = state.copyWithLens ( lensForPageDetails ( page0Details, page, focusOn ) )
    const shouldModalPageCloseOnClickAway: boolean = isModalPageDetails ( page ) ? page.shouldModalPageCloseOnClickAway : false
    if ( isArbitraryPageDetails ( page ) ) {
      if ( !arbitraryParams ) throw Error ( `Trying to display arbritrary page but don't have params on the page select\n${JSON.stringify ( ps )}` )
      const element = page.pageFunction ( lsForPage, arbitraryParams );
      const shouldModalPageCloseOnClickAway: boolean = ps.arbitraryParams?.shouldModalPageCloseOnClickAway === true
      console.log('findOneSelectedPageDetails - shouldModalPageCloseOnClickAway', shouldModalPageCloseOnClickAway )
      return { element, pageType, pageDisplayedTime: ps.time, state, shouldModalPageCloseOnClickAway };
    }
    const pageFunction = page.pageFunction
    if ( debug ) console.log ( "findOneSelectedPageDetails.pageFunction", pageFunction )
    if ( typeof pageFunction === 'function' ) {// this is for legacy support
      if ( debug ) console.log ( "findOneSelectedPageDetails.legacy display" )
      let element = pageFunction ( { state: lsForPage } );
      if ( debug ) console.log ( "findOneSelectedPageDetails.legacy result", element )
      if ( debug ) console.log ( "findOneSelectedPageDetails.legacy result - json", JSON.stringify ( element ) )
      return { element, pageType, pageDisplayedTime: ps.time, state, shouldModalPageCloseOnClickAway }
    } else return displayOne ( config, pageType, pageFunction, ps.pageParams, ps.time, shouldModalPageCloseOnClickAway, lsForPage, pageMode, pageCount - index );
  }
;

export function findMainPageDetails<S> ( pageSelections: PageSelection[], pageDetails: MultiPageDetails<S, any> ): MainPageDetails<S, any, any, any, any> {
  const firstPage: PageSelection = mainPageFrom ( pageSelections )
  let page0Details: any = pageDetails[ firstPage.pageName ];
  if ( !isMainPageDetails<S, any, any, any, any> ( page0Details ) ) throw Error ( `Software error:  page ${firstPage.pageName} is not a main page.\nPageSelections: ${JSON.stringify ( pageSelections )}\n\nfirstPage: ${JSON.stringify ( firstPage )}\nPage details${page0Details}` )
  return page0Details
}

/** Given a config.ts, a focused page data structure and a lens state (focused on anything...doesn't matter) this will display a page */
export function displayOne<S extends any, D extends any, Msgs, Context extends ModalContext<S>> (
  config: PageConfig<S, D, Msgs, Context>,
  pageType: string | undefined,
  focusedPage: FocusedPage<S, D, Context>,
  pageParams: PageParams | undefined,
  pageDisplayedTime: string,
  shouldModalPageCloseOnClickAway: boolean,
  state: LensState<S, D, Context>, pageMode: PageMode, index: number ): PageDetailsForCombine {
  // @ts-ignore
  const debug = state.main?.debug?.selectedPageDebug  //basically if S extends SelectedPageDebug..
  let t = config.template
  const template: ( p: PageTemplateProps<S, D, Context> ) => JSX.Element = t ? t : DefaultTemplate
  if ( debug ) console.log ( "displayMain.template 1", template )
  const loading = config.loading ? config.loading : Loading
  if ( debug ) console.log ( "displayMain.loading 2", loading )
  const element = template ( { state: state, focusedPage, loading, pageMode, index } )
  if ( debug ) console.log ( "displayMain.element 3", element );
  return { element, pageType, pageParams, pageDisplayedTime, state, shouldModalPageCloseOnClickAway }
}


import { focusPageClassName, HasPageSelection, lensForPageDetails, MultiPageDetails, PageSelection, PageSelectionContext, pageSelectionlens, preMutateForPages } from "@focuson/pages";
import { HasPostCommand, HasPostCommandLens, PostCommand } from "@focuson/poster";
import { Fetcher, FetcherTree, LoadInfo, loadTree, WouldLoad, wouldLoad, wouldLoadSummary } from "@focuson/fetcher";
import { lensState, LensState } from "@focuson/state";
import { Lens, Lenses, massTransform, Optional, Transform } from "@focuson/lens";
import { FetchFn, safeArray } from "@focuson/utils";
import { HasRestCommandL, HasRestCommands, rest, RestCommand, RestDetails } from "@focuson/rest";



export function defaultCombine ( pages: JSX.Element[] ) {
  return <div className='combine'>{pages.map ( ( p, i ) => <div className={focusPageClassName}  key={i}>{p}</div> )}</div>
}
export function defaultPageSelectionContext<S extends HasPageSelection, Context extends PageSelectionContext<S>> ( pageDetails: MultiPageDetails<S, Context> ): PageSelectionContext<S> {
  return {
    pages: pageDetails,
    combine: defaultCombine,
    pageSelectionL: pageSelectionlens<S> ()
  }
}

export interface PageSelectionAndPostCommandsContext<S> extends PageSelectionContext<S>, HasPostCommandLens<S, any> {
}
export function defaultPageSelectionAndPostCommandsContext<S extends HasPageSelection & HasPostCommand<S, any>> ( pageDetails: MultiPageDetails<S, PageSelectionAndPostCommandsContext<S>> ): PageSelectionAndPostCommandsContext<S> {
  return {
    ...defaultPageSelectionContext<S, PageSelectionAndPostCommandsContext<S>> ( pageDetails ),
    postCommandsL: Lenses.identity<S> ().focusOn ( 'postCommands' )
  }
}
export interface PageSelectionAndRestCommandsContext<S> extends PageSelectionContext<S>, HasRestCommandL<S> {
}
export function defaultPageSelectionAndRestCommandsContext<S extends HasPageSelection & HasRestCommands> ( pageDetails: MultiPageDetails<S, PageSelectionAndRestCommandsContext<S>> ): PageSelectionAndRestCommandsContext<S> {
  return {
    ...defaultPageSelectionContext<S, PageSelectionAndRestCommandsContext<S>> ( pageDetails ),
    restL: Lenses.identity<S> ().focusOn ( 'restCommands' )
  }
}


export interface FocusOnConfig<S, Context, MSGs> {
  /** How data is sent to/fetched from apis */
  fetchFn: FetchFn,
  /** A hook that is called before anything else.  */
  preMutate: ( s: S ) => S,
  /** A hook that is called after everything else.  */
  postMutate: ( s: S ) => Promise<S>,
  /** A last ditch error handler  */
  onError: ( s: S, e: any ) => S,

  /** The lens to the current selected page */
  pageL: Lens<S, PageSelection[]>,
  /** The list of all registered pages that can be displayed with SelectedPage  */
  pages: MultiPageDetails<S, Context>,

  messageL: Optional<S, MSGs[]>;


  /** The lens to the list of PostCommands*/
  restL: Optional<S, RestCommand[]>,
  /** The list of all registered posters that can send data to the back end   */
  restDetails: RestDetails<S, MSGs>,

  /** The collection of all registered fetchers that will get data from the back end */
  fetchers: FetcherTree<S>,
}

export function traceL<S> () {
  return Lenses.fromPath<S, string[]> ( [ 'trace' ] );
}

export function setJsonForFocusOn<S, Context extends PageSelectionContext<S>, MSGs> ( config: FocusOnConfig<S, Context, MSGs>, context: Context, publish: ( lc: LensState<S, S, Context> ) => void ): ( s: S, reason: any ) => Promise<S> {
  return async ( main: S, reason: any ): Promise<S> => {
    console.log ( 'setJsonForFocusOn', reason )
    // @ts-ignore
    const debug = main.debug;
    const withDebug = debug ? traceL<S> ().transform ( old => [ ...old ? old : [], reason ] ) ( main ) : main
    const { fetchFn, preMutate, postMutate, onError, pages, restDetails, fetchers, restL, pageL, messageL } = config
    const newStateFn = ( fs: S ) => publish ( lensState ( fs, setJsonForFocusOn ( config, context, publish ), 'setJson', context ) )
    try {
      if ( debug?.fetcherDebug ) console.log ( 'setJsonForFetchers - start', main )
      if ( debug?.fetcherDebug ) console.log ( 'setJsonForFetchers - withDebug', withDebug )
      const withPreMutate = preMutate ( withDebug )
      const firstPageProcesses: S = preMutateForPages<S, Context> ( context ) ( withPreMutate )
      if ( debug?.fetcherDebug ) console.log ( 'setJsonForFetchers - after premutate', firstPageProcesses )
      const afterRest = await rest ( fetchFn, restDetails, messageL, restL, firstPageProcesses )
      if ( debug?.fetcherDebug || debug?.postDebug ) console.log ( 'setJsonForFetchers - afterRest', afterRest )
      if ( afterRest ) newStateFn ( afterRest )
      if ( debug?.fetcherDebug || debug?.postDebug ) console.log ( 'setJsonForFetchers - newStateFn', afterRest )
      if ( debug?.whatLoad ) {
        let w = wouldLoad ( fetchers, afterRest );
        console.log ( "wouldLoad", wouldLoadSummary ( w ), w )
      }
      let newMain = await loadTree ( fetchers, afterRest, fetchFn, debug )
        .then ( s => s ? s : onError ( s, Error ( 'could not load tree' ) ) )
        .catch ( e => onError ( afterRest, e ) )
      if ( debug?.fetcherDebug ) console.log ( 'setJsonForFetchers - after load', newMain )
      let finalState = await postMutate ( newMain )
      if ( debug?.fetcherDebug ) console.log ( 'setJsonForFetchers - final', finalState )
      newStateFn ( finalState )
      return finalState
    } catch ( e ) {
      console.error ( "An unexpected error occured. Rolling back the state", e )
      let newMain = onError ( main, e );
      newStateFn ( newMain )
      return newMain
    }
  }
}


import { AllModalPageDetails, MultiPageDetails, PageSelection } from "@focuson/pages";
import { post, PostCommand, Posters } from "@focuson/poster";
import { FetcherTree, loadTree, wouldLoad, wouldLoadSummary } from "@focuson/fetcher";
import { lensState, LensState } from "@focuson/state";
import { Lens, Optional } from "@focuson/lens";
import { FetchFn } from "@focuson/utils";


export interface FocusOnConfig<S, Context> {
  /** How data is sent to/fetched from apis */
  fetchFn: FetchFn,
  /** A hook that is called before anything else.  */
  preMutate: ( s: S ) => S,
  /** A hook that is called after everything else.  */
  postMutate: ( s: S ) => Promise<S>,
  /** A last ditch error handler  */
  onError: ( s: S, e: any ) => S,

  /** The lens to the current selected page */
  pageL: Lens<S, PageSelection>,
  /** The list of all registered pages that can be displayed with SelectedPage  */
  pages: MultiPageDetails<S, any, Context>,

  /** The lens to the currently selected modal page*/
  modalL: Optional<S, string | undefined>
  /** The list of all registered modal pages   */
  modals: AllModalPageDetails<S, any, Context>,

  /** The lens to the list of PostCommands*/
  postL: Optional<S, PostCommand<S, any, any>[]>,
  /** The list of all registered posters that can send data to the back end   */
  posters: Posters<S>,

  /** The collection of all registered fetchers that will get data from the back end */
  fetchers: FetcherTree<S>,
}

function processStartOfPage<S, P extends MultiPageDetails<S, any, Context>, Context> ( state: S, pageL: Lens<S, PageSelection>, pageDetails: P ) {
  // @ts-ignore
  const debug = state.debug?.startOfDebug;
  const { pageName, firstTime } = pageL.get ( state )
  if ( debug ) console.log ( 'processStartOfPage-firstTime', pageName, firstTime )
  const details = pageDetails[ pageName ];
  if ( details && firstTime ) {
    if ( details.clearAtStart )
      return pageL.focusOn ( 'firstTime' ).combine ( details.lens ).set ( state, [ false, undefined ] );
    if ( details.initialValue )
      return pageL.focusOn ( 'firstTime' ).combine ( details.lens ).set ( state, [ false, details.initialValue ] );
    return pageL.focusOn ( 'firstTime' ).set ( state, false );
  } else return state;
}

export function setJsonForFocusOn<C extends FocusOnConfig<S, Context>, S, Context> ( config: C, context: Context, publish: ( lc: LensState<S, S, Context> ) => void ): ( s: S ) => Promise<S> {
  return async ( main: S ): Promise<S> => {
    // @ts-ignore
    const debug = main.debug;
    const { fetchFn, preMutate, postMutate, onError, pages, posters, fetchers, postL, pageL } = config
    const newStateFn = ( fs: S ) => publish ( lensState ( fs, setJsonForFocusOn ( config, context, publish ), 'setJson', context ) )
    try {
      if ( debug?.fetcherDebug ) console.log ( 'setJsonForFetchers - start', main )
      const withPreMutate = preMutate ( main )
      const firstPageProcesses = processStartOfPage ( withPreMutate, pageL, pages )
      if ( debug?.fetcherDebug ) console.log ( 'setJsonForFetchers - after premutate', firstPageProcesses )
      const afterPost = await post ( fetchFn, posters, postL ) ( firstPageProcesses )
      if ( debug?.fetcherDebug || debug?.postDebug ) console.log ( 'setJsonForFetchers - after post', afterPost )
      if ( afterPost ) newStateFn ( afterPost )
      if ( debug?.fetcherDebug || debug?.postDebug ) console.log ( 'setJsonForFetchers - newStateFn', afterPost )
      if ( debug?.whatLoad ) {
        let w = wouldLoad ( fetchers, afterPost );
        console.log ( "wouldLoad", wouldLoadSummary ( w ), w )
      }
      let newMain = await loadTree ( fetchers, afterPost, fetchFn, debug )
        .then ( s => s ? s : onError ( s, Error ( 'could not load tree' ) ) )
        .catch ( e => onError ( afterPost, e ) )
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


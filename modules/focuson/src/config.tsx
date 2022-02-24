import { HasPageSelection, MultiPageDetails, PageSelection, PageSelectionContext, pageSelectionlens, preMutateForPages } from "@focuson/pages";
import { HasPostCommand, HasPostCommandLens, post, PostCommand, postCommandsL, Posters } from "@focuson/poster";
import { FetcherTree, loadTree, wouldLoad, wouldLoadSummary } from "@focuson/fetcher";
import { lensState, LensState } from "@focuson/state";
import { Lens, Lenses, Optional } from "@focuson/lens";
import { FetchFn, HasSimpleMessages } from "@focuson/utils";
import { HasTagHolder } from "@focuson/template";


export function defaultCombine ( pages: JSX.Element[] ) {
  return <div id='combine'>{pages.map ( ( p, i ) => <div key={i}>{p}</div> )}</div>
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
export function defaultPageSelectionAndPostCommandsContext<S extends HasPageSelection & HasPostCommand<S, any> > ( pageDetails: MultiPageDetails<S, PageSelectionAndPostCommandsContext<S>> ): PageSelectionAndPostCommandsContext<S> {
  return {
    ...defaultPageSelectionContext<S, PageSelectionAndPostCommandsContext<S>> ( pageDetails ),
    postCommandsL: Lenses.identity<S> ().focusOn ( 'postCommands' )
  }
}


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
  pageL: Lens<S, PageSelection[]>,
  /** The list of all registered pages that can be displayed with SelectedPage  */
  pages: MultiPageDetails<S, Context>,


  /** The lens to the list of PostCommands*/
  postL: Optional<S, PostCommand<S, any, any>[]>,
  /** The list of all registered posters that can send data to the back end   */
  posters: Posters<S>,

  /** The collection of all registered fetchers that will get data from the back end */
  fetchers: FetcherTree<S>,
}


export function setJsonForFocusOn<C extends FocusOnConfig<S, Context>, S, Context extends PageSelectionContext<S>> ( config: C, context: Context, publish: ( lc: LensState<S, S, Context> ) => void ): ( s: S ) => Promise<S> {
  return async ( main: S ): Promise<S> => {
    // @ts-ignore
    const debug = main.debug;
    const { fetchFn, preMutate, postMutate, onError, pages, posters, fetchers, postL, pageL } = config
    const newStateFn = ( fs: S ) => publish ( lensState ( fs, setJsonForFocusOn ( config, context, publish ), 'setJson', context ) )
    try {
      if ( debug?.fetcherDebug ) console.log ( 'setJsonForFetchers - start', main )
      const withPreMutate = preMutate ( main )
      const firstPageProcesses: S = preMutateForPages<S, Context> ( context ) ( withPreMutate )
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


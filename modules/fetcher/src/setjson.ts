import {FetchFn} from "./fetchers";
import {FetcherTree, loadTree, WouldLoad, wouldLoad} from "./fetcherTree";
import {LensState, lensState} from "@focuson/state";
import {Optional} from "@focuson/lens";

export interface FetcherDebug {
    fetcherDebug?: boolean,
    loadTreeDebug?: boolean,
    whatLoad?: boolean
}
export function wouldLoadSummary(wouldLoad: WouldLoad[]) {
    return wouldLoad.filter(w => w.load).map(w => `${w.fetcher.description} ${JSON.stringify(w.reqData)}`).join(", ")
}

export function setJsonForFetchers<State, Element>(fetchFn: FetchFn,
                                            tree: FetcherTree<State>,
                                            description: string,
                                            onError: (os: State, e: any) => State,
                                            fn: (lc: LensState<State, State>) => void,
                                            mutate: (s: State) => Promise<State>,
                                            debugOptional?: Optional<State, FetcherDebug>): (os: State, s: State) => Promise<State> {
    return async (os: State, main: State): Promise<State> => {
        const debug = debugOptional?.getOption(main)
        let newStateFn = (fs: State) => fn(lensState(fs, state => setJsonForFetchers(fetchFn, tree, description, onError, fn, mutate, debugOptional)(fs,state), description))
        try {
            if (debug?.fetcherDebug) console.log('setJsonForFetchers - start', main)
            if (main) newStateFn(main)
            if (debug?.whatLoad) {
                let w = wouldLoad(tree, main);
                console.log("wouldLoad", wouldLoadSummary(w), w)
            }
            let newMain = await loadTree(tree, main, fetchFn, debug).//
                then(s => s ? s : onError(s, Error('could not load tree'))).//
                catch(e => onError(main, e))
            if (debug?.fetcherDebug) console.log('setJsonForFetchers - after load', newMain)
            let finalState = await mutate(newMain)
            if (debug?.fetcherDebug) console.log('setJsonForFetchers - final', finalState)
            newStateFn(finalState)
            return finalState
        } catch (e) {
            console.error("An unexpected error occured. Rolling back the state",e)
            let newMain = onError(os, e);
            newStateFn(newMain)
            return newMain
        }
    }
}
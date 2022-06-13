import { reqFor, Tags, UrlConfig } from "@focuson/template";
import { beforeAfterSeparator, FetchFn, isRestStateChange, NameAnd, RestAction, RestStateChange, resultOrErrorString, safeArray, safeObject, safeString, sortedEntries, toArray } from "@focuson/utils";
import { identityOptics, massTransform, Optional, Transform } from "@focuson/lens";


export interface RestDebug {
  restDebug?: boolean
}

export type QueryOrMutation = 'Query' | 'Mutation'

export interface RestParamsDetails {
  needsId?: boolean,
  needsObj?: boolean
}

export interface RestOutputDetails {
  needsBrackets?: boolean,
  needsObj?: boolean,
  needsPling?: boolean,
}
export interface RestActionDetail {
  /** get, update, insert... */
  name: RestAction | 'state',
  method: string,
  query: QueryOrMutation,
  params: RestParamsDetails,
  output: RestOutputDetails,
  graphQPrefix: string,
  graphQlPostfix: string
}
export interface RestTypeDetails {
  [ name: string ]: RestActionDetail
}

export const defaultRestAction: RestTypeDetails = {
  'get': { name: 'get', method: 'GET', query: 'Query', params: { needsId: true }, output: { needsObj: true, needsPling: true }, graphQPrefix: 'get', graphQlPostfix: '' },
  // 'getString': { name: 'getString', query: 'Query', params: { needsId: true }, output: { needsPling: true }, graphQPrefix: 'get', graphQlPostfix: '' }, //special for mocks
  'getOption': { name: 'getOption', method: 'GET', query: 'Query', params: { needsId: true }, output: { needsObj: true }, graphQPrefix: 'getOption', graphQlPostfix: '' },
  // 'list': { name: 'list', method: 'GET', query: 'Query', params: {}, output: { needsObj: true, needsBrackets: true, needsPling: true }, graphQPrefix: 'list', graphQlPostfix: '' },
  'update': { name: 'update', method: 'PUT', query: 'Mutation', params: { needsId: true, needsObj: true }, output: { needsObj: true, needsPling: true }, graphQPrefix: 'update', graphQlPostfix: '' },
  'create': { name: 'create', method: 'POST', query: 'Mutation', params: { needsObj: true }, output: { needsObj: true, needsPling: true }, graphQPrefix: 'create', graphQlPostfix: '' },
  'delete': { name: 'delete', method: 'DELETE', query: 'Mutation', params: { needsId: true }, output: { needsObj: false }, graphQPrefix: 'delete', graphQlPostfix: '' },
  'state': { name: 'state', method: 'POST', query: 'Mutation', params: { needsId: true }, output: { needsObj: false }, graphQPrefix: 'state', graphQlPostfix: '' },
}
export function restActionToDetails ( r: RestAction ): RestActionDetail {
  if ( typeof r === 'string' ) return defaultRestAction[ r ]
  if ( isRestStateChange ( r ) ) return defaultRestAction[ 'state' ]
  throw Error ( `Don't know how to restActionToDetails(${JSON.stringify ( r )})` )
}

export function restActionToString ( r: RestAction ): string {
  return isRestStateChange ( r ) ? `state:${r.state}` : r
}
export function parseRestAction ( s: string ): RestAction {
  const [ before, after ] = beforeAfterSeparator ( ":", s )
  if ( before === 'state' ) return { state: after }
  // @ts-ignore
  return before
}

export function printRestAction ( r: RestAction ): string {
  return isRestStateChange ( r ) ? `state:${r.state}` : r
}
export function restActionForName ( r: RestAction ): string {
  return isRestStateChange ( r ) ? `state_${r.state}` : r
}
export function getRestTypeDetails ( a: RestAction ): RestActionDetail {
  return isRestStateChange ( a ) ? { ...defaultRestAction[ 'state' ], graphQlPostfix: a.state } : defaultRestAction[ a ];
}
export type emptyType = {}
export type StateAccessDetails = { url: string, params: NameAnd<emptyType> } // we don't know what the params are, we just need the names
export interface OneRestDetails<S, FD, D, MSGs> extends UrlConfig<S, FD, D> {
  url: string;
  states?: NameAnd<StateAccessDetails>,
  messages: ( status: number | undefined, body: any ) => MSGs[];//often the returning value will have messages in it. Usually a is of type Domain. When the rest action is Delete there may be no object returned, but might be MSGs
}


export type RestDetails<S, MSGs> = NameAnd<OneRestDetails<S, any, any, MSGs>>

export interface RestCommand {
  name: string;
  restAction: RestAction;
  /** If set, after the rest action has succeeded the named path will be deleted in the state. This is allow us to trigger the fetchers, which will fetch the latest data */
  deleteOnSuccess?: string | string[];
  messageOnSuccess?: string
  comment?: string;
  /** If the rest command was created by a fetcher these are the tags */
  tagNameAndTags?: { tags: Tags, tagName: string }
}
export interface HasRestCommands {
  restCommands: RestCommand[]
}
export interface HasRestCommandL<C> {
  restL: Optional<C, RestCommand[]>
}
export function restL<S extends HasRestCommands> () {
  return identityOptics<S> ().focusQuery ( 'restCommands' )
}
export interface RestResult<S, MSGs, Cargo> {
  restCommand: RestCommand;
  one: Cargo;
  status?: number;
  result: any
}

export const restResultToTx = <S, MSGs> ( messageL: Optional<S, MSGs[]>, stringToMsg: ( msg: string ) => MSGs ) => ( { restCommand, one, status, result }: RestResult<S, MSGs, OneRestDetails<S, any, any, MSGs>> ): Transform<S, any>[] => {
  const msgTransform: Transform<S, MSGs[]> = [ messageL, old => [ ...one.messages ( status, result ), ...safeArray ( old ) ] ]
  let messageOnSuccess = restCommand.messageOnSuccess;
  const msgFromCommand: Transform<S, MSGs[]> | undefined = messageOnSuccess && status && status < 300 ? [ messageL, old => [ stringToMsg ( safeString ( messageOnSuccess ) ), ...safeArray ( old ) ] ] : undefined
  const actualMessagesTxs: Transform<S, any> = msgFromCommand ? msgFromCommand : msgTransform
  const useResponse = getRestTypeDetails ( restCommand.restAction ).output.needsObj
  const resultTransform: Transform<S, any>[] = useResponse && status && status < 400 ? [ [ one.fdLens.chain ( one.dLens ), old => result ] ] : []
  let resultTxs: Transform<S, any>[] = [ actualMessagesTxs, ...resultTransform ];
  return resultTxs;
};

export const processRestResult = <S, MSGs> ( messageL: Optional<S, MSGs[]>, stringToMsg: ( msg: string ) => MSGs ) => ( s: S, { restCommand, one, status, result }: RestResult<S, MSGs, OneRestDetails<S, any, any, MSGs>> ): S => {
  const txs: Transform<S, any>[] = restResultToTx<S, MSGs> ( messageL, stringToMsg ) ( result )
  return massTransform ( s, ...txs )
};

export function getUrlForRestAction ( restAction: RestAction, url: string, states?: NameAnd<StateAccessDetails> ): string {
  if ( isRestStateChange ( restAction ) ) {
    const url: string | undefined = safeObject ( states )[ restAction.state ]?.url
    if ( url === undefined ) throw Error ( `Requested state change is ${restAction.state}. The legal list is [${sortedEntries ( states ).map ( x => x[ 0 ] )}]\nThe base url is ${url}` )
    return url;
  }
  return url
}
function findStateDetails<S, MSGS> ( one: OneRestDetails<S, any, any, MSGS>, restAction: RestStateChange ) {
  let result = safeObject ( one.states )[ restAction.state ];
  if ( result === undefined ) throw new Error ( `Illegal state [${restAction.state}] requested. Legal values are [${Object.keys ( safeObject ( one.states ) )}]` )
  return result;
}
export function restReq<S, Details extends RestDetails<S, MSGS>, MSGS> ( d: Details,
                                                                         commands: RestCommand[],
                                                                         urlMutatorForRest: ( r: RestAction, url: string ) => string,
                                                                         s: S ): [ RestCommand, OneRestDetails<S, any, any, any>, RequestInfo, RequestInit | undefined ][] {
  // @ts-ignore
  const debug = s.debug?.restDebug
  return commands.map ( command => {
    const { name, restAction } = command
    const one: OneRestDetails<S, any, any, MSGS> = d[ name ]

    if ( debug ) console.log ( "restReq-onex", name, one )
    if ( !one ) throw new Error ( `Cannot find rest details for [${name}] [${restAction}]. Legal values are ${Object.keys ( d ).sort ()}` )
    try {
      let fdLens = one.fdLens;
      if ( debug ) {
        console.log ( "restReq-fdLens", fdLens.description, fdLens )
        console.log ( "restReq-dLens", one.dLens.description, one.dLens );
      }
      let rawUrl = getUrlForRestAction ( restAction, one.url, one.states );
      let url = urlMutatorForRest ( restAction, rawUrl );
      if ( debug ) console.log ( "restReq-url", url )
      const ids = isRestStateChange ( restAction ) ? Object.keys ( safeObject ( findStateDetails ( one, restAction )?.params ) ) : one.ids
      const adjustedUrlConfig: OneRestDetails<S, any, any, MSGS> = { ...one, url, ids, fdLens }
      let request = reqFor ( adjustedUrlConfig, restAction ) ( s ) ( url );
      if ( debug ) console.log ( "restReq-req", request )
      return [ command, one, ...request ]
    } catch ( e: any ) {
      console.error ( `error making details for ${name}`, e )
      throw e
    }
  } )
}

export function massFetch<S, MSGs, Cargo> ( fetchFn: FetchFn, reqs: [ RestCommand, Cargo, RequestInfo, RequestInit | undefined ][] ): Promise<RestResult<S, MSGs[], Cargo>[]> {
  return Promise.all ( reqs.map ( ( [ restCommand, one, info, init ] ) => fetchFn ( info, init ).then (
    ( [ status, result ] ) => ({ restCommand, one, status, result }),
    error => ({ restCommand, one, result: error }) ) ) )
}

export interface allLensForRest<S, MSGS> {
  messageL: Optional<S, MSGS[]>;
  restL: Optional<S, RestCommand[]>;
  traceL: Optional<S, any>
}

const deleteAfterRest = <S> ( fromPath: ( path: string ) => Optional<S, any> ) => ( s: S, restCommand: RestCommand ): S => {
  if ( restCommand.deleteOnSuccess === undefined ) return s
  return toArray ( restCommand.deleteOnSuccess ).reduce ( ( acc: S, path: string ) => fromPath ( path ).set ( acc, undefined ), s )
};
export function processAllRestResults<S, MSGS> ( messageL: Optional<S, MSGS[]>, stringToMsg: ( msg: string ) => MSGS, restL: Optional<S, RestCommand[]>, pathToLens: ( s: S ) => ( path: string ) => Optional<S, any>, results: RestResult<S, MSGS, OneRestDetails<S, any, any, MSGS>>[], s: S ) {
  const withResults: S = results.reduce ( processRestResult ( messageL, stringToMsg ), s );
  const fromPath = pathToLens ( s )
  const withDeleteAfterRest: S = results.reduce ( ( acc, res ) =>
    deleteAfterRest ( fromPath ) ( acc, res.restCommand ), withResults )
  const withCommandsRemoved: S = restL.set ( withDeleteAfterRest, [] );
  return withCommandsRemoved
}

export interface RestCommandAndTxs<S> {
  restCommand: RestCommand;
  status?: number
  txs: Transform<S, any>[];
}


/** Executes all the rest commands returning a list of transformations. It doesn't remove the rest commands from S
 This is valuable over the 'make a new S'for a few reasons:
 * It makes testing the rest logic easier
 * It reduces race conditions where user clicks will be ignore with slow networks... the transformations can be applied to the updated world. It's not a perfect solution though (that's a hard problem)
 * It allows us (in the calling code) to add the restful data to the trace. This is great for 'understanding what happened' */
export async function restToTransforms<S, MSGS> (
  fetchFn: FetchFn,
  d: RestDetails<S, MSGS>,
  urlMutatorForRest: ( r: RestAction, url: string ) => string,
  pathToLens: ( s: S ) => ( path: string ) => Optional<S, any>,
  messageL: Optional<S, MSGS[]>,
  stringToMsg: ( msg: string ) => MSGS,
  s: S, commands: RestCommand[] ): Promise<RestCommandAndTxs<S>[]> {
  if ( s === undefined ) throw new Error ( `State was null` )
  // @ts-ignore
  const debug = s.debug?.restDebug
  if ( debug ) console.log ( "rest-commands", commands )
  if ( commands.length == 0 ) return Promise.resolve ( [] )
  const requests = restReq ( d, commands, urlMutatorForRest, s )
  if ( debug ) console.log ( "rest-requests", requests )
  const results: RestResult<S, MSGS, any>[] = await massFetch ( fetchFn, requests )
  if ( debug ) console.log ( "rest-results", results )
  const deleteTx = ( d: string ): Transform<S, any> => [ pathToLens ( s ) ( d ), () => undefined ];
  const restCommandAndTxs: RestCommandAndTxs<S>[] = results.map ( res => {
    const deleteTxs = toArray ( res.restCommand.deleteOnSuccess ).map ( deleteTx )
    const txs = [ ...restResultToTx ( messageL, stringToMsg ) ( res ), ...deleteTxs ];
    const restAndTxs: RestCommandAndTxs<S> = { ...res, txs };
    return restAndTxs
  } )

  if ( debug ) console.log ( "rest-txs ", restCommandAndTxs )
  return restCommandAndTxs
}

/** @deprecated
 * This does everything for rest: processes the commands, removes the commands, processes the adding of rest commands to state
 *
 * It is deprecated because of the race condition it introduces: the users commands from the start to the time the rest command results are processed will be overwritten
 * In addition it is hard to link this to the tracing system, so visibility about what is happening is much less
 * */
export async function rest<S, MSGS> (
  fetchFn: FetchFn,
  d: RestDetails<S, MSGS>,
  urlMutatorForRest: ( r: RestAction, url: string ) => string,
  pathToLens: ( s: S ) => ( path: string ) => Optional<S, any>,
  messageL: Optional<S, MSGS[]>,
  stringToMsg: ( msg: string ) => MSGS,
  restL: Optional<S, RestCommand[]>,
  traceL: Optional<S, any[]>,
  s: S ): Promise<S> {
  const commands = restL.getOption ( s )
  const restCommandAndTxs: RestCommandAndTxs<S>[] = await restToTransforms ( fetchFn, d, urlMutatorForRest, pathToLens, messageL, stringToMsg, s, safeArray ( commands ) )
  // @ts-ignore
  const [ debug, trace ] = [ s.debug?.restDebug, s.debug?.recordTrace ]
  console.log ( 'checking trace', trace )
  const txsWithTrace: Transform<S, any>[] = trace ?
    restCommandAndTxs.flatMap ( r => {
      let newTrace = { reason: r.restCommand, txLens: r.txs.map ( ( [ l, fn ] ) => [ l.description, resultOrErrorString ( () => fn ( l.getOption ( s ) ) ) ] ) };
      console.log ( 'newTrace', newTrace )
      const traceTx: Transform<S, any> = [ traceL, old => [ ...(old ? old : []), newTrace ] ]
      return [ ...r.txs, traceTx ]
    } )
    : restCommandAndTxs.flatMap ( r => r.txs )
  const newS = massTransform ( s, ...txsWithTrace, [ restL, () => [] ] )

  if ( debug ) console.log ( "rest-result", newS )
  return newS
}

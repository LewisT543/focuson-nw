import { createSimpleMessage, FetchFn, HasSimpleMessages, insertBefore, isRestStateChange, RestAction, SimpleMessage, stringToSimpleMsg, testDateFn } from "@focuson/utils";
import { HasRestCommands, massFetch, OneRestDetails, rest, RestCommand, RestDetails, restL, restReq } from "./rest";
import { identityOptics, lensBuilder, Lenses, NameAndLens, Optional, parsePath } from "@focuson/lens";

interface HasFullDomainForTest {
  fullDomain?: FullDomainForTest
}
interface FullDomainForTest {
  fromApi?: string;
  idFromFullDomain?: string;
}
interface RestStateForTest extends HasSimpleMessages, HasRestCommands, HasFullDomainForTest {
  token?: string;
  debug?: { recordTrace?: boolean }
}
export function traceL<S> (): Optional<S, any> {
  // @ts-ignore
  return Lenses.identity<S> ().focusQuery ( 'trace' )
}
const simpleMessageL = identityOptics<RestStateForTest> ().focusQuery ( 'messages' )

const emptyRestState: RestStateForTest = {
  messages: [], restCommands: [],
  token: 'someToken',
  fullDomain: {}
}
const emptyRestStateWithTrace: RestStateForTest = {
  ...emptyRestState,
  debug: { recordTrace: true }
}
const cd = {
  token: identityOptics<RestStateForTest> ().focusQuery ( 'token' )
}
const fdd = {
  id: identityOptics<FullDomainForTest> ().focusQuery ( 'idFromFullDomain' )
}
function oneRestDetails ( cd: NameAndLens<RestStateForTest>, fdd: NameAndLens<FullDomainForTest> ): OneRestDetails<RestStateForTest, FullDomainForTest, string, SimpleMessage> {
  return {
    fdLens: identityOptics<RestStateForTest> ().focusQuery ( 'fullDomain' ),
    dLens: identityOptics<FullDomainForTest> ().focusQuery ( 'fromApi' ),
    cd,
    fdd,
    ids: [ 'token' ],
    resourceId: [ 'id' ],
    extractData: ( status: number|undefined, body: any ): string => `Extracted[${status}].${body}`,
    messages: ( status: number | undefined, body: any ): SimpleMessage[] => status == undefined ?
      [ createSimpleMessage ( 'error', `Cannot connect. ${JSON.stringify ( body )}`, testDateFn () ) ] :
      [ createSimpleMessage ( 'info', `${status}/${JSON.stringify ( body )}`, testDateFn () ) ],
    url: "/some/url/{token}?{query}",
    states: {
      newState: { url: "/some/new/state/{token}?{query}", params: { 'token': {}, 'id': {} } }
    }
  }
}
const restDetails: RestDetails<RestStateForTest, SimpleMessage> = {
  one: oneRestDetails ( cd, fdd )
}
function withRestCommand ( r: RestStateForTest, ...restCommands: RestCommand[] ): RestStateForTest {
  return { ...r, restCommands }
}

function restMutatator ( r: RestAction, url: string ) { return insertBefore ( "?", "/" + (isRestStateChange ( r ) ? r.state : r), url )}
describe ( "restReq", () => {
  const populatedState: RestStateForTest = { ...emptyRestState, fullDomain: { idFromFullDomain: 'someId', fromApi: "someData" } }
  it ( "it should turn post commands into fetch requests - empty", () => {
    expect ( restReq ( restDetails, [], restMutatator, emptyRestState ) ).toEqual ( [] )
  } )
  it ( "it should turn post commands  into fetch requests - one", () => {
    const results = restReq ( restDetails, [ { restAction: 'update', name: 'one' } ], restMutatator, populatedState );
    expect ( results.map ( a => [ a[ 0 ], a[ 1 ].url, a[ 2 ], a[ 3 ] ] ) ).toEqual ( [
      [
        { "name": "one", "restAction": "update" },
        "/some/url/{token}?{query}",
        "/some/url/someToken/update?token=someToken&id=someId",
        { "body": "\"someData\"", "method": "put" }
      ]
    ] )
  } )
  it ( "it should turn post commands iinto fetch requests - many", () => {
    let results = restReq ( restDetails, [ { restAction: 'get', name: 'one' },
      { restAction: 'create', name: 'one' },
      { restAction: 'getOption', name: 'one' },
      { restAction: 'delete', name: 'one' },
      { restAction: 'update', name: 'one' },
      { restAction: { state: 'newState' }, name: 'one' } ], restMutatator, populatedState );
    expect ( results.map ( a => [ a[ 2 ], a[ 3 ] ] ) ).toEqual ( [
      [ "/some/url/someToken/get?token=someToken&id=someId", undefined ],
      [ "/some/url/someToken/create?token=someToken", { "body": "\"someData\"", "method": "post" } ],
      [ "/some/url/someToken/getOption?token=someToken&id=someId", undefined ],
      [ "/some/url/someToken/delete?token=someToken&id=someId", { "method": "delete" } ],
      [ "/some/url/someToken/update?token=someToken&id=someId", { "body": "\"someData\"", "method": "put" } ],
      [ "/some/new/state/someToken/newState?token=someToken&id=someId", { "method": "post" } ] ]
    )
  } )
} )

const mockFetch: FetchFn = ( url, info ) =>
  info?.method === 'delete' ? Promise.reject ( 'deleteWentWrong' ) : Promise.resolve ( [ 200, `from${url}` ] )

describe ( "massFetch", () => {
  const makeRestCommand = ( restAction: RestAction ): RestCommand => ({ restAction, name: 'someName' });
  it ( "should get the results from the fetch ", async () => {
    expect ( await massFetch ( mockFetch, [] ) ).toEqual ( [] )
    expect ( await massFetch ( mockFetch, [ [ makeRestCommand ( 'get' ), 'cargo1', '/one', undefined ], [ makeRestCommand ( 'delete' ), 'cargo2', '/one', { method: 'delete' } ], [ makeRestCommand ( { state: 'newState' } ), 'cargo3', '/one', undefined ] ] ) ).toEqual ( [
      { "one": "cargo1", "restCommand": { "name": "someName", "restAction": "get" }, "result": "from/one", "status": 200 },
      { "one": "cargo2", "restCommand": { "name": "someName", "restAction": "delete" }, "result": "deleteWentWrong" },
      { "one": "cargo3", "restCommand": { "name": "someName", "restAction": { "state": "newState" } }, "result": "from/one", "status": 200 }
    ] )
  } )
} )

const pathToLens: ( s: RestStateForTest ) => ( path: string ) => Optional<RestStateForTest, any> = ( unused ) => path => parsePath ( path, lensBuilder<RestStateForTest> ( { '/': Lenses.identity () }, {} ) )
const msgFn = stringToSimpleMsg ( () => 'now', 'info' );

describe ( "rest", () => {
  it ( "should fetch the results and put them into the state, removing the rest commands", async () => {
    const result = await rest<RestStateForTest, SimpleMessage> ( mockFetch, restDetails, restMutatator, pathToLens, simpleMessageL, msgFn, restL (), traceL (), withRestCommand ( { ...emptyRestState, fullDomain: { idFromFullDomain: 'someId', fromApi: "someData" } },
      { restAction: 'get', name: 'one' },
      { restAction: 'create', name: 'one' },
      { restAction: 'getOption', name: 'one' },
      { restAction: 'delete', name: 'one' },
      { restAction: 'update', name: 'one' },
    ) );
    expect ( result ).toEqual ( {
      "fullDomain": {
        "fromApi": "Extracted[200].from/some/url/someToken/update?token=someToken&id=someId",
        "idFromFullDomain": "someId"
      },
      "messages": [
        {
          "level": "info",
          "msg": "200/\"from/some/url/someToken/update?token=someToken&id=someId\"",
          "time": "timeForTest"
        },
        {
          "level": "error",
          "msg": "Cannot connect. \"deleteWentWrong\"",
          "time": "timeForTest"
        },
        {
          "level": "info",
          "msg": "200/\"from/some/url/someToken/getOption?token=someToken&id=someId\"",
          "time": "timeForTest"
        },
        {
          "level": "info",
          "msg": "200/\"from/some/url/someToken/create?token=someToken\"",
          "time": "timeForTest"
        },
        {
          "level": "info",
          "msg": "200/\"from/some/url/someToken/get?token=someToken&id=someId\"",
          "time": "timeForTest"
        }
      ],
      "restCommands": [],
      "token": "someToken"
    } )
  } )

  it ( "should fetch the results and put them into the state, removing the rest commands and record trace if debug set", async () => {
    const result = await rest<RestStateForTest, SimpleMessage> ( mockFetch, restDetails, restMutatator, pathToLens, simpleMessageL, msgFn, restL (), traceL (), withRestCommand ( { ...emptyRestStateWithTrace, fullDomain: { idFromFullDomain: 'someId', fromApi: "someData" } },
      { restAction: 'get', name: 'one' },
      { restAction: 'create', name: 'one' },
      { restAction: 'getOption', name: 'one' },
      { restAction: 'delete', name: 'one' },
      { restAction: 'update', name: 'one' },
    ) );
    // @ts-ignore
    const trace = result.trace
    expect ( trace ).toEqual ( [
      {
        "lensTxs": [
          [
            "I.focus?(messages)",
            [
              {
                "level": "info",
                "msg": "200/\"from/some/url/someToken/get?token=someToken&id=someId\"",
                "time": "timeForTest"
              }
            ]
          ],
          [
            "I.focus?(fullDomain).chain(I.focus?(fromApi))",
            "Extracted[200].from/some/url/someToken/get?token=someToken&id=someId"
          ]
        ],
        "restCommand": {
          "name": "one",
          "restAction": "get"
        }
      },
      {
        "lensTxs": [
          [
            "I.focus?(messages)",
            [
              {
                "level": "info",
                "msg": "200/\"from/some/url/someToken/create?token=someToken\"",
                "time": "timeForTest"
              }
            ]
          ],
          [
            "I.focus?(fullDomain).chain(I.focus?(fromApi))",
            "Extracted[200].from/some/url/someToken/create?token=someToken"
          ]
        ],
        "restCommand": {
          "name": "one",
          "restAction": "create"
        }
      },
      {
        "lensTxs": [
          [
            "I.focus?(messages)",
            [
              {
                "level": "info",
                "msg": "200/\"from/some/url/someToken/getOption?token=someToken&id=someId\"",
                "time": "timeForTest"
              }
            ]
          ],
          [
            "I.focus?(fullDomain).chain(I.focus?(fromApi))",
            "Extracted[200].from/some/url/someToken/getOption?token=someToken&id=someId"
          ]
        ],
        "restCommand": {
          "name": "one",
          "restAction": "getOption"
        }
      },
      {
        "lensTxs": [
          [
            "I.focus?(messages)",
            [
              {
                "level": "error",
                "msg": "Cannot connect. \"deleteWentWrong\"",
                "time": "timeForTest"
              }
            ]
          ]
        ],
        "restCommand": {
          "name": "one",
          "restAction": "delete"
        }
      },
      {
        "lensTxs": [
          [
            "I.focus?(messages)",
            [
              {
                "level": "info",
                "msg": "200/\"from/some/url/someToken/update?token=someToken&id=someId\"",
                "time": "timeForTest"
              }
            ]
          ],
          [
            "I.focus?(fullDomain).chain(I.focus?(fromApi))",
            "Extracted[200].from/some/url/someToken/update?token=someToken&id=someId"
          ]
        ],
        "restCommand": {
          "name": "one",
          "restAction": "update"
        }
      }
    ] )
  } )

  it ( "should process state changes without changing the domain object", async () => {
    const result = await rest<RestStateForTest, SimpleMessage> ( mockFetch, restDetails, restMutatator, pathToLens, simpleMessageL, msgFn, restL (), traceL (), withRestCommand ( { ...emptyRestState, fullDomain: { idFromFullDomain: 'someId', fromApi: "someData" } },
      { restAction: { state: 'newState' }, name: 'one' }
    ) );
    expect ( result ).toEqual ( {
      "fullDomain": {
        "fromApi": "someData",
        "idFromFullDomain": "someId"
      },
      "messages": [
        {
          "level": "info",
          "msg": "200/\"from/some/new/state/someToken/newState?token=someToken&id=someId\"",
          "time": "timeForTest"
        }
      ],
      "restCommands": [],
      "token": "someToken"
    } )
  } )

  it ( "should throw error with illegal state", async () => {
    await expect ( rest<RestStateForTest, SimpleMessage> ( mockFetch, restDetails, restMutatator, pathToLens, simpleMessageL, msgFn, restL (), traceL (), withRestCommand ( { ...emptyRestState, fullDomain: { idFromFullDomain: 'someId', fromApi: "someData" } },
      { restAction: { state: 'illegalState' }, name: 'one' }
    ) ) ).rejects.toThrow ( 'Requested state change is illegalState. The legal list is [newState]' )
  } )

  it ( "should delete items specified in the 'delete on success' - single item", async () => {
    const result = await rest<RestStateForTest, SimpleMessage> ( mockFetch, restDetails, restMutatator, pathToLens, simpleMessageL, msgFn, restL (), traceL (),
      withRestCommand ( { ...emptyRestState, fullDomain: { idFromFullDomain: 'someId', fromApi: "someData" } },
        { restAction: { state: 'newState' }, name: 'one', deleteOnSuccess: '/token' }
      ) );
    expect ( result ).toEqual ( {
      "fullDomain": {
        "fromApi": "someData",
        "idFromFullDomain": "someId"
      },
      "messages": [
        {
          "level": "info",
          "msg": "200/\"from/some/new/state/someToken/newState?token=someToken&id=someId\"",
          "time": "timeForTest"
        }
      ],
      "restCommands": []
    } )

  } )
  it ( "should delete items specified in the 'delete on success' - multiple item", async () => {
    const result = await rest<RestStateForTest, SimpleMessage> ( mockFetch, restDetails, restMutatator, pathToLens, simpleMessageL, msgFn, restL (), traceL (),
      withRestCommand ( { ...emptyRestState, fullDomain: { idFromFullDomain: 'someId', fromApi: "someData" } },
        { restAction: { state: 'newState' }, name: 'one', deleteOnSuccess: [ '/token', '/fullDomain/idFromFullDomain' ] }
      ) );
    expect ( result ).toEqual ( {
      "fullDomain": {
        "fromApi": "someData"
      },
      "messages": [
        {
          "level": "info",
          "msg": "200/\"from/some/new/state/someToken/newState?token=someToken&id=someId\"",
          "time": "timeForTest"
        }
      ],
      "restCommands": []
    } )

  } )
  it ( "should copy items specified in the 'copyOnSuccess", async () => {
    const result = await rest<RestStateForTest, SimpleMessage> ( mockFetch, restDetails, restMutatator, pathToLens, simpleMessageL, msgFn, restL (), traceL (),
      withRestCommand ( { ...emptyRestState, fullDomain: { idFromFullDomain: 'someId', fromApi: "someData" } },
        { restAction: { state: 'newState' }, name: 'one', copyOnSuccess: [ { from: '', to: '/somewhere' } ] }
      ) );
    expect ( result ).toEqual ( {
      "fullDomain": {
        "fromApi": "someData",
        "idFromFullDomain": "someId"
      },
      "messages": [        {          "level": "info",          "msg": "200/\"from/some/new/state/someToken/newState?token=someToken&id=someId\"",          "time": "timeForTest"        }      ],
      "restCommands": [],
      "somewhere": "Extracted[200].from/some/new/state/someToken/newState?token=someToken&id=someId",
      "token": "someToken"
    } )

  } )
} )


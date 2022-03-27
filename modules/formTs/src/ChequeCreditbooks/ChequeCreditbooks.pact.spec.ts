import { fetchWithPrefix, loggingFetchFn } from "@focuson/utils";
import { loadTree,wouldLoad,FetcherTree } from "@focuson/fetcher";
import { pactWith } from "jest-pact";
import { rest, RestCommand, restL } from "@focuson/rest";
import { simpleMessagesL } from "@focuson/pages";
import { Lenses, massTransform } from "@focuson/lens";
import * as samples from '../ChequeCreditbooks/ChequeCreditbooks.samples'
import {emptyState, FState , commonIds, identityL } from "../common";
import * as rests from "../rests";
import {ChequeCreditbooksFetcher} from './ChequeCreditbooks.fetchers'

//GetFetcher pact test
pactWith ( { consumer: 'ChequeCreditbooks', provider: 'ChequeCreditbooksProvider', cors: true }, provider => {
      describe ( 'ChequeCreditbooks - chequeCreditBooks - fetcher', () => {
        it ( 'should have a  fetcher for ChequeCreditbooks', async () => {
          await provider.addInteraction ( {
            state: 'default',
            uponReceiving: 'A request for ChequeCreditbooks',
            withRequest: {
              method: 'GET',
              path: '/api/chequeCreditBooks',
              query:{"accountId":"accId","applRef":"appref","brandRef":"brandRef","customerId":"custId"}
            },
            willRespondWith: {
              status: 200,
              body: samples.sampleChequeCreditbooks0
            },
          } )
          const firstState: FState  = { ...emptyState, pageSelection:[{ pageName: 'ChequeCreditbooks', pageMode: 'view' }], CommonIds: {"accountId":"accId","applRef":"appref","brandRef":"brandRef","customerId":"custId"} }
          const f: FetcherTree<FState> = { fetchers: [ ChequeCreditbooksFetcher (Lenses.identity<FState>().focusQuery('ChequeCreditbooks'), commonIds ) ], children: [] }
          let newState = await loadTree (f, firstState, fetchWithPrefix ( provider.mockService.baseUrl, loggingFetchFn ), {} )
          let expectedRaw: any = {
            ... firstState,
              tags: {'ChequeCreditbooks_~/fromApi': ["accId","appref","brandRef","custId"]}
        };
        const expected = Lenses.identity<FState>().focusQuery('ChequeCreditbooks').focusQuery('fromApi').set ( expectedRaw, samples.sampleChequeCreditbooks0 )
          expect ( newState ).toEqual ( expected )
        } )
        } )
      })

//Rest chequeCreditBooks get pact test for ChequeCreditbooks
  pactWith ( { consumer: 'ChequeCreditbooks', provider: 'ChequeCreditbooksProvider', cors: true }, provider => {
    describe ( 'ChequeCreditbooks - chequeCreditBooks rest get', () => {
      it ( 'should have a get rest for ChequeCreditbooks', async () => {
        const restCommand: RestCommand = { name: 'ChequeCreditbooks_ChequeCreditbooksRestDetails', restAction: 'get' }
        const firstState: FState = {
          ...emptyState, restCommands: [ restCommand ],
          CommonIds: {"accountId":"accId","applRef":"appref","brandRef":"brandRef","customerId":"custId"},
          pageSelection: [ { pageName: 'ChequeCreditbooks', pageMode: 'view' } ]
        }
        await provider.addInteraction ( {
          state: 'default',
          uponReceiving: 'a rest for ChequeCreditbooks chequeCreditBooks get',
          withRequest: {
            method: 'GET',
            path:  '/api/chequeCreditBooks',
            query:{"accountId":"accId","applRef":"appref","brandRef":"brandRef","customerId":"custId"},
            //no body needed for get,
          },
          willRespondWith: {
            status: 200,
            //no body needed for get
          },
        } )
        const withIds = massTransform(firstState,)
        let fetchFn = fetchWithPrefix ( provider.mockService.baseUrl, loggingFetchFn );
        let newState = await rest ( fetchFn, rests.restDetails, simpleMessagesL(), restL(), withIds )
        const rawExpected:any = { ...firstState, restCommands: []}
        const expected = Lenses.identity<FState>().focusQuery('ChequeCreditbooks').focusQuery('fromApi').set ( rawExpected, samples.sampleChequeCreditbooks0 )
        expect ( { ...newState, messages: []}).toEqual ( expected )
        expect ( newState.messages.length ).toEqual ( 1 )
        expect ( newState.messages[ 0 ].msg).toMatch(/^200.*/)
      } )
      } )
      })
  
//Rest chequeCreditBooks create pact test for ChequeCreditbooks
  pactWith ( { consumer: 'ChequeCreditbooks', provider: 'ChequeCreditbooksProvider', cors: true }, provider => {
    describe ( 'ChequeCreditbooks - chequeCreditBooks rest create', () => {
      it ( 'should have a create rest for ChequeCreditbooks', async () => {
        const restCommand: RestCommand = { name: 'ChequeCreditbooks_ChequeCreditbooksRestDetails', restAction: 'create' }
        const firstState: FState = {
          ...emptyState, restCommands: [ restCommand ],
          CommonIds: {"accountId":"accId","applRef":"appref","brandRef":"brandRef","customerId":"custId"},
          pageSelection: [ { pageName: 'ChequeCreditbooks', pageMode: 'view' } ]
        }
        await provider.addInteraction ( {
          state: 'default',
          uponReceiving: 'a rest for ChequeCreditbooks chequeCreditBooks create',
          withRequest: {
            method: 'POST',
            path:  '/api/chequeCreditBooks',
            query:{"accountId":"accId","applRef":"appref","brandRef":"brandRef","customerId":"custId"},
            body: samples.sampleChequeCreditbooks0,
          },
          willRespondWith: {
            status: 200,
            body: samples.sampleChequeCreditbooks0
          },
        } )
        const withIds = massTransform(firstState,)
        let fetchFn = fetchWithPrefix ( provider.mockService.baseUrl, loggingFetchFn );
        let newState = await rest ( fetchFn, rests.restDetails, simpleMessagesL(), restL(), withIds )
        const rawExpected:any = { ...firstState, restCommands: []}
        const expected = Lenses.identity<FState>().focusQuery('ChequeCreditbooks').focusQuery('fromApi').set ( rawExpected, samples.sampleChequeCreditbooks0 )
        expect ( { ...newState, messages: []}).toEqual ( expected )
        expect ( newState.messages.length ).toEqual ( 1 )
        expect ( newState.messages[ 0 ].msg).toMatch(/^200.*/)
      } )
      } )
      })
  
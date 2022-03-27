import { fetchWithPrefix, loggingFetchFn } from "@focuson/utils";
import { loadTree,wouldLoad,FetcherTree } from "@focuson/fetcher";
import { pactWith } from "jest-pact";
import { rest, RestCommand, restL } from "@focuson/rest";
import { simpleMessagesL } from "@focuson/pages";
import { Lenses, massTransform } from "@focuson/lens";
import * as samples from '../CreateEAccount/CreateEAccount.samples'
import {emptyState, FState , commonIds, identityL } from "../common";
import * as rests from "../rests";

//Rest eTransfer create pact test for CreateEAccount
  pactWith ( { consumer: 'CreateEAccount', provider: 'CreateEAccountProvider', cors: true }, provider => {
    describe ( 'CreateEAccount - eTransfer rest create', () => {
      it ( 'should have a create rest for CreateEAccountData', async () => {
        const restCommand: RestCommand = { name: 'CreateEAccount_CreateEAccountDataRestDetails', restAction: 'create' }
        const firstState: FState = {
          ...emptyState, restCommands: [ restCommand ],
          CommonIds: {"accountId":"accId","createPlanId":"tbd","customerId":"custId"},
          pageSelection: [ { pageName: 'CreateEAccount', pageMode: 'view' } ]
        }
        await provider.addInteraction ( {
          state: 'default',
          uponReceiving: 'a rest for CreateEAccount eTransfer create',
          withRequest: {
            method: 'POST',
            path:  '/api/createEAccount/{createPlanId}',
            query:{"accountId":"accId","customerId":"custId"},
            body: samples.sampleCreateEAccountData0,
          },
          willRespondWith: {
            status: 200,
            body: samples.sampleCreateEAccountData0
          },
        } )
        const withIds = massTransform(firstState,)
        let fetchFn = fetchWithPrefix ( provider.mockService.baseUrl, loggingFetchFn );
        let newState = await rest ( fetchFn, rests.restDetails, simpleMessagesL(), restL(), withIds )
        const rawExpected:any = { ...firstState, restCommands: []}
        const expected = Lenses.identity<FState>().focusQuery('CreateEAccount').focusQuery('editing').set ( rawExpected, samples.sampleCreateEAccountData0 )
        expect ( { ...newState, messages: []}).toEqual ( expected )
        expect ( newState.messages.length ).toEqual ( 1 )
        expect ( newState.messages[ 0 ].msg).toMatch(/^200.*/)
      } )
      } )
      })
  
//Rest eTransfer get pact test for CreateEAccount
  pactWith ( { consumer: 'CreateEAccount', provider: 'CreateEAccountProvider', cors: true }, provider => {
    describe ( 'CreateEAccount - eTransfer rest get', () => {
      it ( 'should have a get rest for CreateEAccountData', async () => {
        const restCommand: RestCommand = { name: 'CreateEAccount_CreateEAccountDataRestDetails', restAction: 'get' }
        const firstState: FState = {
          ...emptyState, restCommands: [ restCommand ],
          CommonIds: {"accountId":"accId","createPlanId":"tbd","customerId":"custId"},
          pageSelection: [ { pageName: 'CreateEAccount', pageMode: 'view' } ]
        }
        await provider.addInteraction ( {
          state: 'default',
          uponReceiving: 'a rest for CreateEAccount eTransfer get',
          withRequest: {
            method: 'GET',
            path:  '/api/createEAccount/{createPlanId}',
            query:{"accountId":"accId","createPlanId":"tbd","customerId":"custId"},
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
        const expected = Lenses.identity<FState>().focusQuery('CreateEAccount').focusQuery('editing').set ( rawExpected, samples.sampleCreateEAccountData0 )
        expect ( { ...newState, messages: []}).toEqual ( expected )
        expect ( newState.messages.length ).toEqual ( 1 )
        expect ( newState.messages[ 0 ].msg).toMatch(/^200.*/)
      } )
      } )
      })
  
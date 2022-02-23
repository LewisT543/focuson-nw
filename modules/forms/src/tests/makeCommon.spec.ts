import { findAllCommonParams, makeFullState, makeCommonParams } from "../codegen/makeCommon";
import { EAccountsSummaryPD } from "../example/eAccounts/eAccountsSummary.pageD";
import { paramsForTest } from "./makeJavaResolvers.spec";
import { createPlanRestD, eAccountsSummaryRestD } from "../example/eAccounts/eAccountsSummary.restD";
import { CreatePlanPD } from "../example/eAccounts/createPlanPD";


describe ( "makeFullState", () => {
  it ( 'should make the FullState', () => {
    expect ( makeFullState ( paramsForTest, [ EAccountsSummaryPD, CreatePlanPD ] ) ).toEqual ( [
      "export interface FState extends HasSimpleMessages,HasPageSelection,HascommonIds,HasTagHolder,HasSelectedModalPage,HasPostCommand<FState,any>,HasFocusOnDebug,",
      " pageDomains.HasEAccountsSummaryPageDomain",
      "{}"
    ])
  } )

} )

describe ( "findAllCommonParams", () => {
  it ( 'should find all the commons lens in the pages', () => {
    expect ( findAllCommonParams ( [ eAccountsSummaryRestD ,createPlanRestD] ) ).toEqual ( [ "accountId", "customerId","createPlanId" ] )
  } )

} )
describe ( "makeCommonParams", () => {
  it ( 'should make the code around "GetUrlParams"', () => {
    expect ( makeCommonParams ( paramsForTest, [ eAccountsSummaryRestD ] ) ).toEqual ( [
      "export interface HascommonIds {commonIds: commonIds}",
      "export type commonIds = {",
      "accountId?:string;",
      "customerId?:string;",
      "}",
      "export interface FocusedProps<S,D, Context> extends LensProps<S,D, Context>{",
      "  mode: PageMode;",
      "}",
      "export const commonIdLens = Lenses.identity<FState> ().focusOn ( 'commonIds' )",
      "export const commonIdOps = tagOps ( commonIdLens, { failSilently: false } )",
      "export function commonFetch<S extends HasSimpleMessages & HasTagHolder & HasPageSelection, T> ( onError?: OnTagFetchErrorFn<S, any, T, SimpleMessage> ) {",
      "  return commonTagFetchProps<S, T> (",
      "    ( s, date ) => [], //later do the messaging",
      "    defaultDateFn ) ( onError ) //updateTagsAndMessagesOnError ( defaultErrorMessage )",
      "}"
    ])
  } )

} )
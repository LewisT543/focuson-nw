import { makeAllFetchers, makeFetchersDataStructure } from "../codegen/makeFetchers";
import { createPlanPD, EAccountsSummaryPD } from "../example/eAccounts/eAccountsSummary.pageD";
import { paramsForTest } from "./makeJavaResolvers.spec";

describe ( "makeAllFetchers", () => {
    it ( "should make a fetcher", () => {
      expect ( makeAllFetchers ( paramsForTest, [ EAccountsSummaryPD, createPlanPD ] ) ).toEqual ( [
        "export function EAccountsSummaryDDFetcher<S extends  HasSimpleMessages & HasTagHolder & HasPageSelection & pageDomains.HasEAccountsSummaryPageDomain>(tagOps: TagOps<S,common.commonIds>) {",
        "  return pageAndTagFetcher<S, pageDomains.EAccountsSummaryPageDomain, domains.EAccountsSummaryDDDomain, SimpleMessage>(",
        "    common.commonFetch<S,  domains.EAccountsSummaryDDDomain>(),",
        "     'EAccountsSummary',",
        "     'fromApi',",
        "     (s) => s.focusQuery('fromApi'),",
        "     tagOps.tags('accountId', 'customerId'),",
        "     tagOps.getReqFor('/api/accountsSummary?{query}',undefined,'accountId', 'customerId'))",
        "}"
      ])
    } )
  }
)

describe ( 'makeFetchersDataStructure', () => {
  it ( "should record all the fetchers", () => {
    expect ( makeFetchersDataStructure ( paramsForTest, { variableName: 'fetchers', stateName: 'theState' }, [ EAccountsSummaryPD, createPlanPD ] ) ).toEqual ( [
      "export const fetchers: FetcherTree<common.theState> = {",
      "fetchers: [",
      "   EAccountsSummaryDDFetcher<common.theState>(common.commonIdOps)",
      "],",
      "children: []}"
    ] )
  } )
} );
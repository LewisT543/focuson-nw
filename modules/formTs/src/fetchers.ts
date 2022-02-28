import * as pageDomains from './pageDomains';
import * as domains from './domains';
import * as common from './common';
import { FetcherTree,  } from "@focuson/fetcher";
import { HasTagHolder, NameAndLens } from "@focuson/template";
import { HasPageSelection } from "@focuson/pages";
import { HasSimpleMessages, SimpleMessage } from '@focuson/utils';
import { pageAndTagFetcher } from "@focuson/focuson";
import { commonIds, identityL } from './common';
import { Optional, Lenses } from '@focuson/lens';
//fetcher type list
export function OccupationAndIncomeFetcher<S extends  HasSimpleMessages & HasTagHolder & HasPageSelection>(fdLens:Optional<S, pageDomains.OccupationAndIncomeDetailsPageDomain>,commonIds: NameAndLens<S>) {
  return pageAndTagFetcher<S, pageDomains.OccupationAndIncomeDetailsPageDomain, domains.OccupationAndIncomeDomain, SimpleMessage>(
    common.commonFetch<S,  domains.OccupationAndIncomeDomain>(),
     'OccupationAndIncomeDetails',
     'fromApi', fdLens, commonIds, {},["customerId"],[],
      Lenses.identity< pageDomains.OccupationAndIncomeDetailsPageDomain> ().focusQuery ( 'fromApi' ),
     '/api/oneOccupationAndIncome?{query}')
}
//fetcher type get
export function EAccountsSummaryDDFetcher<S extends  HasSimpleMessages & HasTagHolder & HasPageSelection>(fdLens:Optional<S, pageDomains.EAccountsSummaryPageDomain>,commonIds: NameAndLens<S>) {
  return pageAndTagFetcher<S, pageDomains.EAccountsSummaryPageDomain, domains.EAccountsSummaryDDDomain, SimpleMessage>(
    common.commonFetch<S,  domains.EAccountsSummaryDDDomain>(),
     'EAccountsSummary',
     'fromApi', fdLens, commonIds, {},["accountId"],["customerId"],
      Lenses.identity< pageDomains.EAccountsSummaryPageDomain> ().focusQuery ( 'fromApi' ),
     '/api/accountsSummary?{query}')
}
//fetcher type get
export function ChequeCreditbooksDDFetcher<S extends  HasSimpleMessages & HasTagHolder & HasPageSelection>(fdLens:Optional<S, pageDomains.ChequeCreditbooksPageDomain>,commonIds: NameAndLens<S>) {
  return pageAndTagFetcher<S, pageDomains.ChequeCreditbooksPageDomain, domains.ChequeCreditbooksDDDomain, SimpleMessage>(
    common.commonFetch<S,  domains.ChequeCreditbooksDDDomain>(),
     'ChequeCreditbooks',
     'fromApi', fdLens, commonIds, {},["accountId","applRef","brandRef","customerId"],[],
      Lenses.identity< pageDomains.ChequeCreditbooksPageDomain> ().focusQuery ( 'fromApi' ),
     '/api/chequeCreditBooks?{query}')
}
export const fetchers: FetcherTree<common.FState> = {
fetchers: [
    OccupationAndIncomeFetcher<common.FState> ( identityL.focusQuery ( 'OccupationAndIncomeDetails' ), commonIds ),
    EAccountsSummaryDDFetcher<common.FState> ( identityL.focusQuery ( 'EAccountsSummary' ), commonIds ),
    ChequeCreditbooksDDFetcher<common.FState> ( identityL.focusQuery ( 'ChequeCreditbooks' ), commonIds )
],
children: []}
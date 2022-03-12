import * as common from '../common';
import * as domains from '../EAccountsSummary/EAccountsSummary.domains'
import { HasTagHolder } from "@focuson/template";
import { HasPageSelection } from "@focuson/pages";
import { HasSimpleMessages, SimpleMessage } from '@focuson/utils';
import { pageAndTagFetcher } from "@focuson/focuson";
import { FState } from "../common";
import { Optional, Lenses, NameAndLens} from '@focuson/lens';
//fetcher type true
export function EAccountsSummaryDDFetcher(fdLens:Optional<FState, domains.EAccountsSummaryPageDomain>,commonIds: NameAndLens<FState>) {
  const localIds = {}
  return pageAndTagFetcher<FState, domains.EAccountsSummaryPageDomain, domains.EAccountsSummaryDDDomain, SimpleMessage>(
    common.commonFetch<FState,  domains.EAccountsSummaryDDDomain>(),
     'EAccountsSummary',
     'fromApi', fdLens, commonIds, localIds,["accountId"],["customerId"],
      Lenses.identity< domains.EAccountsSummaryPageDomain> ().focusQuery('fromApi'),
     '/api/accountsSummary?{query}')
}
import * as common from '../common';
import * as domains from '../ChequeCreditbooks/ChequeCreditbooks.domains'
import { HasTagHolder } from "@focuson/template";
import { HasPageSelection } from "@focuson/pages";
import { HasSimpleMessages, SimpleMessage } from '@focuson/utils';
import { pageAndTagFetcher } from "@focuson/focuson";
import { Optional, Lenses, NameAndLens} from '@focuson/lens';
//fetcher type true
export function ChequeCreditbooksDDFetcher<S extends  HasSimpleMessages & HasTagHolder & HasPageSelection>(fdLens:Optional<S, domains.ChequeCreditbooksPageDomain>,commonIds: NameAndLens<S>) {
  return pageAndTagFetcher<S, domains.ChequeCreditbooksPageDomain, domains.ChequeCreditbooksDDDomain, SimpleMessage>(
    common.commonFetch<S,  domains.ChequeCreditbooksDDDomain>(),
     'ChequeCreditbooks',
     'fromApi', fdLens, commonIds, {},["accountId","applRef","brandRef","customerId"],[],
      Lenses.identity< domains.ChequeCreditbooksPageDomain> ().focusQuery ( 'fromApi' ),
     '/api/chequeCreditBooks?{query}')
}
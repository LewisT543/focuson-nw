import { OneRestDetails } from "@focuson/rest"
import * as domains from "../ChequeCreditbooks/ChequeCreditbooks.domains"
import { createSimpleMessage, DateFn, defaultDateFn, SimpleMessage } from "@focuson/utils"
import { Lenses, NameAndLens} from "@focuson/lens"

export function ChequeCreditbooks_ChequeCreditbooksDDRestDetails ( cd: NameAndLens<FState>, dateFn: DateFn  ): OneRestDetails<FState, domains.ChequeCreditbooksPageDomain, domains.ChequeCreditbooksDDDomain, SimpleMessage> {
  const paramNameToLens = {...cd,postcode: Lenses.identity<FState>().focusQuery('PostCodeDemo').focusQuery('postcode').focusQuery('search')}
  const fdd: NameAndLens<domains.ChequeCreditbooksPageDomain> = {}
  const localIds = {}
  return {
    dLens: Lenses.identity<domains.ChequeCreditbooksPageDomain>().focusQuery('fromApi'),
    cd: paramNameToLens, fdd,
    ids: ["accountId","applRef","brandRef","customerId"],
    resourceId:  [],
    messages: ( status: number, body: any ): SimpleMessage[] => [ createSimpleMessage ( 'info', `${status} /${JSON.stringify ( body )}`, dateFn () ) ],
    url: "/api/chequeCreditBooks?{query}"
  }
}

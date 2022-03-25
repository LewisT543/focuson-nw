import { OneRestDetails } from "@focuson/rest"
import * as domains from "../JointAccount/JointAccount.domains"
import { createSimpleMessage, DateFn, defaultDateFn, SimpleMessage } from "@focuson/utils"
import { Lenses, NameAndLens} from "@focuson/lens"

import { FState } from "../common"
export function JointAccount_JointAccountRestDetails ( cd: NameAndLens<FState>, dateFn: DateFn  ): OneRestDetails<FState, domains.JointAccountPageDomain, domains.JointAccountDomain, SimpleMessage> {
  const fdd: NameAndLens<domains.JointAccountPageDomain> = {}
  return {
    fdLens: Lenses.identity<FState>().focusQuery('JointAccount'),
    dLens: Lenses.identity<domains.JointAccountPageDomain>()state: fullState - ~/fromApi,
    cd, fdd,
    ids: ["customerId"],
    resourceId:  [],
    messages: ( status: number, body: any ): SimpleMessage[] => [ createSimpleMessage ( 'info', `${status} /${JSON.stringify ( body )}`, dateFn () ) ],
    url: "/api/jointAccount?{query}"
  }
}

import { Optional } from "@focuson/lens"
import { PostDetails } from "@focuson/poster"
import { NameAndLens } from "@focuson/template";
import { CreatePlanDDDomain } from "./domains";
import { OneRestDetails,RestDetails } from "@focuson/rest";
import { createSimpleMessage, defaultDateFn, SimpleMessage } from "@focuson/utils";
import { commonIds, FState, identityL } from "./common";

//export function OccupationAndIncomeFetcher<S extends  HasSimpleMessages & HasTagHolder & HasPageSelection>(fdLens:Optional<S, pageDomains.OccupationAndIncomeDetailsPageDomain>,commonIds: NameAndLens<S>) {
//   return pageAndTagFetcher<S, pageDomains.OccupationAndIncomeDetailsPageDomain, domains.OccupationAndIncomeDomain, SimpleMessage>(
//

export function oneRestDetails<S > (fdLens: Optional<S, CreatePlanDDDomain>, cd: NameAndLens<S> ): OneRestDetails<S, CreatePlanDDDomain, CreatePlanDDDomain, SimpleMessage> {
  const fdd: NameAndLens<CreatePlanDDDomain> = {
  }
  return {
    fdLens,
    dLens: fdLens,
    cd,
    fdd,
    ids: [ 'createPlanId' ],
    resourceId: [ 'id' ],
    messages: ( status: number, body: any ): SimpleMessage[] => [ createSimpleMessage ( 'info', `${status}/${JSON.stringify ( body )}`, defaultDateFn () ) ],
    url: "/some/url/{token}?{query}"
  }
}

export const rests: RestDetails<FState, SimpleMessage> = {
  createRestDetails: oneRestDetails(identityL.focusQuery(''),commonIds,)

}
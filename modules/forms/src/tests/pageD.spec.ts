import { allRestAndActions, dataDsIn } from "../common/pageD";
import { EAccountsSummaryPD } from "../example/eAccounts/eAccountsSummary.pageD";
import { sortedEntries } from "@focuson-nw/utils";
import { CreatePlanPD } from "../example/eAccounts/createPlanPD";

describe ( "dataDsIn", () => {
  it ( "should find all the DataDs in a list of pages", () => {
    let list = [ EAccountsSummaryPD, CreatePlanPD, EAccountsSummaryPD, CreatePlanPD ];
    const actual = dataDsIn ( list )
    const names = sortedEntries ( actual ).map ( ( [ n, v ] ) => {
      expect ( n ).toEqual ( v.name )
      return n
    } )
    expect ( names ).toEqual ( [
      "BalancesAndMonthlyCost",
      "CreatePlan",
      "EAccountsSummary",
      "EAccountsSummaryTable",
      "EAccountSummary"
    ] )
  } )

  it ( "should find all the DataDs in a list of pages when display stopped", () => {
    let list = [ EAccountsSummaryPD, CreatePlanPD, EAccountsSummaryPD, CreatePlanPD ];
    const actual = dataDsIn ( list, true )
    const names = sortedEntries ( actual ).map ( ( [ n, v ] ) => {
      expect ( n ).toEqual ( v.name )
      return n
    } )
    expect ( names ).toEqual ( [
      "BalancesAndMonthlyCost",
      "CreatePlan",
      "EAccountsSummary",
      "EAccountsSummaryTable"
    ] )
  } )
} )

describe ( "allRestAndActions", () => {
  it ( "should find the unque rests and actions", () => {
    expect ( allRestAndActions ( [ EAccountsSummaryPD, EAccountsSummaryPD ] ).//
      map ( ( [ page, restName, rdp, rad ] ) =>
        JSON.stringify ( [ page.name, restName, rdp.rest.dataDD.name, rad.name ] ).replace ( /"/g, "'" ) ) ).toEqual ( [
      "['EAccountsSummary','createPlanRestD','CreatePlan','get']",
      "['EAccountsSummary','createPlanRestD','CreatePlan','create']",
      "['EAccountsSummary','createPlanRestD','CreatePlan','update']",
      "['EAccountsSummary','createPlanRestD','CreatePlan','delete']",
      "['EAccountsSummary','eAccountsSummary','EAccountsSummary','get']",
      "['EAccountsSummary','eAccountsSummary','EAccountsSummary','state']"
    ])
  } )

} )
import { AccountIdDD, DataD, DateDD, MoneyDD, OneLineStringDD, PrimitiveDD, RepeatingDataD } from "../common/dataD";
import { LabelAndInputCD, TableCD } from "../common/componentsD";
import { listComponentsIn } from "../codegen/makeComponents";


export const TheAccountDD: PrimitiveDD = {
  name: "TheAccountDD",
  reactType: 'string',
  description: "The component that displays an EAccountDisplayType (savings/checking)",
  display: LabelAndInputCD,
  displayParams: { someUnrecognisedParam: { value: 'who cares' } },
  validation: { enum: true, maxLength: 7 },
  enum: { savings: 'Savings', checking: 'Checking' }
  //Note samples come from enum
}

export const TheAccountSummaryDD: DataD = {
  name: "TheAccountSummaryDD",
  description: "This is the summary data about a single EAccount",
  structure: {
    accountId: { dataDD: AccountIdDD, displayParams: { illegalParam: "Account Id" } },
    displayType: { dataDD: TheAccountDD },//No label because it is derivable from the camelCase
    description: { dataDD: OneLineStringDD },
    frequency: { dataDD: OneLineStringDD, displayParams: { anotherIllegalParam: "someValue", label: [ 'shouldBeAString' ] } },
  }
}
// @ts-ignore missing a display deliberatly to check validation
export const TheSummaryTable: RepeatingDataD = {
  name: "TheSummaryTable",
  paged: false,
  description: "Just the raw EAccountSummaryDD data - missing a display",
  dataDD: TheAccountSummaryDD,
  displayParams: { order: { value: [ 'accountId', 'displayType', 'description', 'frequency' ] } }
}
export const TheSummaryTable2: RepeatingDataD = {
  name: "TheSummaryTable2",
  paged: false,
  description: "Just the raw EAccountSummaryDD data - missing params",
  dataDD: TheAccountSummaryDD,
  display: TableCD,
  displayParams: {}
}
export const TheCreatePlanDD: DataD = {
  name: "CreatePlanDD",
  description: "The create plan data (actually just put in one place to allow a test for a structure)",
  structure: {
    createPlanStart: { displayParams: { label: 'Create Start', junk: 'someValue' }, dataDD: DateDD },
    createPlanDate: { displayParams: { ariaLabel: [ 'The Create Plan Date' ] }, dataDD: DateDD },
    createPlanEnd: { dataDD: DateDD },
  }
}
export const TheAccountsSummaryDD: DataD = {
  name: "EAccountsSummaryDD",
  description: "This is the summary data about all the EAccounts for a single user",
  structure: {
    eAccountsTable: { dataDD: TheSummaryTable },
    eAccountsTable2: { dataDD: TheSummaryTable2 },
    totalMonthlyCost: { dataDD: MoneyDD },
    oneAccountBalance: { dataDD: MoneyDD },
    currentAccountBalance: { dataDD: MoneyDD },
    createPlan: { dataDD: TheCreatePlanDD }
  }
}

describe ( "validateDataDD", () => {
  it ( "it should list components (warts and all)", () => {
    expect ( listComponentsIn ( TheAccountsSummaryDD ) ).toEqual ( [
      { dataDD: TheSummaryTable, path: [ "eAccountsTable" ] },
      { dataDD: TheSummaryTable2, display: TableCD, path: [ "eAccountsTable2" ] },
      { dataDD: MoneyDD, display: LabelAndInputCD, path: [ "totalMonthlyCost" ] },
      { dataDD: MoneyDD, display: LabelAndInputCD, path: [ "oneAccountBalance" ] },
      { dataDD: MoneyDD, display: LabelAndInputCD, path: [ "currentAccountBalance" ] },
      { dataDD: DateDD, display: LabelAndInputCD, displayParams: { label: 'Create Start', junk: 'someValue' }, path: [ "createPlan", "createPlanStart" ] },
      { dataDD: DateDD, display: LabelAndInputCD, displayParams: { ariaLabel: [ 'The Create Plan Date' ] }, path: [ "createPlan", "createPlanDate" ] },
      { dataDD: DateDD, display: LabelAndInputCD, path: [ "createPlan", "createPlanEnd" ] }
    ] )
  } )
} )

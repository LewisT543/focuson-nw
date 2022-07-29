import { makeInitialValue, makePages } from "../codegen/makePages";
import { EAccountsSummaryPD } from "../example/eAccounts/eAccountsSummary.pageD";
import { RepeatingPageD } from "../example/repeating/repeating.pageD";
import { CreateEAccountPageD } from "../example/createEAccount/createEAccount.pageD";
import { paramsForTest } from "./paramsForTest";
import { JointAccountDd } from "../example/jointAccount/jointAccount.dataD";


describe ( "makeInitialvalue", () => {
  it ( "should make the initial value if we give 'empty'", () => {
    expect ( makeInitialValue ( { dataDD: JointAccountDd, target: '~/someTarget' }, 'someName', 'empty' ) ).toEqual ( [
      {
        "command": "set",
        "path": "~/someTarget",
        "value": {
          "balance": 0,
          "joint": { "addresses": [ { "line1": "", "line2": "" } ], "name": "" },
          "main": { "addresses": [ { "line1": "", "line2": "" } ], "name": "" }
        }
      }
    ] )
  } )
  it ( "should make the initial value for undefined", () => {
    expect ( makeInitialValue ( { dataDD: JointAccountDd, target: '~/someTarget' }, 'someName', undefined ) ).toEqual ( undefined )
  } )
  it ( "should make the initial value if we give a list of commands", () => {
    expect ( makeInitialValue ( { dataDD: JointAccountDd, target: '~/someTarget' }, 'someName',
      [ { command: 'message', msg: 'one' }, { command: 'message', msg: 'two' } ] ) ).toEqual ( [
      { "command": "message", "msg": "one" },
      { "command": "message", "msg": "two" }
    ] )

  } )
  it ( "should make the initial value if we give a list of commands and an empty", () => {
    expect ( makeInitialValue ( { dataDD: JointAccountDd, target: '~/someTarget' }, 'someName',
      [ { command: 'message', msg: 'one' }, 'empty', { command: 'message', msg: 'two' } ] ) ).toEqual ( [
      { "command": "message", "msg": "one" },
      {
        "command": "set", "path": "~/someTarget", "value": {
          "balance": 0,
          "joint": { "addresses": [ { "line1": "", "line2": "" } ], "name": "" },
          "main": {
            "addresses": [ { "line1": "", "line2": "" } ], "name": ""
          }
        }
      },
      { "command": "message", "msg": "two" } ] )
  } )

} )

describe ( "makePages", () => {

  it ( "should make the 'pages' description for the generated app", () => {
    expect ( makePages ( paramsForTest, [ EAccountsSummaryPD, RepeatingPageD ] ).map(s => s.replace(/"/g, "'")) ).toEqual ([
      "import { identityOptics } from '@focuson/lens';",
      "import { Loading, MultiPageDetails, simpleMessagesPageConfig } from '@focuson/pages';",
      "import {Context,  FState } from './common';",
      "import { EAccountsSummaryPage } from './EAccountsSummary/EAccountsSummary.render';",
      "import { CreatePlanPage } from './EAccountsSummary/CreatePlan.render';",
      "import { RepeatingPage } from './Repeating/Repeating.render';",
      "import { RepeatingLinePage } from './Repeating/RepeatingLine.render';",
      "import { EAccountsSummaryOptionals } from './EAccountsSummary/EAccountsSummary.optionals'; ",
      "import { RepeatingOptionals } from './Repeating/Repeating.optionals'; ",
      "",
      "const simpleMessagesConfig = simpleMessagesPageConfig<FState, string, Context> (  Loading )",
      "const identity = identityOptics<FState> ();",
      "export const pages: MultiPageDetails<FState, Context> = {",
      "    EAccountsSummary: {pageType: 'MainPage',  config: simpleMessagesConfig, lens: identity.focusQuery ( 'EAccountsSummary' ), pageFunction: EAccountsSummaryPage(), initialValue: [{'command':'set','path':'~/fromApi','value':{}}], pageMode: 'view',namedOptionals: EAccountsSummaryOptionals },",
      "    Repeating: {pageType: 'MainPage',  config: simpleMessagesConfig, lens: identity.focusQuery ( 'Repeating' ), pageFunction: RepeatingPage(), initialValue: [{'command':'set','path':'~/selectedItem','value':0}], pageMode: 'view',namedOptionals: RepeatingOptionals },",
      "    CreatePlan: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: CreatePlanPage()},",
      "    RepeatingLine: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: RepeatingLinePage()}",
      "  }"
    ] )
  } )
  it ( "should create an initial from 'empty'", () => {
    expect ( makePages ( paramsForTest, [ CreateEAccountPageD ] ).map ( s => s.replace ( /"/g, "'" ) ) ).toEqual ([
      "import { identityOptics } from '@focuson/lens';",
      "import { Loading, MultiPageDetails, simpleMessagesPageConfig } from '@focuson/pages';",
      "import {Context,  FState } from './common';",
      "import { CreateEAccountPage } from './CreateEAccount/CreateEAccount.render';",
      "import { CreateEAccountOptionals } from './CreateEAccount/CreateEAccount.optionals'; ",
      "",
      "const simpleMessagesConfig = simpleMessagesPageConfig<FState, string, Context> (  Loading )",
      "const identity = identityOptics<FState> ();",
      "export const pages: MultiPageDetails<FState, Context> = {",
      "    CreateEAccount: {pageType: 'MainPage',  config: simpleMessagesConfig, lens: identity.focusQuery ( 'CreateEAccount' ), pageFunction: CreateEAccountPage(), initialValue: [{'command':'set','path':'~/editing','value':{'name':'','type':'savings','savingsStyle':'adhoc','initialAmount':0}}], pageMode: 'create',namedOptionals: CreateEAccountOptionals }",
      "  }"
    ])
  } )
} )
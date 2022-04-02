import { makePages } from "../codegen/makePages";
import { paramsForTest } from "./makeJavaResolvers.spec";
import { EAccountsSummaryPD } from "../example/eAccounts/eAccountsSummary.pageD";
import { CreatePlanPD } from "../example/eAccounts/createPlanPD";
import { repeatingRestRD } from "../example/repeating/repeating.restD";
import { RepeatingLinePageD, RepeatingPageD } from "../example/repeating/repeating.pageD";
import { RepeatingWholeDataD } from "../example/repeating/repeating.dataD";
import { CreateEAccountPageD } from "../example/createEAccount/createEAccount.pageD";


describe ( "makePages", () => {
  it ( "should make the 'pages' description for the generated app", () => {
    expect ( makePages ( paramsForTest, [ EAccountsSummaryPD, CreatePlanPD, RepeatingPageD, RepeatingLinePageD ] ) ).toEqual ( [
      "import { identityOptics } from \"@focuson/lens\";",
      "import { Loading, MultiPageDetails, simpleMessagesPageConfig } from \"@focuson/pages\";",
      "import {Context,  FState } from \"./common\";",
      "import { EAccountsSummaryPage } from './EAccountsSummary/EAccountsSummary.render';",
      "import { CreatePlanPage } from './CreatePlan/CreatePlan.render';",
      "import { RepeatingPage } from './Repeating/Repeating.render';",
      "import { RepeatingLinePage } from './RepeatingLine/RepeatingLine.render';",
      "import { EAccountsSummaryOptionals } from \"./EAccountsSummary/EAccountsSummary.optionals\"; ",
      "import { RepeatingOptionals } from \"./Repeating/Repeating.optionals\"; ",
      "",
      "const simpleMessagesConfig = simpleMessagesPageConfig<FState, string, Context> (  Loading )",
      "const identity = identityOptics<FState> ();",
      "export const pages: MultiPageDetails<FState, Context> = {",
      "    EAccountsSummary: {pageType: 'MainPage',  config: simpleMessagesConfig, lens: identity.focusQuery ( 'EAccountsSummary' ), pageFunction: EAccountsSummaryPage(), initialValue: {}, pageMode: 'view',namedOptionals: EAccountsSummaryOptionals },",
      "    Repeating: {pageType: 'MainPage',  config: simpleMessagesConfig, lens: identity.focusQuery ( 'Repeating' ), pageFunction: RepeatingPage(), initialValue: {\"selectedItem\":0}, pageMode: 'view',namedOptionals: RepeatingOptionals },",
      "    CreatePlan: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: CreatePlanPage()},",
      "    RepeatingLine: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: RepeatingLinePage()}",
      "  }"
    ])
  } )
  it ( "should create an initial from 'empty'", () => {
    expect ( makePages ( paramsForTest, [ CreateEAccountPageD ] ).map(s=>s.replace(/"/g, "'")) ).toEqual ( [
      "import { identityOptics } from '@focuson/lens';",
      "import { Loading, MultiPageDetails, simpleMessagesPageConfig } from '@focuson/pages';",
      "import {Context,  FState } from './common';",
      "import { CreateEAccountPage } from './CreateEAccount/CreateEAccount.render';",
      "import { CreateEAccountOptionals } from './CreateEAccount/CreateEAccount.optionals'; ",
      "",
      "const simpleMessagesConfig = simpleMessagesPageConfig<FState, string, Context> (  Loading )",
      "const identity = identityOptics<FState> ();",
      "export const pages: MultiPageDetails<FState, Context> = {",
      "    CreateEAccount: {pageType: 'MainPage',  config: simpleMessagesConfig, lens: identity.focusQuery ( 'CreateEAccount' ), pageFunction: CreateEAccountPage(), initialValue: {'editing':{'name':'','type':'savings','savingsStyle':'adhoc','initialAmount':0}}, pageMode: 'create',namedOptionals: CreateEAccountOptionals }",
      "  }"
    ])
  } )
} )
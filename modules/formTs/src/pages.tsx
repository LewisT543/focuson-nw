import { identityOptics } from "@focuson/lens";
import { Loading, MultiPageDetails, simpleMessagesPageConfig } from "@focuson/pages";
import {Context,  FState } from "./common";
import { HelloWorldPage } from './HelloWorld/HelloWorld.render';
import { AccountOverviewPage } from './AccountOverview/AccountOverview.render';
import { ExcessInfoSearchPage } from './ExcessInfoSearch/ExcessInfoSearch.render';
import { ReasonPage } from './Reason/Reason.render';
import { ExcessHistoryPage } from './ExcessHistory/ExcessHistory.render';
import { ArrearsDetailsPage } from './ArrearsDetails/ArrearsDetails.render';
import { AccountFlagsPage } from './AccountFlags/AccountFlags.render';
import { JointAccountPage } from './JointAccount/JointAccount.render';
import { JointAccountEditModalPagePage } from './JointAccountEditModalPage/JointAccountEditModalPage.render';
import { OccupationAndIncomeSummaryPage } from './OccupationAndIncomeSummary/OccupationAndIncomeSummary.render';
import { OccupationIncomeModalPage } from './OccupationIncomeModal/OccupationIncomeModal.render';
import { AdditionalInformationModalPage } from './AdditionalInformationModal/AdditionalInformationModal.render';
import { BusinessDetailsModalPage } from './BusinessDetailsModal/BusinessDetailsModal.render';
import { OtherSourcesOfIncomeModalPage } from './OtherSourcesOfIncomeModal/OtherSourcesOfIncomeModal.render';
import { ListOccupationsModalPage } from './ListOccupationsModal/ListOccupationsModal.render';
import { EAccountsSummaryPage } from './EAccountsSummary/EAccountsSummary.render';
import { CreatePlanPage } from './CreatePlan/CreatePlan.render';
import { ETransferPage } from './ETransfer/ETransfer.render';
import { CreateEAccountPage } from './CreateEAccount/CreateEAccount.render';
import { ChequeCreditbooksPage } from './ChequeCreditbooks/ChequeCreditbooks.render';
import { OrderChequeBookOrPayingInModalPage } from './OrderChequeBookOrPayingInModal/OrderChequeBookOrPayingInModal.render';
import { RepeatingPage } from './Repeating/Repeating.render';
import { RepeatingLinePage } from './RepeatingLine/RepeatingLine.render';
import { PostCodeDemoPage } from './PostCodeDemo/PostCodeDemo.render';
import { PostCodeSearchPage } from './PostCodeSearch/PostCodeSearch.render';
import { HelloWorldOptionals } from "./HelloWorld/HelloWorld.optionals"; 
import { AccountOverviewOptionals } from "./AccountOverview/AccountOverview.optionals"; 
import { JointAccountOptionals } from "./JointAccount/JointAccount.optionals"; 
import { OccupationAndIncomeSummaryOptionals } from "./OccupationAndIncomeSummary/OccupationAndIncomeSummary.optionals"; 
import { EAccountsSummaryOptionals } from "./EAccountsSummary/EAccountsSummary.optionals"; 
import { ETransferOptionals } from "./ETransfer/ETransfer.optionals"; 
import { CreateEAccountOptionals } from "./CreateEAccount/CreateEAccount.optionals"; 
import { ChequeCreditbooksOptionals } from "./ChequeCreditbooks/ChequeCreditbooks.optionals"; 
import { RepeatingOptionals } from "./Repeating/Repeating.optionals"; 
import { PostCodeDemoOptionals } from "./PostCodeDemo/PostCodeDemo.optionals"; 

const simpleMessagesConfig = simpleMessagesPageConfig<FState, string, Context> (  Loading )
const identity = identityOptics<FState> ();
export const pages: MultiPageDetails<FState, Context> = {
    HelloWorld: {pageType: 'MainPage',  config: simpleMessagesConfig, lens: identity.focusQuery ( 'HelloWorld' ), pageFunction: HelloWorldPage(), initialValue: {"main":{"hello":"World"}}, pageMode: 'view',namedOptionals: HelloWorldOptionals },
    AccountOverview: {pageType: 'MainPage',  config: simpleMessagesConfig, lens: identity.focusQuery ( 'AccountOverview' ), pageFunction: AccountOverviewPage(), initialValue: undefined, pageMode: 'view',namedOptionals: AccountOverviewOptionals },
    JointAccount: {pageType: 'MainPage',  config: simpleMessagesConfig, lens: identity.focusQuery ( 'JointAccount' ), pageFunction: JointAccountPage(), initialValue: {"joint":false}, pageMode: 'view',namedOptionals: JointAccountOptionals },
    OccupationAndIncomeSummary: {pageType: 'MainPage',  config: simpleMessagesConfig, lens: identity.focusQuery ( 'OccupationAndIncomeSummary' ), pageFunction: OccupationAndIncomeSummaryPage(), initialValue: {"selectedItem":0,"occupation":{"search":"","selectedOccupationName":"","searchResults":[]},"mainOrJoint":false}, pageMode: 'view',namedOptionals: OccupationAndIncomeSummaryOptionals },
    EAccountsSummary: {pageType: 'MainPage',  config: simpleMessagesConfig, lens: identity.focusQuery ( 'EAccountsSummary' ), pageFunction: EAccountsSummaryPage(), initialValue: {}, pageMode: 'view',namedOptionals: EAccountsSummaryOptionals },
    ETransfer: {pageType: 'MainPage',  config: simpleMessagesConfig, lens: identity.focusQuery ( 'ETransfer' ), pageFunction: ETransferPage(), initialValue: {"fromApi":{}}, pageMode: 'create',namedOptionals: ETransferOptionals },
    CreateEAccount: {pageType: 'MainPage',  config: simpleMessagesConfig, lens: identity.focusQuery ( 'CreateEAccount' ), pageFunction: CreateEAccountPage(), initialValue: {"editing":{"name":"","type":"savings","savingsStyle":"adhoc","initialAmount":0}}, pageMode: 'create',namedOptionals: CreateEAccountOptionals },
    ChequeCreditbooks: {pageType: 'MainPage',  config: simpleMessagesConfig, lens: identity.focusQuery ( 'ChequeCreditbooks' ), pageFunction: ChequeCreditbooksPage(), initialValue: {}, pageMode: 'view',namedOptionals: ChequeCreditbooksOptionals },
    Repeating: {pageType: 'MainPage',  config: simpleMessagesConfig, lens: identity.focusQuery ( 'Repeating' ), pageFunction: RepeatingPage(), initialValue: {"selectedItem":0}, pageMode: 'view',namedOptionals: RepeatingOptionals },
    PostCodeDemo: {pageType: 'MainPage',  config: simpleMessagesConfig, lens: identity.focusQuery ( 'PostCodeDemo' ), pageFunction: PostCodeDemoPage(), initialValue: {"main":{},"postcode":{"search":"","searchResults":[],"addressResults":{"line1":"","line2":"","line3":"","line4":""}}}, pageMode: 'edit',namedOptionals: PostCodeDemoOptionals },
    ExcessInfoSearch: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: ExcessInfoSearchPage()},
    Reason: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: ReasonPage()},
    ExcessHistory: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: ExcessHistoryPage()},
    ArrearsDetails: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: ArrearsDetailsPage()},
    AccountFlags: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: AccountFlagsPage()},
    JointAccountEditModalPage: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: JointAccountEditModalPagePage()},
    OccupationIncomeModal: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: OccupationIncomeModalPage()},
    AdditionalInformationModal: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: AdditionalInformationModalPage()},
    BusinessDetailsModal: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: BusinessDetailsModalPage()},
    OtherSourcesOfIncomeModal: {pageType: 'ModalPopup',  config: simpleMessagesConfig,  pageFunction: OtherSourcesOfIncomeModalPage()},
    ListOccupationsModal: {pageType: 'ModalPopup',  config: simpleMessagesConfig,  pageFunction: ListOccupationsModalPage()},
    CreatePlan: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: CreatePlanPage()},
    OrderChequeBookOrPayingInModal: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: OrderChequeBookOrPayingInModalPage()},
    RepeatingLine: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: RepeatingLinePage()},
    PostCodeSearch: {pageType: 'ModalPage',  config: simpleMessagesConfig,  pageFunction: PostCodeSearchPage()}
  }
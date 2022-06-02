import { ExampleDataD, ExampleMainPage, ExampleModalPage, ExampleRepeatingD } from "../common";
import { NatNumDd } from "../../common/dataD";
import { TableCD } from "../../common/componentsD";
import { AuthoriseChargesSummaryDD, chargesSummaryDetailDD, OneBrandDD, OneChargeDataDD, SelectOneBrandDD, summaryOfChargesDateDD, summaryOfChargesDateTableDD, summaryOfChargesSearchDD } from "./authoriseCharges.dataD";
import { AuthorisedChargesRD, SelectOneBrandPageRD, SummaryOfChargeDatesRD, SummaryOfChargesRD } from "./authoriseCharges.restD";
import { HideButtonsCD } from "../../buttons/hideButtonsCD";

export const SummaryOfChargesPage: ExampleModalPage = {
  name: 'SummaryOfCharges',
  pageType: 'ModalPopup',
  modes: [ 'view' ],
  display: { dataDD: chargesSummaryDetailDD, target: '~/summaryOfCharges' },
  buttons: {
    close: { control: "ModalCancelButton" },
  }
}

export const SelectChargesDatePage: ExampleModalPage = {
  name: 'SelectChargesDate',
  pageType: 'ModalPage',
  modes: [ 'view', 'edit' ],
  display: { dataDD: summaryOfChargesSearchDD, target: '~/summaryOfChargesDates' },
  buttons: {
    cancel: { control: 'ModalCancelButton' },
    commit: { control: 'ModalCommitButton' }
  }
}
export const ViewChargesPage: ExampleModalPage = {
  name: 'ViewCharges',
  pageType: 'ModalPage',
  modes: [ 'view', 'edit' ],
  layout: { component: HideButtonsCD, displayParams: { hide: [ 'selectDate' ] } },
  display: { dataDD: AuthoriseChargesSummaryDD, target: '~/authorisedCharges' },
  buttons: {
    selectDate: {
      control: 'ModalButton', text: 'list', modal: SelectChargesDatePage, mode: 'view', focusOn: '~/summaryOfChargesDates',
      copy: { from: '#authorisedDate', to: '~/summaryOfChargesDates/date' },
      copyOnClose: { from: '~/selectedDateItem/dateCreated', to: '#authorisedDate' },
    },
    approvePendingFees: { control: "ActionButton", path: '#editingData', text: 'Approve Pending Fees', action: 'approvePendingFees' },
    authoriseApprovedFees: { control: "ActionButton", path: '#editingData', text: 'Authorise Approved Fees', action: 'authoriseApprovedFees' },
    summary: { control: 'ModalButton', modal: SummaryOfChargesPage, mode: 'view', focusOn: '~/summaryOfCharges' },
    save: { control: 'RestButton', restName: 'authorisedCharges', action: 'update', deleteOnSuccess: '#fromApi' },
  }
}
export const AuthoriseChargesPD: ExampleMainPage = {
  name: 'AuthoriseCharges',
  pageType: "MainPage",
  modals: [ { modal: ViewChargesPage }, { modal: SummaryOfChargesPage }, { modal: SelectChargesDatePage } ],
  display: { target: '~/brand', dataDD: SelectOneBrandDD },
  domain: {
    brand: { dataDD: SelectOneBrandDD },
    selectedIndex: { dataDD: NatNumDd },
    selectedItem: { dataDD: OneBrandDD },
    authorisedCharges: { dataDD: AuthoriseChargesSummaryDD },
    selectedCharge: {dataDD: OneChargeDataDD},
    selectedChargeIndex: {dataDD: NatNumDd},
    summaryOfCharges: { dataDD: chargesSummaryDetailDD },

    summaryOfChargesDates: { dataDD: summaryOfChargesSearchDD },
    selectedDateIndex: { dataDD: NatNumDd },
    selectedDateItem: { dataDD: summaryOfChargesDateDD },
  },
  guards: {
    brandSelected: { condition: 'isDefined', path: '~/selectedIndex' }
  },
  variables:{
    fromApi:{constructedBy: 'path', path: '~/authorisedCharges/fromApi'},
    searchResults:{constructedBy: 'path', path: '~/summaryOfChargesDates/searchResults'},
    authorisedDate:{constructedBy: 'path', path: '~/authorisedCharges/date'},
    authorisedCharges:{constructedBy: 'path', path: '~/authorisedCharges'},
    editingData:{constructedBy: 'path', path: '~/authorisedCharges/fromApi/editingData'},
  },
  rest: {
    loadBrand: { rest: SelectOneBrandPageRD, targetFromPath: '~/brand', fetcher: true },
    authorisedCharges: { rest: AuthorisedChargesRD, targetFromPath: '~/authorisedCharges/fromApi', fetcher: true },
    summaryOfChargeDates: { rest: SummaryOfChargeDatesRD, targetFromPath: '~/summaryOfChargesDates/searchResults', fetcher: true },
    summaryOfCharges: { rest: SummaryOfChargesRD, targetFromPath: '~/summaryOfCharges', fetcher: true }
  },
  initialValue: {
    authorisedCharges: { date: '2020/01/01' }
  },
  modes: [ 'view' ],
  buttons: {
    select: { control: 'ModalButton', modal: ViewChargesPage, mode: 'edit', focusOn: '#authorisedCharges', enabledBy: 'brandSelected' }
  }
}


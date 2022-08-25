import { ExampleMainPage, ExampleModalPage } from "../common";
import { NatNumDd } from "../../common/dataD";
import { AuthoriseChargesSummaryDD, OneBrandDD, OneChargeDataDD, RememberedData, SelectOneBrandDD, SummaryData, summaryOfChargesDateDD, summaryOfChargesSearchDD } from "./authoriseCharges.dataD";
import { AuthorisedChargesRD, SelectOneBrandPageRD, SummaryOfChargeDatesRD } from "./authoriseCharges.restD";
import { HideButtonsCD } from "../../buttons/hideButtonsCD";
import { StringParam } from "../../common/restD";
import { AuthoriseCustomisation } from "./authoriseCharges.customise";

export function SummaryOfChargesPage ( c: AuthoriseCustomisation ): ExampleModalPage {
  return {
    name: 'SummaryOfCharges',
    pageType: 'ModalPopup',
    modes: [ 'view' ],
    display: { dataDD: SummaryData ( c ), target: '~/summaryOfCharges' },
    buttons: {
      close: { control: "ModalCancelButton" },
    }
  }
}

export function SelectChargesDatePage ( c: AuthoriseCustomisation ): ExampleModalPage {
  return {
    name: 'SelectChargesDate',
    pageType: 'ModalPage',
    modes: [ 'view', 'edit' ],
    display: { dataDD: summaryOfChargesSearchDD ( c ), target: '~/summaryOfChargesDates' },
    buttons: {
      cancel: { control: 'ModalCancelButton' },
      commit: { control: 'ModalCommitButton' }
    }
  }
}
export function ViewChargesPage ( c: AuthoriseCustomisation ): ExampleModalPage {
  return {
    name: 'ViewCharges',
    pageType: 'ModalPage',
    modes: [ 'view', 'edit' ],
    layout: { component: HideButtonsCD, displayParams: { hide: [ 'selectDate' ] } },
    display: { dataDD: AuthoriseChargesSummaryDD ( c ), target: '~/authorisedCharges' },
    guards: {
      somethingSelected: { condition: 'isDefined', path: '~/selectedCharge' }
    },
    buttons: {
      selectDate: {
        control: 'ModalButton', text: 'list', modal: SelectChargesDatePage ( c ), mode: 'view', focusOn: '~/summaryOfChargesDates',
        copy: { from: '#authorisedDate', to: '~/summaryOfChargesDates/date' },
        copyOnClose: { from: '~/selectedDateItem/dateCreated', to: '#authorisedDate' },
      },
      approvePendingFees: {
        control: "ActionButton", path: '#editingData',
        // paths: { pathRepeated: '#editingData', otherData: '~/selectedDateItem/dateCreated' },
        text: 'Approve Pending Fees', action: 'approvePendingFees'
      },
      authoriseApprovedFees: { control: "ActionButton", path: '#editingData', text: 'Authorise Approved Fees', action: 'authoriseApprovedFees' },
      summary: {
        enabledBy: 'somethingSelected',
        control: 'ModalButton', modal: SummaryOfChargesPage ( c ),
        copy: { from: '~/authorisedCharges/fromApi/editingData' },
        mode: 'view', focusOn: '~/summaryOfCharges'
      },
      save: { control: 'RestButton', restName: 'authorisedCharges', action: 'update', deleteOnSuccess: '#fromApi' },
    }
  }
}
export function AuthoriseChargesPD ( c: AuthoriseCustomisation ): ExampleMainPage {
  return {
    name: c.pageName,
    pageType: "MainPage",
    commonParams: {
      today: { ...StringParam, commonLens: 'today', testValue: '29/07/2022' },
      operatorName: { ...StringParam, commonLens: 'operatorName', testValue: 'Phil' }
    },
    initialValue: [ { command: 'copy', from: '/CommonIds/today', to: '~/authorisedCharges/date' } ],
    modals: [ { modal: ViewChargesPage ( c ) }, { modal: SummaryOfChargesPage ( c ) }, { modal: SelectChargesDatePage ( c ) } ],
    display: { target: '~/brand', dataDD: SelectOneBrandDD ( c ) },
    domain: {
      brand: { dataDD: SelectOneBrandDD ( c ) },
      selectedIndex: { dataDD: NatNumDd },
      selectedItem: { dataDD: OneBrandDD ( c ) },
      authorisedCharges: { dataDD: AuthoriseChargesSummaryDD ( c ) },
      selectedCharge: { dataDD: OneChargeDataDD ( c ) },
      selectedChargeIndex: { dataDD: NatNumDd },
      summaryOfCharges: { dataDD: SummaryData ( c ) },
      selectedChargeItem: { dataDD: RememberedData ( c ) },

      summaryOfChargesDates: { dataDD: summaryOfChargesSearchDD ( c ) },
      selectedDateIndex: { dataDD: NatNumDd },
      selectedDateItem: { dataDD: summaryOfChargesDateDD ( c ) },
    },
    guards: {
      brandSelected: { condition: 'isDefined', path: '~/selectedIndex' },
      balanceZero: { condition: 'fn', name: 'balanceZero' }
    },
    variables: {
      fromApi: { constructedBy: 'path', path: '~/authorisedCharges/fromApi' },
      searchResults: { constructedBy: 'path', path: '~/summaryOfChargesDates/searchResults' },
      authorisedDate: { constructedBy: 'path', path: '~/authorisedCharges/date' },
      authorisedCharges: { constructedBy: 'path', path: '~/authorisedCharges' },
      editingData: { constructedBy: 'path', path: '~/authorisedCharges/fromApi/editingData' },
      originalData: { constructedBy: 'path', path: '~/authorisedCharges/fromApi/originalData' },
    },
    rest: {
      loadBrand: { rest: SelectOneBrandPageRD ( c ), targetFromPath: '~/brand', fetcher: true },
      authorisedCharges: {
        rest: AuthorisedChargesRD ( c ), targetFromPath: '~/authorisedCharges/fromApi/editingData', fetcher: true,
        postFetchCommands: [
          { command: 'message', msg: 'loading the authorised charges' },
          { command: 'copyResult', from: '', to: '~/authorisedCharges/fromApi/originalData' }
        ]
      },
      summaryOfChargeDates: { rest: SummaryOfChargeDatesRD ( c ), targetFromPath: '~/summaryOfChargesDates/searchResults', fetcher: true },
      // summaryOfCharges: { rest: SummaryOfChargesRD, targetFromPath: '~/summaryOfCharges', fetcher: true }
    },
    modes: [ 'view' ],
    buttons: {
      select: { control: 'ModalButton', modal: ViewChargesPage ( c ), mode: 'edit', focusOn: '#authorisedCharges', enabledBy: 'brandSelected' }
    }
  }
}


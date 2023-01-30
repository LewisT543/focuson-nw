import {ExampleMainPage, ExampleModalPage} from "../common";
import {datesDataD, datesPageModalWithDatepickerDD} from "./dates.dataD";
import {datesRestD} from "./dates.restD";


const datesPageModal: ExampleModalPage = {
  pageType: 'ModalPopup',
  display: { dataDD: datesPageModalWithDatepickerDD, target: '~/datepickerModal' },
  modes: [ 'edit' ],
  name: "DatesPageModal",
  buttons: {
    cancel: { control: 'ModalCancelButton' },
  },
}

export const DatesPageD: ExampleMainPage = {
  name: "Dates", pageType: 'MainPage',
  display: { dataDD: datesDataD, target: '~/dates' },
  domain: {
    dates: { dataDD: datesDataD }
  },
  rest: {
    notUsed: { rest: datesRestD, targetFromPath: "~/dates" }
  },
  guards: {
    before: { condition: 'before', aPath: '~/dates/empty', bPath: '~/dates/value'},
    beforeOrEquals: { condition: 'beforeOrEquals', aPath: '~/dates/empty', bPath: '~/dates/value' },
    afterOrEquals: { condition: 'afterOrEquals', aPath: '~/dates/empty', bPath: '~/dates/value' },
    after: { condition: 'after', aPath: '~/dates/empty', bPath: '~/dates/value'},
    equals: {condition: 'a=b',aPath: '~/dates/empty', bPath :  '~/dates/value' },
  },
  initialValue: 'empty',
  modals: [], modes: [ 'edit' ],
  buttons: {
    validateButton: { control: "ValidationButton" },
    exampleButtonWithValidation: { control: 'RestButton', validate: true, restName: 'notUsed', action: 'get' },
    openDatesModal: { control: 'ModalButton', modal: datesPageModal, buttonType: 'primary', mode: 'edit', focusOn: '~/datepickerModal' }
  }
}
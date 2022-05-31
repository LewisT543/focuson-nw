import { ExampleDataD, ExampleRepeatingD } from "../common";
import { BooleanDD, DateDD, ManyDataDD, MoneyDD, StringDD, stringPrimDD, StringPrimitiveDD } from "../../common/dataD";
import { DropDownCD, LabelAndDropDownCD, LabelAndRadioCD, LayoutCd, TableCD } from "../../common/componentsD";
import { AllGuards } from "../../buttons/guardButton";

export const PaymentTypeDd: StringPrimitiveDD = {
  ...stringPrimDD,
  name: 'PaymentType',
  description: "A payment type",
  display: LabelAndDropDownCD,
  displayParams: { pleaseSelect: 'Please select' },
  enum: { e: "Express money transfer", c: 'Chaps' }
}

export const ChargeDetailsEnum: StringPrimitiveDD = {
  ...stringPrimDD,
  name: 'ChargeDetailsEnum',
  description: "How the charges will be paid",
  display: LabelAndRadioCD,
  // displayParams: { vertical: true },
  enum: { 1: 'Debited from Payees one account', d: "Debited from draft account", o: 'Other account' }
}
export const CurrencyEnum: StringPrimitiveDD = {
  ...stringPrimDD,
  name: 'CurrencyEnum',
  description: "Euros or GBP",
  display: DropDownCD,
  enum: { GBP: "GBP", E: "Euros" }
}
export const ChapsPaymentTypeDD: StringPrimitiveDD = {
  ...stringPrimDD,
  name: 'ChapsPaymentType',
  description: "",
  display: LabelAndRadioCD,
  // displayParams: { pleaseSelect: 'Please select' },
  enum: { N: "Notify and pay", P: "Pay on personal application" }
}

export const SummaryOfPaymentsLineDD: ExampleDataD = {
  description: "This is the data loaded from the backend for one line.",
  name: "SummaryOfPaymentsLine",
  structure: {
    currency: { dataDD: StringDD, sample: [ 'Euro', 'GBP' ] },
    nameOfPayee: { dataDD: StringDD, sample: [ 'Bob', 'Phil', 'Andrew' ] },
    sterlingAmount: { dataDD: MoneyDD, sample: [ 123, 2345, 5654 ] },
    currencyAmount: { dataDD: MoneyDD, sample: [ 222, 333, 444 ] },
    amtInWords: { dataDD: StringDD, sample: [ 'one hundred', 'two hundred', 'three hundred' ] },
    forActionOn: { dataDD: DateDD, sample: [ '2022/12/5', '2022/12/6' ] },
    dateCreated: { dataDD: DateDD },
    status: { dataDD: StringDD, sample: [ 'cancel', 'paid', '' ] },
  }
}
export const SummaryOfPaymentsTableDD: ExampleRepeatingD = {
  name: "SummaryOfPaymentsTable",
  description: "",
  dataDD: SummaryOfPaymentsLineDD,
  display: TableCD,
  displayParams: {
    order: [ 'nameOfPayee', 'currency', 'sterlingAmount', 'currencyAmount', 'dateCreated', 'forActionOn', 'status' ],
    copySelectedIndexTo: [ 'selectedPaymentIndex' ],
    copySelectedItemTo: [ 'selectedPayment' ]
  },
  paged: false
}

export const ChargeDetailsDD: ExampleDataD = {
  name: 'ChargeDetails',
  description: '',
  structure: {
    debitedFrom: { dataDD: ChargeDetailsEnum },

  }
}

export const amountDD: ExampleDataD = {
  name: 'Amount',
  description: '',
  layout: { component: LayoutCd, displayParams: { details: '[[1,1,1], [1]]' } },
  guards: {
    sterlingDefined: { condition: '>0', path: 'sterlingAmount' },
    currencyDefined: { condition: '>0', path: 'currencyAmount' }
  },
  structure: {
    currency: { dataDD: CurrencyEnum },
    sterlingAmount: { dataDD: MoneyDD, sample: [ 123, 2345, 5654 ] },
    currencyAmount: { dataDD: MoneyDD, sample: [ 222, 333, 444 ] },
    amountInWords: { dataDD: StringDD, sample: [ 'one hundred', 'two hundred', 'three hundred' ] },
  }

}

export const PayeeBankDD: ExampleDataD = {
  name: 'PayeeBank',
  description: '',
  // layout: { component: LayoutCd, displayParams: { details: '[[1,7]]' } },
  structure: {
    name: { dataDD: StringDD },
    addressLine1: { dataDD: StringDD },
    addressLine2: { dataDD: StringDD },
    addressLine3: { dataDD: StringDD },
    addressLine4: { dataDD: StringDD },
    addressLine5: { dataDD: StringDD },
    country: { dataDD: StringDD },
    postcode: { dataDD: StringDD },
  }
}
export const PayeeDetailsDD: ExampleDataD = {
  name: 'PayeeDetails',
  description: '',
  // layout: { component: LayoutCd, displayParams: { details: '[[2,1]]' } },
  structure: {
    addressLine1: { dataDD: StringDD },
    addressLine2: { dataDD: StringDD },
    addressLine3: { dataDD: StringDD },
    addressLine4: { dataDD: StringDD },
    addressLine5: { dataDD: StringDD },
  }
}

export const ExpressDetailsDD: ExampleDataD = {
  name: 'ExpressDetails',
  description: '',
  layout: { component: LayoutCd, displayParams: { details: '[[1,1]]' } },
  structure: {
    payeeBank: { dataDD: PayeeBankDD },
    payeeDetails: { dataDD: PayeeDetailsDD },
    paymentType: { dataDD: ChapsPaymentTypeDD }
  }
}
export const ChapDetailsDD: ExampleDataD = {
  name: 'ChapDetails',
  description: '',
  layout: { component: LayoutCd, displayParams: { details: '[[6,5]]' } },
  structure: {
    sortCode: { dataDD: StringDD },
    payeeAccountNumber: { dataDD: StringDD },
    payeeAccountType: { dataDD: StringDD },
    firstName: { dataDD: StringDD },
    lastName: { dataDD: StringDD },
    paymentType: { dataDD: StringDD },
    payeeNotification: { dataDD: BooleanDD },
    payeesBank: { dataDD: StringDD },
    payeesBranch: { dataDD: StringDD },
    reference: { dataDD: StringDD },
    informationForPayeesBank: { dataDD: StringDD },
    anyAdditionalInformation: { dataDD: StringDD },
  }
}


export const PaymentDD: ExampleDataD = {
  name: 'Payment',
  description: '',
  layout: { component: LayoutCd, displayParams: { details: '[[2,1]]' } },
  guards: { paymentType: { condition: 'in', path: 'paymentType', values: PaymentTypeDd.enum } },
  structure: {
    paymentType: { dataDD: PaymentTypeDd },
    nameOfPayee: { dataDD: StringDD, sample: [ 'Bob', 'Phil', 'Andrew' ] },
    amount: { dataDD: amountDD },
    forActionOn: { dataDD: DateDD, sample: [ '2022/12/5', '2022/12/6' ] },
    chargeDetails: { dataDD: ChargeDetailsDD },
    chapsDetails: { dataDD: ChapDetailsDD, guard: { paymentType: [ 'c' ] } },
    expressDetails: { dataDD: ExpressDetailsDD, guard: { paymentType: [ 'e' ] } }
  }
}

export const PaymentsLaunchDD: ExampleDataD = {
  description: "",
  name: "PaymentsMain",
  structure: {
    payment: { dataDD: PaymentDD },
    summaryOfPaymentsTable: { dataDD: SummaryOfPaymentsTableDD }
  }
}

import { ExampleDataD, ExampleRepeatingD } from "../common";
import { DateDD, IntegerDD, MoneyDD, MoneyStringDD, NumberPrimitiveDD, OneLineStringDD, PositiveMoneyDD, StringDD, StringPrimitiveDD } from "../../common/dataD";
import { LabelAndDropDownCD, LayoutCd, StructureTableCD, TableCD } from "../../common/componentsD";
import { collectionHistoryTableDD } from "../database/tableNames";

export const paymentReasonDD: StringPrimitiveDD = {
  ...OneLineStringDD,
  name: 'PaymentReason',
  description: "An enum about why the payment is being mad",
  display: LabelAndDropDownCD,
  displayParams: { required: true, pleaseSelect: 'Select...' },
  enum: { 'A': 'Allowance', 'O': 'Overpayment' }
}
export const periodDD: StringPrimitiveDD = {
  ...OneLineStringDD,
  name: 'A Period',
  description: "An enum for monthly/yearly etc",
  display: LabelAndDropDownCD,
  enum: { 'Monthly': 'Monthly', 'Yearly': 'Yearly' }
}
export const paymentStatus: StringPrimitiveDD = {
  ...OneLineStringDD,
  name: 'The status of a payment',
  description: "An enum that describes the lifecycles phases of the payment",
  display: LabelAndDropDownCD,
  enum: { 'COLLECTED': 'COLLECTED', 'CANCELLED': 'CANCELLED' }
}

const AccountDD: NumberPrimitiveDD = {
  ...IntegerDD,
  name: "Account",
  validate: { min: 0, max: 99999999, step: 1, required: true }
}


export const SortCodePartDD: StringPrimitiveDD = {
  ...OneLineStringDD,
  validate: { pattern: '^[0-9][0-9]$' }
}

export const SortCodeDD: ExampleDataD = {
  name: 'SortCode',
  description: 'All the data displayed on the screen',
  structure: {
    one: { dataDD: SortCodePartDD, sample: [ '10', '20' ] },
    two: { dataDD: SortCodePartDD, sample: [ '11', '12' ] },
    three: { dataDD: SortCodePartDD, sample: [ '23', '24' ] }
  }
}

export const MandateDD: ExampleDataD = {
  name: 'Mandate',
  description: 'All the data displayed on the screen',
  layout: { component: LayoutCd, displayParams: { details: '[[3,3]]' } },
  structure: {
    sortCode: { dataDD: SortCodeDD },
    accountId: { dataDD: AccountDD, sample: [ 12341234, 23456123, 3245454 ] },
    mandateStatus: { dataDD: StringDD, sample: [ 'ACTIVE' ] },
    bankName: { dataDD: StringDD, sample: [ 'Bank Of Happiness', 'Royal Bank of Success' ], }, // validate: { pattern: "^[0-9A-Za-z .,']$" } },
    accountName: { dataDD: StringDD, sample: [ 'F & J Bloggs' ] },
    mandateRef: { dataDD: StringDD, sample: [ '12099845-34', '12099845-78' ] }
  }
}


export const MandateListDD: ExampleRepeatingD = {
  name: "MandateList",
  description: "The list of mandates that we display in the search results for 'select mandate'",
  display: TableCD,
  displayParams: {
    order: [ "sortCode", 'accountId', 'bankName', 'accountName', 'mandateRef', "mandateStatus" ],
    copySelectedItemTo: [ 'tempMandate' ],
    copySelectedIndexTo: [ 'selectIndex' ],
    prefixFilter: '~/selectMandateSearch/sortCode',
    joiners: '-',
    prefixColumn: 'sortCode'
  },
  sampleCount: 5,
  dataDD: MandateDD,
  paged: false
}
export const MandateSearchDD: ExampleDataD = {
  name: 'MandateSearch',
  description: "The search sortcode and search results for a 'select mandate'",
  structure: {
    sortCode: { dataDD: StringDD, sample: [ '10-11-12', '23-54-12' ], displayParams: { required: false } },
    searchResults: { dataDD: MandateListDD },
  }
}

export const CollectionSummaryDD: ExampleDataD = {
  name: 'CollectionSummary',
  description: 'The four most important things about collection for a mandate, plus a couple of things we need to create a payment',
  layout: { component: LayoutCd, displayParams: { details: '[[2,2]]' } },
  structure: {
    lastCollectionDate: { dataDD: StringDD, sample: [ '2021/10/6', '2021/12/5' ] },
    lastCollectionAmount: { dataDD: MoneyStringDD, sample: [ '12.34', '4564.55' ] },
    nextCollectionDate: { dataDD: StringDD, sample: [ '2022/10/6', '2022/12/6' ] },
    nextCollectionAmount: { dataDD: MoneyStringDD, sample: [ '134.34', '1234.55' ] },
    accountType: { dataDD: {...IntegerDD, resolver: 'getAccountType'},  hidden: true, sample: [ 8, 12, 16 ] },
    allowance: { dataDD: MoneyDD, sample: [ 1000, 2000 ], hidden: true },
    period: { dataDD: periodDD, hidden: true },
  }
}


export const CreatePaymentDD: ExampleDataD = {
  name: 'CreatePayment',
  description: 'The data needed to make a payment',
  guards: { reasonIsAllowance: { condition: 'in', path: 'reason', values: paymentReasonDD.enum } },
  structure: {
    "tempForConditionalSet_1234": { dataDD: StringDD, sample: [ '1234' ] },
    newVal: { dataDD: StringDD },
    amount: { dataDD: MoneyStringDD, sample: [ '566.57', '328.34' ] },//, displayParams: { min: 200 } },
    collectionDate: { dataDD: DateDD },
    reason: { dataDD: paymentReasonDD },
    allowance: { dataDD: MoneyDD, guard: { reasonIsAllowance: [ 'A' ] }, displayParams: { readonly: true } },
    period: { dataDD: periodDD, guard: { reasonIsAllowance: [ 'A' ] }, displayParams: { readonly: true } },
    copyFrom: { dataDD: StringDD },
    copyTo: { dataDD: MoneyDD }
  }
}

export const CollectionItemDD: ExampleDataD = {
  name: 'CollectionItem',
  description: 'All the data displayed on the screen',
  table: collectionHistoryTableDD,
  structure: {
    paymentId: { dataDD: IntegerDD, db: 'id' },
    collectionDate: { dataDD: DateDD, db: 'collection_date' },
    amount: { dataDD: MoneyStringDD, db: { table: collectionHistoryTableDD, field: 'amount', format: { type: 'Double', pattern: '%,2f' } }, sample: [ '566.00', '328.34' ] },
    status: { dataDD: StringDD, db: 'status', sample: [ 'C', 'P' ] }
  }
}

export const CollectionListDD: ExampleRepeatingD = {
  name: "CollectionsList",
  dataDD: CollectionItemDD,
  description: "The list of collections or payments for the selection account",
  display: StructureTableCD,
  displayParams: {
    paths: { cd: "collectionDate", amt: 'amount', sts: 'status' },
    copySelectedIndexTo: [ 'selectedCollectionIndex' ],
    copySelectedItemTo: [ 'selectedCollectionItem' ]
  },
  sampleCount: 4,
  paged: false
}

export const linkedAccountDetailsDD: ExampleDataD = {
  name: 'LinkedAccountDetailsDisplay',
  description: 'All the data displayed on the screen',
  layout: { component: LayoutCd, displayParams: { details: '[[1],[1],[1]]', displayAsCards: true, buttons: {1: ['selectMandate', 'createPayment']} } },
  structure: {
    mandate: { dataDD: MandateDD },
    collectionSummary: { dataDD: CollectionSummaryDD },
    collectionHistory: { dataDD: CollectionListDD }
  }
}
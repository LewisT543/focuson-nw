import { ContactTitle, CustomerStatus, EmploymentType, HowOften, YesNo } from "./occupationAndIncome.domain";
import { DataD, DateDD, IntegerDD, MoneyDD, OneLineStringDD, RepeatingDataD, StringDD, StringPrimitiveDD } from "../../common/dataD";
import { commonParams, DisplayCompD, LabelAndStringInputCD, LayoutCd, SelectedItemCD, TableCD } from "../../common/componentsD";
import { AllGuards } from "../../buttons/guardButton";


/* ---------------- OTHER SOURCES OF INCOME START ---------------- */
export const frequencyDD: StringPrimitiveDD = {
  ...OneLineStringDD,
  sample: [ 'Annual', 'Monthly' ],
  name: 'Frequency',
  description: "Income frequency",
  // display: DropDownCD,
  enum: HowOften
}
export const otherIncomeResponseDD: DataD<AllGuards> = {
  name: "OtherIncomeResponse",
  description: "This is a summary about other income data of a single record",
  structure: {
    clientOtherIncomeSeq: { dataDD: StringDD },
    otherIncomeType: { dataDD: StringDD },
    incomeFreqRef: { dataDD: frequencyDD },
    amount: { dataDD: IntegerDD }
  }
}
export const otherSourcesOfIncomeDataDD: RepeatingDataD<AllGuards> = {
  paged: false,
  display: TableCD,
  name: "OtherIncomeData",
  description: "This is a summary about other income data",
  displayParams: { order: { value: [ 'otherIncomeType', 'incomeFreqRef', 'amount' ] } },
  dataDD: otherIncomeResponseDD
}
/* ---------------- OTHER SOURCES OF INCOME END ---------------- */

/* ---------------- SELF EMPLOYED ADDITIONAL INFORMATION START ---------------- */
export const businessDetailsDD: DataD<AllGuards> = {
  name: 'BusinessDetails',
  description: 'This is a summary about business details data',
  structure: {
    applicantName: { dataDD: StringDD },
    businessName: { dataDD: StringDD },
    addressLine1: { dataDD: OneLineStringDD },
    addressLine2: { dataDD: OneLineStringDD },
    addressLine3: { dataDD: OneLineStringDD },
    addressLine4: { dataDD: OneLineStringDD },
    postcode: { dataDD: StringDD }
  }
}
export const businessFinancialDetailsDD: DataD<AllGuards> = {
  name: 'BusinessFinancialDetails',
  description: 'This is a summary about business financial details data',
  structure: {
    turnoverLastYear: { dataDD: StringDD },
    turnoverPenultimateYear: { dataDD: StringDD },
    netProfitLastYear: { dataDD: StringDD },
    netProfitPenultimateYear: { dataDD: StringDD },
    drawingsLastYear: { dataDD: StringDD },
    drawingsPenultimateYear: { dataDD: StringDD },
    dividendsLastYear: { dataDD: StringDD },
    dividendsPenultimateYear: { dataDD: StringDD },
    netAssetsLastYear: { dataDD: StringDD },
    netAssetsPenultimateYear: { dataDD: StringDD },
  }
}
export const detailsOfNonRecurringItemsDD: DataD<AllGuards> = {
  name: 'DetailsOfNonRecurringItems',
  description: 'This is a summary about details of non-recurring items data',
  structure: {
    nonRecurringItems: { dataDD: StringDD }
  }
}
export const detailsOfReevaluationOfAssetsDD: DataD<AllGuards> = {
  name: 'DetailsOfReevaluationOfAssets',
  description: 'This is a summary about details of reevaluations of assets data',
  structure: {
    revaluationOfAssets: { dataDD: StringDD }
  }
}
export const contactTitleDD: StringPrimitiveDD = {
  ...OneLineStringDD,
  sample: [ 'Mr', 'Mrs' ],
  name: 'ContactTitle',
  description: "contact title to address with",
  // display: DropDownCD,
  enum: ContactTitle
}
export const accountDetailsDD: DataD<AllGuards> = {
  name: 'AccountDetails',
  description: 'This is a summary about account details data',
  structure: {
    contactTitle: { dataDD: contactTitleDD },
    contactForename: { dataDD: StringDD },
    contactSurname: { dataDD: StringDD },
    practice: { dataDD: StringDD },
    addressLine1: { dataDD: StringDD },
    addressLine2: { dataDD: StringDD },
    addressLine3: { dataDD: StringDD },
    addressLine4: { dataDD: StringDD },
    postcode: { dataDD: StringDD },
    telephone: { dataDD: StringDD }
  }
}
export const selfEmployedAdditionalInformationDD: DataD<AllGuards> = {
  name: 'SelfEmployedAdditionalInformation',
  description: 'This is a summary about self employed additional information data',
  structure: {
    businessDetails: { dataDD: businessDetailsDD },
    businessFinancialDetails: { dataDD: businessFinancialDetailsDD },
    detailsOfNonRecurringItems: { dataDD: detailsOfNonRecurringItemsDD },
    detailsOfReevaluationOfAssets: { dataDD: detailsOfReevaluationOfAssetsDD },
    accountantDetails: { dataDD: accountDetailsDD }
  }
}
/* ---------------- SELF EMPLOYED ADDITIONAL INFORMATION END ---------------- */

/* ---------------- EMPLOYED ADDITIONAL INFORMATION START ---------------- */
export const employmentAdditionalInformationDD: DataD<AllGuards> = {
  name: 'EmployedAdditionalInformation',
  description: 'This is a summary about employed additional information data',
  structure: {
    applicantName: { dataDD: StringDD },
    employerName: { dataDD: StringDD },
    addressLine1: { dataDD: StringDD },
    addressLine2: { dataDD: StringDD },
    addressLine3: { dataDD: StringDD },
    addressLine4: { dataDD: StringDD },
    postcode: { dataDD: StringDD },
  }
}
/* ---------------- EMPLOYED ADDITIONAL INFORMATION END ---------------- */

/* ---------------- OCCUPATION AND INCOME DETAILS START ---------------- */
export const occupationDetailsPageCD: DisplayCompD = {
  import: './components/Optional/Optional',
  name: "OccupationDetailsPage",
  params: {}
}

export const yesNoDD: StringPrimitiveDD = {
  ...OneLineStringDD,
  name: 'YesNo',
  description: "yes/no enum",
  // display: DropDownCD,
  enum: YesNo
}
export const customerStatusDD: StringPrimitiveDD = {
  ...OneLineStringDD,
  name: 'CustomerStatus',
  description: "Customer status enum",
  // display: DropDownCD,

  enum: CustomerStatus
}
export const employmentTypeDD: StringPrimitiveDD = {
  ...OneLineStringDD,
  name: 'EmploymentType',
  description: "Employment contract type",
  // display: DropDownCD,
  enum: EmploymentType
}
export const occupationIncomeDetailsDD: DataD<AllGuards> = {
  name: "OccupationIncomeDetails",
  description: "This is a summary about occupation income details data of a single occupation",
  guards: { areYou: { condition: 'in', path: [ 'areYou' ], values: customerStatusDD.enum } },
  layout: { component: LayoutCd, displayParams: { details: {value: '[[1],[3,3],[5]]' } }},
  structure: {
    areYou: { dataDD: customerStatusDD },
    currentEmployment: { dataDD: yesNoDD, field: "", guard: { areYou: [ 'E', 'S' ] } },
    occupation: { dataDD: StringDD, guard: { areYou: [ 'E' ] } },
    customerDescription: { dataDD: StringDD, guard: { areYou: [ 'E' ] } },
    ownShareOfTheCompany: { dataDD: yesNoDD, guard: { areYou: [ 'E' ] } },
    owningSharesPct: { dataDD: yesNoDD, guard: { areYou: [ 'E' ] } },
    workFor: { dataDD: StringDD, guard: { areYou: [ 'E' ]} },
    employmentType: { dataDD: employmentTypeDD, guard: { areYou: [ 'E' ] } },
    annualSalaryBeforeDeduction: { dataDD: IntegerDD },
    annualIncomeExcludingRent: { dataDD: MoneyDD },
    regularCommissionBonus: { dataDD: IntegerDD },
    dateOfEmploymentStart: { dataDD: DateDD },
    otherSourceOfIncome: { dataDD: yesNoDD },
    createdBy: { dataDD: StringDD },
    createdDate: { dataDD: DateDD },
    employerName: { dataDD: StringDD },
    whatTypeOfBusiness: { dataDD: StringDD },
    whatNameBusiness: { dataDD: StringDD },
    establishedYear: { dataDD: DateDD },
    annualDrawing3Yrs: { dataDD: IntegerDD },
    empStartDate: { dataDD: DateDD },
    empEndDate: { dataDD: DateDD },
    sePositionHeld: { dataDD: StringDD },
    occupationCategory: { dataDD: StringDD },
    empEmploymentSeq: { dataDD: IntegerDD },
    empAppRoleSeq: { dataDD: IntegerDD },
    accountantAppRoleSeq: { dataDD: IntegerDD },
  }
}

export const customerOccupationIncomeDetailsDD: RepeatingDataD<AllGuards> = {
  name: "CustomerOccupationIncomeDetails",
  paged: false,
  display: SelectedItemCD, // TODO create a component that does not display nothing
  description: "This is a summary customer occupations data",
  displayParams: { index: { value: [ 'selectedItem' ] }, display: { value: occupationIncomeDetailsDD.name } },
  dataDD: occupationIncomeDetailsDD
}
export const occupationAndIncomeDetailsDD: DataD<AllGuards> = {
  name: 'OccupationAndIncomeDetails',
  description: 'This is a summary about occupation and income details data',
  structure: {
    regulatoryReport: { dataDD: StringDD, hidden: true },
    mainCustomerName: { dataDD: StringDD },
    jointCustomerName: { dataDD: StringDD, hidden: true },
    mainClientRef: { dataDD: IntegerDD, hidden: true },
    jointClientRef: { dataDD: IntegerDD, hidden: true },
    customerOccupationIncomeDetails: { dataDD: customerOccupationIncomeDetailsDD }
  }
}
/* ---------------- OCCUPATION AND INCOME DETAILS END ---------------- */

/* ---------------- OCCUPATION AND INCOME SUMMARY START ---------------- */
export const occupationAndIncomeSummaryDD: DataD<AllGuards> = {
  name: "OccupationAndIncomeSummary",
  description: "This is the summary data about all the occupation and income details for a single user",
  structure: {
    occupationAndIncomeDetails: { dataDD: occupationAndIncomeDetailsDD },
    employmentAdditionalInformation: { dataDD: employmentAdditionalInformationDD },
    selfEmployedAdditionalInformation: { dataDD: selfEmployedAdditionalInformationDD },
    otherSourcesOfIncome: { dataDD: otherSourcesOfIncomeDataDD }
  }
}
/* ---------------- OCCUPATION AND INCOME SUMMARY END ---------------- */


export const occupationDescriptionResponseDD: DataD<AllGuards> = {
  name: 'OccupationDescriptionResponse',
  description: 'This is a summary about occupation description dropdown',
  structure: {
    descTypeValue: { dataDD: StringDD, hidden: true },
    descTypeName: { dataDD: StringDD, hidden: true },
  }
}

export const ListItemsCD: DisplayCompD = {
  import: '../copied/listItems',
  name: "ListItemsCD",
  params: {
    ...commonParams,
  }
}
export const SearchListCD: DisplayCompD = {
  import: '../copied/searchList',
  name: "SearchList",
  params: { ...commonParams }
}

export const occupationsListDD: RepeatingDataD<AllGuards> = {
  paged: false,
  display: ListItemsCD,
  name: "CustomerOccupationIncomeDetails",
  description: "This is a list of all the occupations",
  dataDD: occupationDescriptionResponseDD
}
export const listOccupationsDD: DataD<AllGuards> = {
  name: "ListOccupations",
  description: "This is the search occupation popup",
  display: SearchListCD,
  structure: {
    searchField: { dataDD: StringDD, displayParams: { label: 'Search: ' } },
    occupationsList: { dataDD: occupationsListDD }
  },
}


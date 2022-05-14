import { ExampleRestD } from "../common";

import { AccountDetailsDD, CurrentPaymentCountsDD, postCodeSearchResponseDD, PrintRecordHistoryDD } from "./listOfPayements.dataD";
import { IntParam, RestD, RestParams, StringParam } from "../../common/restD";
import { onlySchema } from "../database/tableNames";
import { AllGuards } from "../../buttons/guardButton";
import { allCommonIds } from "../commonIds";

export const PrintRecordHistoryParams: RestParams = {
  accountId: { ...IntParam, commonLens: 'accountId', testValue: '123' },
}

export const PrintRecordHistoryRD: ExampleRestD = {
  params: PrintRecordHistoryParams,
  dataDD: PrintRecordHistoryDD,
  url: '/api/printrecordhistory?{query}',
  actions: [ 'get', { state: 'print' } ],
  states: {
    print: { url: '/api/print?{query}', params: [] }
  }
}
export const CurrentPaymentCountsRD: ExampleRestD = {
  params: PrintRecordHistoryParams,
  dataDD: CurrentPaymentCountsDD,
  url: '/api/paymentcounts?{query}',
  actions: [ 'get' ],
}
export const accountAndAddressDetailsRD: ExampleRestD = {
  params: PrintRecordHistoryParams,
  dataDD: AccountDetailsDD,
  url: '/api/payment/accountDetails?{query}',
  actions: [ 'get' ],
}
export const postcodeParams: RestParams = {
  dbName: { ...allCommonIds.dbName },
  postcode: { ...StringParam, lens: '~/addressSearch/postcode', testValue: 'LW12 4RG' }
}
export const postcodeRestD: RestD<AllGuards> = {
  params: postcodeParams,
  dataDD: postCodeSearchResponseDD,
  url: '/api/listOfPayments/postCode?{query}',
  actions: [ 'get' ],
  // initialSql: addressSearchSql,
  // strategy: {type: 'OneTableInsertSqlStrategyForNoIds', table: postCodeSearchTable},
  // tables: {
  //   entity: {
  //     type: 'Main',
  //     table: postCodeSearchTable
  //   },
  //   where: [
  //     { table: postCodeSearchTable, alias: postCodeSearchTable.name, field: 'PC_POSTCODE', paramName: 'postcode', comparator: 'like', paramPrefix: '%', paramPostfix: '%' }
  //   ]
  // }
}
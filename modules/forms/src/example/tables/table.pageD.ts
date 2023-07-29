import { ExampleMainPage } from "../common";
import {TableDisplayDD, TableRowDD} from "./table.dataD";
import { tableRestD } from "./table.restD";
import {IntegerDD} from "../../common/dataD";

export const tablePageD: ExampleMainPage = {
  domain: {
    display: { dataDD: TableDisplayDD },
    selectedItem: { dataDD: TableRowDD },
    selectedItem2: { dataDD: TableRowDD },
    selectedIndex: { dataDD: IntegerDD },
    selectedIndex2: { dataDD: IntegerDD }
  },
  display: { target: '~/display', dataDD: TableDisplayDD },
  modals: [],
  modes: [ 'edit' ],
  initialValue: 'empty',
  name: "TablePage",
  pageType: 'MainPage',
  rest: {
    default: { rest: tableRestD, targetFromPath: '~/display', fetcher: true }
  },
  buttons: {}

}
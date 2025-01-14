import { ExampleDataD, ExampleRepeatingD } from "../common";
import { IntegerDD, MoneyStringDD, StringDD } from "../../common/dataD";
import {
  TableCD,
  TableWithHighLightIfCellEqualsValueCD,
  TableWithHighLightIfOverCD,
  TableWithHighLightIfOverDataDependantCD
} from "../../common/componentsD";

export const TableRowDD: ExampleDataD = {
  name: 'TableRow',
  description: 'A table of data to show how they can be displayed',
  structure: {
    name: { dataDD: StringDD },
    balance: { dataDD: MoneyStringDD },
    someNumber: { dataDD: IntegerDD }
  }
}

export const TableRepDD: ExampleRepeatingD = {
  name: "TableData",
  dataDD: TableRowDD,
  description: "The Table itself",
  display: TableCD,
  sampleCount: 4,
  paged: false
}

export const TableDisplayDD: ExampleDataD = {
  name: 'TableDisplay',
  description: "A few table variants",
  structure: {
    simpleTable: {
      dataDD: { ...TableRepDD, name: "Table1", displayParams: { order: [ 'name', 'balance', 'someNumber' ], copySelectedIndexTo: ["selectedIndex"], copySelectedItemTo: ["selectedItem"] } },
    },
    longSimpleTable: {
      dataDD: { ...TableRepDD, name: "Table5", sampleCount: 20, displayParams: { order: [ 'name', 'balance', 'someNumber' ], scrollAfter: '500px', copySelectedIndexTo: ["selectedIndex2"], copySelectedItemTo: ["selectedItem2"] } },
    },
    tableWithMinBalance: {
      dataDD: {
        ...TableRepDD,
        name: 'Table2',
        display: TableWithHighLightIfOverCD,
        displayParams: {
          order: [ 'name', 'balance', 'someNumber' ],
          nameOfCellForMinimum: 'balance',
          minimumValue: 200,
          classNameOfHighlight: 'highlight'
        }
      }
    },
    tableWithMinSomeNumber: {
      dataDD: {
        ...TableRepDD,
        name: 'Table3',
        display: TableWithHighLightIfOverCD,
        displayParams: {
          order: [ 'name', 'balance', 'someNumber' ],
          nameOfCellForMinimum: 'someNumber',
          minimumValue: 200,
          classNameOfHighlight: 'highlight'
        }
      }
    },
    tableWithHighLightIfCellEqualsValue: {
      dataDD: {
        ...TableRepDD,
        name: 'Table4',
        display: TableWithHighLightIfCellEqualsValueCD,
        sampleCount: 10,
        displayParams: {
          order: [ 'name', 'balance', 'someNumber' ],
          nameOfCellForEquals: 'name',
          value: 'someString',
          classNameOfHighlight: 'highlight-bold'
        }
      }
    },
    minValue: { dataDD: IntegerDD },
    tableWithVaryingMinValueOnBalance: {
      dataDD: {
        ...TableRepDD,
        name: 'Table6',
        display: TableWithHighLightIfOverDataDependantCD,
        displayParams: {
          order: [ 'name', 'balance', 'someNumber' ],
          nameOfCellForMinimum: 'balance',
          minimumPath: 'minValue',
          classNameOfHighlight: 'highlight'
        }
      }
    },

  }
}

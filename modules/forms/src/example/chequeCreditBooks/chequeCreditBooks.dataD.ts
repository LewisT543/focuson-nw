import { DataD, DateDD, IntegerDD, OneLineStringDD, RepeatingDataD } from "../../common/dataD";
import { TableCD } from "../../common/componentsD";


export const ChequeCreditbooksHistoryLineDD: DataD = {
  name: "ChequeCreditbooksHistoryLineDD",
  description: "The create plan data (actually just put in one place to allow a test for a structure)",
  structure: {
    serialNumber: { dataDD: { ...IntegerDD, sample: [ 937453 ] } ,},
    howOrdered: { dataDD: OneLineStringDD, sample: [ 'Manually' ] },
    dateOrder: { dataDD: DateDD, sample: [ '2022-10-01' ] }
  }
}
export const ChequeCreditbooksHistoryDD: RepeatingDataD = {
  name: "ChequeCreditbooksHistoryDD",
  paged: false,
  description: "The history of how cheque and credit books have been ordered",
  dataDD: ChequeCreditbooksHistoryLineDD,
  display: TableCD,
  displayParams: { order: { value: [ 'serialNumber', 'howOrdered', 'dateOrder' ] } }
}
export const ChequeCreditbooksDD: DataD = {
  name: "ChequeCreditbooksDD",
  description: "This is the main object for the Cheque and Credit books form",
  structure: {
    history: { dataDD: ChequeCreditbooksHistoryDD }
  }
}

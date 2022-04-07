import { DataD, OneLineStringDD, RepeatingDataD } from "../../common/dataD";
import { AllGuards } from "../../buttons/guardButton";
import { TableCD } from "../../common/componentsD";
import { addT } from "../database/tableNames";

export const postCodeDataLineD: DataD<AllGuards> = {
  name: "PostCodeDataLine",
  description: "",
  table: addT,
  structure: {
    line1: { dataDD: OneLineStringDD, db: 'zzline1', sample: [ '4 Privet drive', '27 Throughput Lane' ] },
    line2: { dataDD: OneLineStringDD, db: 'zzline2', sample: [ 'Little Whinging', 'Woodfield' ] },
    line3: { dataDD: OneLineStringDD, db: 'zzline3', sample: [ 'Surrey', '' ] },
    line4: { dataDD: OneLineStringDD, db: 'zzline4', sample: [ 'England', 'Ireland' ] }
  }
}


export const postCodeSearchResponse: RepeatingDataD<AllGuards> = {
  name: "PostCodeData",
  description: "The array of all the data",
  dataDD: postCodeDataLineD,
  paged: false,
  display: TableCD,
  displayParams: {
    order: [ 'line1', 'line2', 'line3', 'line4' ],
    copySelectedItemTo: [ 'postcode', 'addressResults' ]
  }
}

export const postCodeSearchDataD: DataD<AllGuards> = {
  name: "PostCodeSearch",
  description: "The post code search example: type postcode get results",
  structure: {
    search: { dataDD: OneLineStringDD, sample: [ 'LS21 3EY' ] },
    searchResults: { dataDD: postCodeSearchResponse },
    addressResults: { dataDD: postCodeDataLineD }
  }
}

export const nameAndAddressDataD: DataD<AllGuards> = {
  name: "PostCodeNameAndAddress",
  description: "An address that the Postcode data needs to be copied to",
  table: addT,
  structure: {
    name: { dataDD: OneLineStringDD },
    ...postCodeDataLineD.structure,
    postcode: { dataDD: OneLineStringDD, displayParams: { buttons: [ 'search' ] } }
  }
}
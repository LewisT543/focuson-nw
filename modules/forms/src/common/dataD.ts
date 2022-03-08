//Common Data Definitions


import { DisplayCompD, LabelAndCheckboxInputCD, LabelAndNumberInputCD, LabelAndStringInputCD } from "./componentsD";
import { ComponentDisplayParams } from "../codegen/makeRender";
import { NameAnd, safeArray } from "@focuson/utils";

export interface HasSample<T> {
  sample?: T[]
}
export interface HasEnum {
  enum?: EnumDD;
}

export function sampleFromDataD ( o: OneDataDD | undefined, d: AllDataDD ): string[] {
  const fromO: string[] = safeArray ( o?.sample )
  const fromD: string[] = isPrimDd ( d ) ? [ ...safeArray<any> ( d.sample ).map ( ( t: any ) => t ), ...safeArray ( d.enum ? Object.keys ( d.enum ) : [] ) ] : []
  return [ ...fromO, ...fromD ]
}

export interface OneDataDD extends HasSample<string> {
  dataDD: AllDataDD;
  hidden?: boolean;
  guard?: NameAnd<string[]>
  displayParams?: ComponentDisplayParams,
  field?: string, // defaults to the name. if it exists this says which field to use
}
export interface ManyDataDD {
  [ name: string ]: OneDataDD
}
export interface OneDisplayParamDD {
  value: boolean| number | string | string[]
}
export interface DisplayParamDD {
  [ name: string ]: OneDisplayParamDD
}


export interface CommonDataDD {
  name: string;
  display?: DisplayCompD;
  displayParams?: DisplayParamDD
  description: string;
  comments?: string;
  meta?: any;
  graphQlType?: string;
  resolver?: string;
  guard?: NameAnd<string[]>
}
export interface LocalVariableGuard {
  pathFromHere: string[],
  values: NameAnd<any> | undefined
}
export type Guard = LocalVariableGuard

export interface DataD extends CommonDataDD {
  guards?: NameAnd<Guard>,
  structure: ManyDataDD;
}

export interface CommonPrimitiveDD<T> extends CommonDataDD, HasSample<T>, HasEnum {
  emptyValue: T;
  label?: string;
  display: DisplayCompD;
  fieldName?: string;
  graphQlType: string;
}

export interface StringPrimitiveDD extends CommonPrimitiveDD<string> {
  reactType: 'string';
  graphQlType: 'String'

}
export interface BooleanPrimitiveDD extends CommonPrimitiveDD<boolean> {
  reactType: 'boolean';
  emptyValue: false
  graphQlType: 'Boolean'
}
export interface NumberPrimitiveDD extends CommonPrimitiveDD<number> {
  reactType: 'number';
  emptyValue: number;
  graphQlType: 'Int' | 'Float'
}
export type PrimitiveDD = StringPrimitiveDD | BooleanPrimitiveDD | NumberPrimitiveDD

export interface RepeatingDataD extends CommonDataDD {
  paged: boolean;
  display: DisplayCompD; // mandatory for a repeating
  dataDD: DataD;
}
export function isRepeatingDd ( d: any ): d is RepeatingDataD {
  return d.paged !== undefined
}

export type AllDataDD = PrimitiveDD | DataD | RepeatingDataD


export interface NamesAndDataDs {
  [ name: string ]: DataD
}

export interface AllDataFolder<Acc> {
  stopAtDisplay?: boolean,
  foldPrim: ( acc: Acc, path: string[], parents: DataD[], oneDataDD: OneDataDD | undefined, dataDD: PrimitiveDD ) => Acc,
  foldData: ( acc: Acc, path: string[], parents: DataD[], oneDataDD: OneDataDD | undefined, dataDD: DataD, start: boolean ) => Acc,
  foldRep: ( acc: Acc, path: string[], parents: DataD[], oneDataDD: OneDataDD | undefined, dataDD: RepeatingDataD, start: boolean ) => Acc
}
export interface AllDataFlatMap<Acc> {
  stopAtDisplay?: boolean,
  walkPrim: ( path: string[], parents: DataD[], oneDataDD: OneDataDD | undefined, dataDD: PrimitiveDD ) => Acc[],
  walkDataStart: ( path: string[], parents: DataD[], oneDataDD: OneDataDD | undefined, dataDD: DataD ) => Acc[],
  walkDataEnd: ( path: string[], parents: DataD[], oneDataDD: OneDataDD | undefined, dataDD: DataD ) => Acc[],
  walkRepStart: ( path: string[], parents: DataD[], oneDataDD: OneDataDD | undefined, dataDD: RepeatingDataD ) => Acc[]
  walkRepEnd: ( path: string[], parents: DataD[], oneDataDD: OneDataDD | undefined, dataDD: RepeatingDataD ) => Acc[]
}
export function emptyDataFlatMap<Acc> (): AllDataFlatMap<Acc> {
  return ({
    walkPrim: () => [],
    walkDataStart: () => [],
    walkDataEnd: () => [],
    walkRepStart: () => [],
    walkRepEnd: () => []
  })
}

export function flatMapDD<Acc> ( dataDD: AllDataDD, map: AllDataFlatMap<Acc> ) {
  return foldDataDD<Acc[]> ( dataDD, [], [], [], {
    stopAtDisplay: map.stopAtDisplay,
    foldRep: ( acc, path, parents, oneDataDD, dataDD, start ) => {
      return [ ...acc, ...start ?
        map.walkRepStart ( path, parents, oneDataDD, dataDD ) :
        map.walkRepEnd ( path, parents, oneDataDD, dataDD ) ]
    },
    foldData: ( acc, path, parents, oneDataDD, dataDD, start ) => {
      return [ ...acc, ...start ?
        map.walkDataStart ( path, parents, oneDataDD, dataDD ) :
        map.walkDataEnd ( path, parents, oneDataDD, dataDD ) ]
    },
    foldPrim: ( acc, path, parents, oneDataDD, dataDD ) =>
      [ ...acc, ...map.walkPrim ( path, parents, oneDataDD, dataDD ) ]
  } )
}

export const collectDataWalker: AllDataFlatMap<DataD> = {
  ...emptyDataFlatMap (),
  walkDataStart: ( path, parents, oneDataDD, dataDD ) => [ dataDD ]
}
export function findDataDDIn ( a: AllDataDD, stopAtDisplay?: boolean ): DataD[] {return flatMapDD ( a, { ...collectDataWalker, stopAtDisplay } )}


export function foldDataDD<Acc> ( dataDD: AllDataDD, path: string[], parents: DataD[], zero: Acc, folder: AllDataFolder<Acc>, oneDataDD?: OneDataDD ): Acc {
  const { foldPrim, foldData, foldRep, stopAtDisplay } = folder
  if ( isDataDd ( dataDD ) ) {
    let start: Acc = foldData ( zero, path, parents, oneDataDD, dataDD, true );
    if ( dataDD.display && stopAtDisplay ) return foldData ( start, path, parents, oneDataDD, dataDD, false );
    let acc = Object.entries ( dataDD.structure ).reduce ( ( acc, [ name, child ] ) => foldDataDD ( child.dataDD, [ ...path, name ], [ ...parents, dataDD ], acc, folder, child ), start );
    return foldData ( acc, path, parents, oneDataDD, dataDD, false )
  }
  if ( isRepeatingDd ( dataDD ) ) {
    let start = foldRep ( zero, path, parents, oneDataDD, dataDD, true );
    if ( stopAtDisplay ) return foldRep ( start, path, parents, oneDataDD, dataDD, false )
    let acc = foldDataDD ( dataDD.dataDD, path, parents, start, folder, undefined );
    return foldRep ( acc, path, parents, oneDataDD, dataDD, false )
  }
  return foldPrim ( zero, path, parents, oneDataDD, dataDD )
}


/** Finds and dedups all the unique DataDs in the list. Identity is based on name: so we assume if the name is the same, it's the same object.*/
export function findAllDataDs ( a: AllDataDD[], stopAtDisplay?: boolean ): NamesAndDataDs {
  var result: NamesAndDataDs = {}
  a.flatMap ( d => findDataDDIn ( d, stopAtDisplay ) ).forEach ( d => result [ d.name ] = d )
  return result
}
export function isPrimDd ( d: any ): d is PrimitiveDD {
  return !isRepeatingDd ( d ) && !isDataDd ( d )
}

export function isDataDd ( d: any ): d is DataD {
  return !!d.structure
}

export interface EnumDD {
  [ name: string ]: string
}

interface StringPrimDD {
  emptyValue: string;
  reactType: 'string',
  graphQlType: 'String',
}
export const stringPrimDD: StringPrimDD = {
  emptyValue: "",
  reactType: 'string',
  graphQlType: 'String',
}
interface NumberPrimDD {
  name: 'IntegerDD',
  emptyValue: number,
  graphQlType: 'Int',
  reactType: 'number'
}
export const numberPrimDD: NumberPrimDD = {
  name: 'IntegerDD',
  emptyValue: 0,
  graphQlType: 'Int',
  reactType: 'number'
}

export const CustomerIdDD: StringPrimitiveDD = {
  ...stringPrimDD,
  name: 'CustomerIdDD',
  description: "A customer id",
  display: LabelAndStringInputCD,
  sample: [ "003450" ]
}
export const AccountIdDD: NumberPrimitiveDD = {
  ...numberPrimDD,
  name: 'AccountIdDD',
  description: "An account id",
  display: LabelAndNumberInputCD,
  displayParams: { min: { value: 10000000 }, max: { value: 99999999 }},
  sample: [ 1233450, 3233450, 4333450 ]
}
export const StringDD: StringPrimitiveDD = {
  ...stringPrimDD,
  name: 'StringDD',
  description: "The primitive 'string'. A reasonably short list of characters",
  display: LabelAndStringInputCD,
  sample: [ "someString", "anotherString" ]
}
export const OneLineStringDD: StringPrimitiveDD = {
  ...stringPrimDD,
  name: 'OneLineStringDD',
  graphQlType: 'String',
  description: "A string that fits on a line of text. Probably reasonably long",
  display: LabelAndStringInputCD,
  sample: [ "This is a one line string", "another one line string" ]
}
export const ManyLineStringDD: StringPrimitiveDD = {
  ...stringPrimDD,
  name: 'ManyLineStringDD',
  description: "A string that needs many lines and uses a text Area",
  display: LabelAndStringInputCD,
  sample: [ "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit" ]
}
export const IntegerDD: NumberPrimitiveDD = {
...numberPrimDD,
  name: 'IntegerDD',
  description: "The primitive 'Integer'",
  display: LabelAndNumberInputCD,
  sample: [ 123, 456 ]
}
export const MoneyDD: NumberPrimitiveDD = {
  ...IntegerDD,
  description: "The primitive representing an amount of the local currency",
  name: 'IntegerDD'
}
export const BooleanDD: PrimitiveDD = {
  name: 'BooleanDD',
  emptyValue: false,
  graphQlType: 'Boolean',
  reactType: 'boolean',
  description: "The primitive 'Boolean'",
  display: LabelAndCheckboxInputCD,
  sample: [ true, false ]
}
export const DateDD: StringPrimitiveDD = {
  ...stringPrimDD,
  name: 'DateDD',
  emptyValue: '2022-1-1',
  description: "The primitive representing a date (w/o time)",
  display: LabelAndStringInputCD, //or maybe a date picker
  sample: [ "2020-10-01", '2022-14-01' ]
}

export const DateTimeDD: PrimitiveDD = {
  ...stringPrimDD,
  name: 'DateTimeDD',
  emptyValue: '2022-1-1T00:00:00',
  description: "The primitive representing a date (with time)",
  display: LabelAndStringInputCD, //or maybe a date picker
  sample: [ "2020-10-01T06:30:00", '2022-14-01T14:30:00' ]
}


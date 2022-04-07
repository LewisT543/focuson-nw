import { ButtonD } from "./allButtons";
import { NameAnd } from "@focuson/utils";
import { guardName } from "../codegen/names";
import { stateForGuardButton, stateForGuardVariable } from "../codegen/lens";
import { MainPageD, PageD } from "../common/pageD";
import { TSParams } from "../codegen/config";


export type AllGuards = LocalVariableGuard | LocalVariableMoreThanZero | LocalVariableLessThanLengthMinusOne | LocalVariableValueEquals<any>

export const AllGuardCreator: MakeGuard<AllGuards> = {
  in: {
    imports: [],
    makeGuardVariable: ( params, mainP, page, name, guard: LocalVariableGuard ) =>
      `const ${guardName ( name )} = ${stateForGuardVariable ( page, params, name ) ( guard.path )}.optJson();`
  },
  equals: {
    imports: [],
    makeGuardVariable: ( params, mainP, page, name, guard: LocalVariableValueEquals<any> ) =>
      `const ${guardName ( name )} =  ${stateForGuardButton ( page, params, name ) ( guard.path )}.optJson() === ${guard.value};`
  },

  ">0": {
    imports: [],
    makeGuardVariable: ( params, mainP, page, name, guard: LocalVariableMoreThanZero ) =>
      `const ${guardName ( name )} =  ${stateForGuardButton ( page, params, name ) ( guard.path )}.optJsonOr(0) >0`
  },
  "<arrayEnd": {
    imports: [],
    makeGuardVariable: ( params, mainP, page, name, guard: LocalVariableLessThanLengthMinusOne ) =>
      `const ${guardName ( name )} = ${stateForGuardButton ( page, params, name ) ( guard.varPath )}.optJsonOr(0) <   ${stateForGuardButton ( page, params, name ) ( guard.arrayPath )}.optJsonOr([]).length - 1`
  }
}
export interface GuardWithCondition {
  condition: string
}
export type Guards<G> = NameAnd<G>

export type MakeGuard<G> = NameAnd<GuardCreator<G>>

export interface GuardCreator<G> {
  imports: string[];
  makeGuardVariable: ( params: TSParams, mainPage: MainPageD<any, G>, page: PageD<any, G>, name: string, guard: G ) => string

}


export interface LocalVariableGuard {
  condition: 'in'
  path: string,
  values: NameAnd<any> | undefined
}
export interface LocalVariableMoreThanZero {
  condition: '>0'
  path: string
}
export interface LocalVariableValueEquals<T> {
  condition: 'equals';
  path: string;
  value: T


}
export interface LocalVariableLessThanLengthMinusOne {
  condition: '<arrayEnd'
  varPath: string
  arrayPath: string
}


export function isGuardButton<B, G> ( b: ButtonD ): b is GuardButtonInPage<B, G> {
  // @ts-ignore
  return b.guard !== undefined
}

export interface GuardButtonInPage<B, G> {
  guard: B;
  by: G
}
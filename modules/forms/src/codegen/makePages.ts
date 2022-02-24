import { allMainPages, PageD } from "../common/pageD";
import { TSParams } from "./config";
import { modalName, pageComponentName, pageInState } from "./names";
import { addStringToEndOfAllButLast, focusQueryFor } from "./codegen";
import { makeEmptyData } from "./makeSample";
import { safeArray } from "@focuson/utils";


export const makeMainPage = ( params: TSParams ) => ( p: PageD ): string[] => {
  function makeEmpty () {
    let result: any = {}
    result[ p.display.target.join ( "." ) ] = makeEmptyData ( p.display.dataDD )
    return result
  }
  const initialValue = p.initialValue === 'empty' ? makeEmpty () : p.initialValue
  return p.pageType === 'MainPage' ?
    [ `    ${p.name}: { config: simpleMessagesConfig, lens: identity.focusQuery ( '${pageInState ( p )}' ), pageFunction: ${pageComponentName ( p )}(), initialValue: ${JSON.stringify ( initialValue )} }` ]
    : [];
}

export interface ModalCreationData {
  name: string,
  path: string[],
  modal: PageD
}
export function walkModals ( ps: PageD[] ): ModalCreationData[] {
  return ps.filter ( p => p.pageType === 'MainPage' ).flatMap ( p => safeArray ( p.modals ).map ( ( { modal, path } ) =>
    ({ name: modalName ( p, modal ), path: [ p.name, ...path ], modal }) ) )
}

export const makeModal = ( params: TSParams ) => ( { name, path, modal }: ModalCreationData ): string[] => {
  const focus = focusQueryFor ( path )
  return [ `    ${name}: { config: simpleMessagesConfig,  lens: identity${focus},pageFunction: ${params.renderFile}.${pageComponentName ( modal )}(), modal: true}` ]
};

export function makePages ( params: TSParams, ps: PageD[] ): string[] {
  const modals = walkModals ( ps );
  return [
    `import { identityOptics } from "@focuson/lens";`,
    `import { MultiPageDetails, simpleMessagesPageConfig } from "@focuson/pages";`,
    `import {Context,  ${params.stateName} } from "./${params.commonFile}";`,
    `import * as render from"./render";`,
    `import { ${allMainPages ( ps ).map ( p => pageComponentName ( p ) ).join ( "," )} } from "./${params.renderFile}";`,
    '',
    `function MyLoading () {`,
    `      return <p>Loading</p>`,
    `}`,
    `const simpleMessagesConfig = simpleMessagesPageConfig<${params.stateName}, string, Context> (  MyLoading )`,
    `const identity = identityOptics<FState> ();`,
    `export const pages: MultiPageDetails<${params.stateName}, Context> = {`,
    ...addStringToEndOfAllButLast ( "," ) ( [ ...ps.flatMap ( makeMainPage ( params ) ), ...modals.flatMap ( makeModal ( params ) ) ] ),
    `  }` ]
}
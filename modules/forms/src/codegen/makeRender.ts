import { AllDataDD, CompDataD, DisplayParamDD, HasGuards, HasLayout, isDataDd, isPrimDd, isRepeatingDd, OneDataDD } from "../common/dataD";
import { commonParamsWithLabel, DisplayCompD, OneDisplayCompParamD, SimpleDisplayComp } from "../common/componentsD";
import { dataDsIn, isMainPage, isModalPage, MainPageD, PageD } from "../common/pageD";

import { decamelize, NameAnd, safeArray, safeObject, sortedEntries, toArray, unique, unsortedEntries, Validations } from "@focuson-nw/utils";
import { componentName, domainName, domainsFileName, emptyFileName, guardName, modalImportFromFileName, modalPageComponentName, optionalsFileName, optionalsName, pageComponentName, pageDomainName } from "./names";
import { addButtonsFromVariables, allControlButtonsOnPage, hasNeedsHistory, MakeButton, makeButtonsVariable, makeGuardButtonVariables } from "./makeButtons";
import { focusOnFor, indentList, noExtension } from "./codegen";
import { TSParams } from "./config";
import { ButtonD } from "../buttons/allButtons";
import { GuardWithCondition, MakeGuard } from "../buttons/guardButton";
import { stateFocusQueryWithTildaFromPage, stateQueryForParams, stateQueryForPathsFnParams } from "./lens";
import { mapTitleDetails } from "@focuson-nw/pages";


export type AllComponentData<G> = ComponentData<G> | ErrorComponentData
export interface ComponentData<G> {
  path: string[];
  dataDD: AllDataDD<G>;
  display: DisplayCompD;
  hidden?: boolean;
  guard?: NameAnd<string[] | boolean>;
  displayParams?: ComponentDisplayParams
}
function componentDataForRootPage<G> ( d: CompDataD<G> ): ComponentData<G> {
  const display = { import: '', name: d.display?.name ? d.display.name : d.name, params: d.display?.params ? d.display.params : commonParamsWithLabel };
  return { dataDD: d, display, path: [] }

}
function componentDataForPage<G> ( oneDataD: OneDataDD<G>, d: CompDataD<G> ): ComponentData<G> {
  return { ...componentDataForRootPage ( d ), guard: oneDataD.guard, hidden: oneDataD.hidden }

}
export interface ErrorComponentData {
  path: string[];
  error: string;
}
export function isComponentData<G> ( d: AllComponentData<G> ): d is ComponentData<G> {
  // @ts-ignore
  return d.error === undefined
}

export function isErrorComponentData<G> ( d: AllComponentData<G> ): d is ErrorComponentData {
  // @ts-ignore
  return d.error !== undefined
}

export interface ComponentDisplayParams {
  [ name: string ]: boolean | string | string[] | number | NameAnd<any>
}


export const listComponentsIn = <G> ( dataDD: CompDataD<G> ): AllComponentData<G>[] => {
  if ( isRepeatingDd ( dataDD ) ) return [] //for now
  if ( isPrimDd ( dataDD ) ) throw  Error ( 'Showing a primitive... do we want this? I guess why not... might be a string. For now an error' );

  return Object.entries ( dataDD.structure ).map ( ( [ n, oneDataDD ] ) => {
    const child: AllDataDD<G> = oneDataDD.dataDD
    if ( isPrimDd ( child ) ) {
      const c: AllComponentData<G> = {
        displayParams: oneDataDD.displayParams,
        path: [ n ],
        dataDD: child,
        display: child.display,
        hidden: oneDataDD.hidden,
        guard: oneDataDD.guard
      }
      return c
    }
    const c: any = componentDataForPage ( oneDataDD, child )
    delete c.path
    return { path: [ n ], ...c } //just to get format nice on o/p

  } )

  // return flatMapDD ( dataDD, listComponentsInFolder () );
};

export const processParam = <B, G> ( mainPage: MainPageD<B, G>, page: PageD<B, G>, params: TSParams, errorPrefix: string, dcd: DisplayCompD ) => ( name: string, s: number | string | string[] | boolean | NameAnd<any> ) => {
  if ( dcd.params === undefined ) throw Error ( `${errorPrefix} Trying to get data for param ${name}, but no params have been defined` )
  const dcdType: OneDisplayCompParamD<any> | undefined = dcd.params[ name ]
  if ( dcdType === undefined ) throw Error ( `${errorPrefix}  param '${name}' not found in ${JSON.stringify ( Object.keys ( dcd.params ).sort () )}` )
  const fullErrorPrefix = ` ${errorPrefix} has a display component ${dcd.name} and sets a param ${name} `
  if ( dcdType === undefined ) throw new Error ( `${fullErrorPrefix}. Legal values are ${sortedEntries ( dcd.params ).map ( t => t[ 0 ] ).join ( ',' )}` )
  function processStringParam () {return "'" + s.toString ().replace ( /'/g, '&apos;' ) + "'"}
  function processObjectParam () {return "{" + s + "}"}
  function processStringArrayParam () {
    if ( Array.isArray ( s ) ) return `{${JSON.stringify ( s )}}`; else
      throw new Error ( `${fullErrorPrefix} needs to be a string[]` )
  }
  function processState ( prefix: string, postFix: string ) {
    if ( Array.isArray ( s ) ) return `{${prefix}${focusOnFor ( s )}${postFix}}`; else
      throw new Error ( `${fullErrorPrefix} needs to be a string[]. Actually is ${typeof s}, with value ${JSON.stringify ( s )}` )
  }
  function processPath ( postFix: string ) {
    if ( typeof s !== 'string' ) throw new Error ( `${fullErrorPrefix} needs to be a string. Actually is ${typeof s}, with value ${JSON.stringify ( s )}` )
    return `{${stateQueryForParams ( fullErrorPrefix + ` the path is ${s}`, params, mainPage, mainPage, s )}${postFix}}`
  }
  function processNameAndPaths () {
    if ( typeof s !== 'object' ) throw new Error ( `${fullErrorPrefix} needs to be an object of form {name: string,...}. Actually is ${typeof s}, with value ${JSON.stringify ( s )}` )
    return '{{' + Object.entries ( s ).map ( ( [ name, path ] ) => `${name}:${stateQueryForPathsFnParams ( fullErrorPrefix + ` the path is ${s} name is ${name}, path is ${path}`, params, mainPage, mainPage, path )}` ).join ( ',' ) + '}}'
  }
  function processGuardAndMessage () {
    if ( typeof s !== 'object' ) throw new Error ( `${fullErrorPrefix} needs to be an object of form {guardName1: message1, guardName2: message2}. Actually is ${typeof s}, with value ${JSON.stringify ( s )}` )
    const guardAndMessages = Object.entries ( s ).map ( ( [ guardName, message ] ) => `[${guardName}Guard,${JSON.stringify ( message )}]` ).join ( ',' )
    return `{[${guardAndMessages}]}`
  }
  function processStoreParam () {return `{store}`}
  if ( dcdType.paramType === 'string' ) return processStringParam ()
  if ( dcdType.paramType === 'boolean' ) return processObjectParam ()
  if ( dcdType.paramType === 'object' ) return processObjectParam ()
  if ( dcdType.paramType === 'json' ) return "{" + JSON.stringify ( s ) + "}"
  if ( dcdType.paramType === 'jsonWithDisplayFn' ) return "{" + JSON.stringify ( s, null, 2 ).replace ( /"display":\s*"(\w*)"/g, '"display":$1' ) + "}"
  if ( dcdType.paramType === 'objectAndRenderPrefix' ) return "{" + (mainPage.name == page.name ? '' : 'render.') + s + "}"
  if ( dcdType.paramType === 'string[]' ) return processStringArrayParam ()
  if ( dcdType.paramType === 'fullState' ) return processState ( 'fullState(state)', '' )
  if ( dcdType.paramType === 'pageState' ) return processState ( 'pageState(state)<any>()', '' )
  if ( dcdType.paramType === 'state' ) return processState ( 'state', '' )
  if ( dcdType.paramType === 'fullStateValue' ) return processState ( 'fullState(state)', '.json()' )
  if ( dcdType.paramType === 'pageStateValue' ) return processState ( 'pageState(state)<any>()', '.json()' )
  if ( dcdType.paramType === 'stateValue' ) return processState ( 'state', '.json()' )
  if ( dcdType.paramType === 'path' ) return processPath ( '' )
  if ( dcdType.paramType === 'nameAndPaths' ) return processNameAndPaths ()
  if ( dcdType.paramType === 'pathValue' ) return processPath ( '.optJson()' )
  if ( dcdType.paramType === 'guards' ) {
    if ( typeof s === 'string' || Array.isArray ( s ) ) return "{[" + toArray<string> ( s ).map ( guardName ).join ( ',' ) + "]}"
    throw Error ( `${fullErrorPrefix} for guards. Could not process ${JSON.stringify ( s )}` )
  }
  if ( dcdType.paramType === 'guardAndMessage' ) return processGuardAndMessage ()
  throw new Error ( `${fullErrorPrefix} with type ${dcdType.paramType} which can't be processed` )
};


function toReactParam ( [ name, value ]: [ string, any ] ): [ string, string ] {
  if ( typeof value === 'string' ) return [ name, `"${value}"` ];
  else return [ name, `{${value}}` ]
}

function makeParams<B, G> ( mainPage: MainPageD<B, G>, page: PageD<B, G>, params: TSParams, errorPrefix: string, path: string[], optEnum: NameAnd<String> | undefined,
                            display: DisplayCompD, definingParams: DisplayParamDD | undefined, displayParams: ComponentDisplayParams | undefined, validations: Validations ) {
  const processOneParam = processParam ( mainPage, page, params, errorPrefix, display )
  const dataDDParams: [ string, string ][] = definingParams ? Object.entries ( definingParams )
    .map ( ( [ name, value ] ) => { return [ name, processOneParam ( name, value ) ]; } ) : []
  if ( display === undefined ) throw Error ( `${errorPrefix} the display component was undefined.` )
  if ( display.params === undefined ) throw Error ( `${errorPrefix} the params were undefined. Are you using a custom CD and did you set the params` )
  const defaultParams: [ string, string ][] = Object.entries ( display.params ).flatMap ( ( [ name, param ] ) => {
    if ( param?.default ) return [ [ name, processOneParam ( name, param.default ) ] ]
    if ( param?.needed === 'defaultToCamelCaseOfName' ) return [ [ name, processOneParam ( name, decamelize ( path.slice ( -1 ) + "", ' ' ) ) ] ]
    if ( param?.needed === 'defaultToPath' ) return [ [ name, processOneParam ( name, path ) ] ]
    if ( param?.needed === 'defaultToLabel' ) return [ [ name, processOneParam ( name, 'label' ) ] ]
    if ( param?.needed === 'defaultToButtons' ) return [ [ name, processOneParam ( name, 'allButtons' ) ] ]
    if ( param?.needed === 'defaultToParentState' ) return [ [ name, processOneParam ( name, 'state' ) ] ]
    if ( param?.needed === 'defaultToParentStateIfOnChange' )
      return Object.keys ( display.params ).includes ( 'onChange' ) || Object.keys ( display.params ).includes ( 'specificOnChange' ) ?
        [ [ name, processOneParam ( name, 'state' ) ] ] : [];
    if ( param?.needed === 'id' ) {
      const dot = path.length > 0 ? '.' : ''
      return [ [ name, processOneParam ( name, '`${id}' + dot + path.join ( "." ) + '`' ) ] ]
    }
    if ( param?.needed === 'defaultToEnum' )
      if ( optEnum ) return [ [ name, "{" + JSON.stringify ( optEnum ) + "}" ] ]
      else
        throw new Error ( `errorPrefix for ${path} has a display component ${display.name} and sets a param ${name}. Requires enums, but no enums have been defined` )
    return []
  } )
  const displayParamsA: [ string, string ][] = displayParams ? Object.entries ( displayParams ).map ( ( [ name, value ] ) => [ name, processOneParam ( name, value ) ] ) : []
  const fullDisplayParams = Object.entries ( Object.fromEntries ( [ ...defaultParams, ...dataDDParams, ...displayParamsA, ...Object.entries ( validations ).map ( toReactParam ) ] ) )
  return fullDisplayParams;
}
export function createOneReact<B, G> ( mainPage: MainPageD<B, G>, params: TSParams, pageD: PageD<B, G>, { path, dataDD, display, displayParams, guard }: ComponentData<G> ): string[] {
  if ( display === undefined )
    throw Error ( `Misconfigured component in page ${mainPage.name}. This is usually because you just added a field, and misconfigured the field. Unfortunately we can't work out which field it was.
    path ${path}
    DataDD ${JSON.stringify ( dataDD, null, 2 )}
    displayParams: ${JSON.stringify ( displayParams, null, 2 )}` )
  const name = display.name
  let errorPrefix = `Page ${pageD.name}, Datad ${dataDD.name} with path ${JSON.stringify ( path )}`;
  if ( name === undefined ) throw Error ( errorPrefix + " cannot find the name of the display component. Check it is a dataD or similar" )
  const validate = isPrimDd ( dataDD ) && dataDD.validate ? dataDD.validate : {};
  const fullDisplayParams = makeParams ( mainPage, pageD, params, errorPrefix, path,
    isPrimDd ( dataDD ) ? dataDD.enum : undefined, display, dataDD.displayParams, displayParams, validate );

  const displayParamsString = fullDisplayParams.map ( ( [ k, v ] ) => `${k}=${v}` ).join ( " " )

  const guardPrefix = guard ? sortedEntries ( guard ).map ( ( [ n, guard ] ) =>
    `<Guard value={${guardName ( n )}} cond={${JSON.stringify ( guard )}}>` ).join ( '' ) : ''
  const guardPostfix = guard ? sortedEntries ( guard ).map ( ( [ n, guard ] ) => `</Guard>` ).join ( '' ) : ''
  // const buttons = isDataDd ( dataDD ) && !dataDD.display ? 'buttons={buttons} ' : ''
  return [ `${guardPrefix}<${name} ${displayParamsString} />${guardPostfix}` ]
}
export function createAllReactCalls<B, G> ( mainPage: MainPageD<B, G>, params: TSParams, p: PageD<B, G>, d: AllComponentData<G>[] ): string[] {
  return d.filter ( ds => isComponentData ( ds ) && !ds.hidden ).flatMap ( d => {
    const comment: string[] = []//isComponentData ( d ) ? [ " {/*" + JSON.stringify ( { ...d, dataDD: d.dataDD?.name } ) + '*/}' ] : []
    if ( isErrorComponentData ( d ) ) return [ d.error ]
    const comp = [ ...comment, ...createOneReact ( mainPage, params, p, d ) ]
    return comp
  } )
}

function makeLayoutPrefixPostFix<B, G> ( mainPage: MainPageD<B, G>, page: PageD<B, G>, tsparams: TSParams, errorPrefix: string, path: string[], hasLayout: HasLayout, defaultOpen: string, defaultClose: string ) {
  const layouts = toArray ( hasLayout.layout )

  if ( layouts.length > 0 ) {
    return layouts.reduce ( ( acc, layout ) => {
      const { component, displayParams } = layout
      const params = makeParams ( mainPage, page, tsparams, errorPrefix, path, undefined, component, displayParams, {}, {} )
      const layoutPrefixString = `<${component.name} ${params.map ( ( [ n, v ] ) => `${n}=${v}` ).join ( ' ' )}>`
      const layoutPostfixString = `</${component.name}>`
      return { layoutPrefixString: acc.layoutPrefixString + layoutPrefixString, layoutPostfixString: layoutPostfixString + acc.layoutPostfixString };
    }, { layoutPrefixString: '', layoutPostfixString: '' } )
  } else return { layoutPrefixString: defaultOpen, layoutPostfixString: defaultClose }
}

export function defaultGuardMessage ( name: string ) {
  return `${name} is not valid`;
}
export function makeUseHistory<B extends ButtonD, G> ( makeButton: MakeButton<G>, p: PageD<B, G> ) {
  return hasNeedsHistory ( makeButton, p ) ? [ `const h = state.context.dependencies?.history; const history=h?h(() =>{}):undefined` ] : []

}
export function makeGuardVariables<B, G extends GuardWithCondition> ( hasGuards: HasGuards<G>, makeGuard: MakeGuard<G>, params: TSParams, mainP: MainPageD<B, G>, page: PageD<B, G> ): string[] {
  if ( hasGuards.guards === undefined ) return []
  let guards = unsortedEntries ( hasGuards.guards ).map ( ( [ name, guard ] ) => {
    const maker = makeGuard[ guard.condition ]
    if ( !maker ) throw new Error ( `Don't know how to process guard with name ${name}: ${JSON.stringify ( guard )}` )
    const debugString = `;if (guardDebug)console.log('${mainP.name} '+ id + '.${name}', ${name}Guard);`
    const makerString = maker.makeGuardVariable ( params, mainP, page, name, guard );
    const message = guard.message ? guard.message : defaultGuardMessage ( name )
    const guardAsMessages = maker.raw ? makerString : makerString + `? []:["${message}"]`
    return guardAsMessages + debugString + `//Guard ${JSON.stringify ( guard )}`
  } );
  return [ `const guardDebug=state.main?.debug?.guardDebug`, ...guards ];
}
export function makeDisplayGuard<B, G extends GuardWithCondition> ( hasGuards: HasGuards<G> ): string[] {
  if ( hasGuards.guards === undefined ) return []
  let guards = unsortedEntries ( hasGuards.guards ).map ( ( [ name, guard ] ) => `['${name}',${guardName ( name )}]` ).join ( ',' );
  return [ `   {guardDebug ?<DisplayGuards guards={ [${guards}]} />:<></>}` ];
}

function makeSealedString<B, G> ( dataD: CompDataD<G> ): string[] {
  if ( isDataDd ( dataD ) && dataD.sealedBy ) {
    return [ `//added by sealed: ${JSON.stringify ( dataD.sealedBy )} in component ${dataD.name}. If it doesn't compile check the name and type of the guard variable named`,
      `if (${dataD.sealedBy}Guard.length===0) mode='view'`
    ]
  }
  return []

}
export const createReactComponent = <B, G extends GuardWithCondition> ( params: TSParams, makeGuard: MakeGuard<G>, mainP: MainPageD<B, G>, page: PageD<B, G> ) => ( dataD: CompDataD<G> ): string[] => {
  const contents = indentList ( indentList ( createAllReactCalls ( mainP, params, page, listComponentsIn ( dataD ) ) ) )
  const guardStrings = isDataDd ( dataD ) ? makeGuardVariables ( dataD, makeGuard, params, mainP, page ) : []
  const displayGuardStrings = isDataDd ( dataD ) ? makeDisplayGuard ( dataD ) : []
  const { layoutPrefixString, layoutPostfixString } = makeLayoutPrefixPostFix ( mainP, page, params, `createReactComponent-layout ${dataD.name}`, [], dataD, '<>', '</>' );
  const sealedString = makeSealedString ( dataD )
  return [
    `export function ${componentName ( dataD )}({id,state,mode,allButtons,label}: FocusedProps<${params.stateName}, ${domainName ( dataD )},Context>){`,
    ...guardStrings,
    ...sealedString,
    `  return<>`,
    ...displayGuardStrings,
    layoutPrefixString,
    ...contents,
    layoutPostfixString,
    '</>}', ''
  ]
};


export const createReactPageComponent = <B extends ButtonD, G extends GuardWithCondition> ( params: TSParams, makeGuard: MakeGuard<G>, makeButtons: MakeButton<G>, mainP: MainPageD<B, G>, pageD: PageD<B, G> ): string[] => {
  if ( isMainPage ( pageD ) ) return createReactMainPageComponent ( params, makeGuard, makeButtons, pageD )
  if ( isModalPage ( pageD ) ) return createReactModalPageComponent ( params, makeGuard, makeButtons, mainP, pageD )
  // @ts-ignore
  throw new Error ( `Unknown page type ${pageD.pageType} in ${pageD.name}` )
};

function makeStringifiedTitle<B, G> ( pageD: PageD<B, G> ): string {
  const { title, className } = mapTitleDetails ( pageD, `'${decamelize ( pageD.name, ' ' )}'`, title => `replaceTextUsingPath(s,'${title}')` )
  const classNameString = className === undefined ? '' : `, className: ${JSON.stringify ( className )}`
  return `({title: ${title}${classNameString}})`;
}
function getNeedsTopRightCross<B, G> ( pageD:PageD<B, G>) {
  if (!isModalPage(pageD)) return false
  if (pageD.pageType === 'ModalPopup')
      if (pageD.haveTopRightCrossToCancel === undefined) return false

  return pageD.haveTopRightCrossToCancel === true
}
export function createReactModalPageComponent<B extends ButtonD, G extends GuardWithCondition> ( params: TSParams, makeGuard: MakeGuard<G>, makeButtons: MakeButton<G>, mainP: MainPageD<B, G>, pageD: PageD<B, G> ): string[] {
  const { dataDD } = pageD.display
  // const focus = focusOnFor ( pageD.display.target );
  const domName = domainName ( pageD.display.dataDD );
  const { layoutPrefixString, layoutPostfixString } = makeLayoutPrefixPostFix ( mainP, pageD, params, `createReactModalPageComponent-layout ${pageD.name}`, [], pageD, "<>", '</>' );

  const guards = makeGuardVariables ( pageD, makeGuard, params, mainP, pageD )
  const haveTopRightCrossToCancel = getNeedsTopRightCross ( pageD );
  return [
    `export function ${modalPageComponentName ( mainP ) ( pageD )}(){`,
    `  return focusedPage<${params.stateName}, ${domName}, Context> ( s => ${(makeStringifiedTitle ( pageD ))}, ${haveTopRightCrossToCancel}) (//If there is a compilation here have you added this to the 'domain' of the main page`,
    `     ( state, d, mode, index ) => {`,
    ...(indentList ( indentList ( indentList ( indentList ( indentList ( [
      'const id=`page${index}`;',
      ...makeUseHistory ( makeButtons, pageD ),
      ...guards,
      ...makeGuardButtonVariables ( params, makeGuard, mainP, pageD ),
      ...makeButtonsVariable ( params, makeGuard, makeButtons, mainP, pageD ),
      `return <>`,
      ...makeDisplayGuard ( pageD ),
      layoutPrefixString,
      ...createAllReactCalls ( mainP, params, pageD, [ componentDataForRootPage ( pageD.display.dataDD ) ] ),
      ...addButtonsFromVariables ( pageD ),
      `${layoutPostfixString}</>})}`
    ] ) ) ) ) )),
  ]
}
export function createReactMainPageComponent<B extends ButtonD, G extends GuardWithCondition> ( params: TSParams, makeGuard: MakeGuard<G>, makeButtons: MakeButton<G>, pageD: MainPageD<B, G> ): string[] {
  const { dataDD } = pageD.display
  let errorPrefix: string = `createReactMainPageComponent-layout ${pageD.name}`;
  const { layoutPrefixString, layoutPostfixString } = makeLayoutPrefixPostFix ( pageD, pageD, params, errorPrefix, [], pageD, `<>`, '</>' );
  const guards = makeGuardVariables ( pageD, makeGuard, params, pageD, pageD )

  return [
    `export function ${pageComponentName ( pageD )}(){`,
    `   //A compilation error here is often because you have specified the wrong path in display. The path you gave is ${pageD.display.target}`,
    `  return focusedPageWithExtraState<${params.stateName}, ${pageDomainName ( pageD )}, ${domainName ( pageD.display.dataDD )}, Context> ( s => ${makeStringifiedTitle ( pageD )}, false) ( state => state${stateFocusQueryWithTildaFromPage ( `createReactMainPageComponent for page ${pageD.name}`, params, pageD, pageD, pageD.display.target )}) (`,
    `( fullPageState, state , full, d, mode, index) => {`,
    ...indentList ( makeGuardButtonVariables ( params, makeGuard, pageD, pageD ) ),
    'const id=`page${index}`;',
    ...makeUseHistory ( makeButtons, pageD ),
    ...indentList ( guards ),
    ...indentList ( makeButtonsVariable ( params, makeGuard, makeButtons, pageD, pageD ) ),
    '',
    ...indentList ( indentList ( indentList ( [
      `return <>`,
      ...makeDisplayGuard ( pageD ),
      layoutPrefixString,
      ...indentList ( indentList ( createAllReactCalls ( pageD, params, pageD, [ componentDataForRootPage ( pageD.display.dataDD ), ] ) ) ),
      ...addButtonsFromVariables ( pageD ),
      `${layoutPostfixString}</>})}`
    ] ) ) ),
    ''
  ]
}

export function createRenderPage<B extends ButtonD, G extends GuardWithCondition> ( params: TSParams, makeGuard: MakeGuard<G>, transformButtons: MakeButton<G>, mainP: MainPageD<B, G>, p: PageD<B, G> ): string[] {
  const imports = [ `import * as empty from '${emptyFileName ( '..', params, mainP )}';` ]
  const renderImports = mainP.name === p.name ? [] : [ `import * as render from "./${mainP.name}.${params.renderFile}";` ]
  return [ ...imports, `import * as domain from '${domainsFileName ( '..', params, mainP )}';`,
    ...renderImports,
    ...createAllReactComponents ( params, makeGuard, transformButtons, mainP, p ) ]
}

export function createAllReactComponents<B extends ButtonD, G extends GuardWithCondition> ( params: TSParams, makeGuard: MakeGuard<G>, makeButton: MakeButton<G>, mainP: MainPageD<B, G>, page: PageD<B, G> ): string[] {
  const pages = [ page ]
  const dataComponents = sortedEntries ( dataDsIn ( pages, false ) ).flatMap ( ( [ name, dataD ] ) => dataD.display ? [] : createReactComponent ( params, makeGuard, mainP, page ) ( dataD ) )
  const pageComponents = pages.flatMap ( p => createReactPageComponent ( params, makeGuard, makeButton, mainP, p ) )

  const imports = [
    `import { LensProps } from "@focuson-nw/state";`,
    `import { FocusOnContext } from '@focuson-nw/focuson';`,
    `import {  focusedPage, focusedPageWithExtraState, fullState, pageState, replaceTextUsingPath} from "@focuson-nw/pages";`,
    `import { Context, FocusedProps, ${params.stateName}, identityL } from "../${params.commonFile}";`,
    `import { Lenses } from '@focuson-nw/lens';`,
    `import { DisplayGuards, Guard, GuardButton } from "@focuson-nw/form_components";`,
    `import { defaultDateFn, safeNumber, safeArray, safeString, applyOrDefault, requireBypassingReactCheck} from "@focuson-nw/utils";`,
    `import * as action from '../actions'`,
    `import { ${optionalsName ( mainP )} } from "${optionalsFileName ( `..`, params, mainP )}";`,
  ]
  let pageDomain = noExtension ( params.pageDomainsFile );
  let domain = noExtension ( params.domainsFile );
  const pageDomainsImports = pages.filter ( isMainPage ).map ( p => `import {${pageDomainName ( p )}} from "${domainsFileName ( '..', params, p )}";` )
  const domainImports = pages.flatMap ( p => sortedEntries ( dataDsIn ( [ p ] ) ).map ( ( [ name, dataD ] ) => `import {${domainName ( dataD )}} from "${domainsFileName ( '..', params, p )}"` ) )
  const modalDomainImports = pages.flatMap ( p => isModalPage ( p ) ? [
    `//if there is an error message here check that the PageD links to this DataD in a domain or rest block`,
    `import {${domainName ( p.display.dataDD )}} from '${modalImportFromFileName ( '..', mainP, p, params.domainsFile )}'; ` ] : [] )
  const modalRenderImports = pages.flatMap ( p => (isModalPage ( p ) && !p.display.dataDD.display) ? [
    `import {${componentName ( p.display.dataDD )}} from '${modalImportFromFileName ( '..', mainP, p, params.renderFile )}'` ] : [] )
  const pageLayoutImports = pages.flatMap ( p => toArray ( p.layout ) ).map ( layout => `import { ${layout.component.name} } from '${layout.component.import}';` )
  const guardImports: string[] = pages.flatMap ( p => Object.values ( safeObject ( p.guards ) ).flatMap ( g => safeArray ( makeGuard[ g.condition ]?.imports ) ) )
  const allImports = unique ( [ ...imports,
      ...modalDomainImports,
      ...modalRenderImports,
      ...makeComponentImports ( pages ),
      ...params.guardFnsFile ? [ `import * as guardFns from '${params.guardFnsFile}';` ] : [],
      ...makeButtonImports ( makeButton ),
      ...pageDomainsImports,
      ...pageLayoutImports,
      ...domainImports,
      ...guardImports ],
    s => s )
  // const history = hasNeedsHistory ( makeButton, page ) ? [ `const useHistory = requireBypassingReactCheck('react-router-dom')` ] : []
  return [ ...allImports, ...pageComponents, ...dataComponents ]
}


export function makeComponentImports<B, G> ( ps: PageD<B, G>[] ): string[] {
  let dataDs = sortedEntries ( dataDsIn ( ps ) );
  let allItemsWithDisplay: SimpleDisplayComp[] = dataDs.flatMap ( ( [ d, n ] ) => isDataDd ( n ) ? sortedEntries ( n.structure ).map ( a => a[ 1 ].dataDD ) : [] ).filter ( d => d.display ).map ( d => d.display );
  let allLayouts: SimpleDisplayComp[] = dataDs.flatMap ( ( [ n, dataD ] ) => toArray ( dataD.layout ).map ( layout => layout.component ) )
  let fromPageDisplay: SimpleDisplayComp[] = ps.flatMap ( p => p.display.dataDD.display ? [ p.display.dataDD.display ] : [] )
  return unique ( [ ...allItemsWithDisplay, ...fromPageDisplay, ...allLayouts ], d => `${d.import}/${d.name}` ).map ( d => `import { ${d.name} } from '${d.import}';` )
}
export function makeButtonImports<B, G> ( transformButtons: MakeButton<G> ): string[] {
  return unique ( sortedEntries ( transformButtons ).map ( ( [ name, creator ] ) => `import {${name}} from '${creator.import}';` ), x => x )
}
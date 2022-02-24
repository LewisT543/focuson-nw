import { sortedEntries } from "@focuson/utils";
import { PageD, RestDefnInPageProperties } from "../common/pageD";
import { domainName, fetcherName, hasDomainForPage, pageDomainName } from "./names";
import { CombinedParams, TSParams } from "./config";
import { imports, noExtension } from "./codegen";


export const makeFetcherCode = ( params: CombinedParams ) => ( p: PageD ) => ( def: RestDefnInPageProperties ): string[] => {
  const pageDomain = noExtension ( params.pageDomainsFile )
  const domain = noExtension ( params.domainsFile )
  const common = noExtension ( params.commonFile )
  const paramsString = sortedEntries ( def.rest.params ).flatMap ( ( [ name, params ] ) => "'" + name + "'" ).join ( ", " )
  let d = def.rest.dataDD;
  const dataType = domainName ( d )
  const targetFromPath = def.targetFromPath;
  return [
    `//fetcher type ${def.fetcher}`,
    `export function ${fetcherName ( def )}<S extends  HasSimpleMessages & HasTagHolder & HasPageSelection & ${pageDomain}.${hasDomainForPage ( p )}>(tagOps: TagOps<S,${params.commonFile}.${params.commonParams}>) {`,
    `  return pageAndTagFetcher<S, ${pageDomain}.${pageDomainName ( p )}, ${domain}.${dataType}, SimpleMessage>(`,
    `    ${common}.commonFetch<S,  ${domain}.${dataType}>(),`,
    `     '${p.name}',`,
    `     '${targetFromPath}',`,
    `     (s) => s.focusQuery('${targetFromPath}'),`,
    `     tagOps.tags(${paramsString}),`,
    `     tagOps.getReqFor('${def.rest.url}',undefined,${paramsString}))`,
    '}' ]

};


export function findAllFetchers ( ps: PageD[] ): [ PageD, RestDefnInPageProperties ][] {
  return ps.flatMap ( pd => sortedEntries ( pd.rest ).flatMap ( ( [ name, d ] ) => {
    let x: [ PageD, RestDefnInPageProperties ][] = d.fetcher ? [ [ pd, d ] ] : []
    return x
  } ) )
}

export const makeAllFetchers = ( params: CombinedParams, ps: PageD[] ): string[] => findAllFetchers ( ps ).flatMap ( ( [ pd, rd ] ) =>
  makeFetcherCode ( params ) ( pd ) ( rd ) );

interface FetcherDataStructureParams {
  stateName: string,
  variableName: string
}

export function makeFetchersImport ( params: TSParams ): string[] {
  return [
    ...imports ( params.pageDomainsFile, params.domainsFile, params.commonFile ),
  `import { FetcherTree,  } from "@focuson/fetcher";`,
  `import { HasTagHolder, TagOps } from "@focuson/template";`,
  `import { HasPageSelection } from "@focuson/pages";`,
  `import { HasSimpleMessages, SimpleMessage } from '@focuson/utils';`,
  `import { pageAndTagFetcher } from "@focuson/focuson";`
  ]
}
export function makeFetchersDataStructure ( params: CombinedParams, { stateName, variableName }: FetcherDataStructureParams, ps: PageD[] ): string[] {
  let fetchers = findAllFetchers ( ps );
  const common = noExtension ( params.commonFile )
  return [
    `export const ${variableName}: FetcherTree<${params.commonFile}.${stateName}> = {`,
    `fetchers: [`,
    ...fetchers.map ( ( [ pd, rd ], i ) => `   ${fetcherName ( rd )}<${common}.${stateName}>(${common}.commonIdOps)${i == fetchers.length - 1 ? '' : ','}` ),
    `],`,
    'children: []}',
  ]

}

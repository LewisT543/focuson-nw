import { copyFiles, DirectorySpec, templateFile, writeToFile } from "@focuson/files";
import { JavaWiringParams } from "../codegen/config";
import fs from "fs";
import { unique } from "../common/restD";
import { sortedEntries } from "@focuson/utils";
import { allMainPages, PageD, RestDefnInPageProperties } from "../common/pageD";
import { indentList } from "../codegen/codegen";
import { makeAllJavaVariableName } from "../codegen/makeSample";
import { allMapsName, fetcherInterfaceName, javaSqlCreateTableSqlName, javaSqlReadSqlName, mockFetcherClassName, queryClassName, restControllerName } from "../codegen/names";
import { makeGraphQlSchema } from "../codegen/makeGraphQlTypes";
import { makeAllJavaWiring, makeJavaResolversInterface } from "../codegen/makeJavaResolvers";
import { makeAllMockFetchers } from "../codegen/makeMockFetchers";
import { makeJavaVariablesForGraphQlQuery } from "../codegen/makeGraphQlQuery";
import { makeSpringEndpointsFor } from "../codegen/makeSpringEndpoint";
import { AppConfig } from "../focuson.config";
import { findSqlRoot, makeAggregateMapsFor, makeCreateTableSql, makeGetSqlFor, makeSqlDataFor, walkRoots, walkSqlData } from "../codegen/makeJavaSql";
import { isSqlResolverD } from "../common/resolverD";
import { JointAccountDd } from "../example/jointAccount/jointAccount.dataD";

export const makeJavaFiles = ( appConfig: AppConfig, javaOutputRoot: string, params: JavaWiringParams, directorySpec: DirectorySpec ) => <B, G> ( pages: PageD<B, G>[] ) => {

  const javaRoot = javaOutputRoot + "/java"
  const javaAppRoot = javaOutputRoot + "/java/" + params.applicationName
  const javaScriptRoot = javaAppRoot + "/scripts"
  const javaCodeRoot = javaAppRoot + "/src/main/java/focuson/data"
  const javaResourcesRoot = javaAppRoot + "/src/main/resources"
  const javaFetcherRoot = javaCodeRoot + "/" + params.fetcherPackage
  const javaControllerRoot = javaCodeRoot + "/" + params.controllerPackage
  const javaMockFetcherRoot = javaCodeRoot + "/" + params.mockFetcherPackage
  const javaQueriesPackages = javaCodeRoot + "/" + params.queriesPackage
  const javaDbPackages = javaCodeRoot + "/" + params.dbPackage
  const javaSql = javaResourcesRoot + "/" + params.sqlDirectory

  fs.mkdirSync ( `${javaOutputRoot}`, { recursive: true } )
  fs.mkdirSync ( `${javaAppRoot}`, { recursive: true } )
  fs.mkdirSync ( `${javaCodeRoot}`, { recursive: true } )
  fs.mkdirSync ( `${javaResourcesRoot}`, { recursive: true } )
  fs.mkdirSync ( `${javaScriptRoot}`, { recursive: true } )
  fs.mkdirSync ( `${javaFetcherRoot}`, { recursive: true } )
  fs.mkdirSync ( `${javaMockFetcherRoot}`, { recursive: true } )
  fs.mkdirSync ( `${javaControllerRoot}`, { recursive: true } )
  fs.mkdirSync ( `${javaQueriesPackages}`, { recursive: true } )
  fs.mkdirSync ( `${javaDbPackages}`, { recursive: true } )
  fs.mkdirSync ( `${javaSql}`, { recursive: true } )

// This isn't the correct aggregation... need to think about this. Multiple pages can ask for more. I think... we''ll have to refactor the structure
  const raw = allMainPages ( pages ).flatMap ( x => sortedEntries ( x.rest ) ).map ( ( x: [ string, RestDefnInPageProperties<G> ] ) => x[ 1 ].rest );
  const rests = unique ( raw, r => r.dataDD.name )
  copyFiles ( javaScriptRoot, 'templates/scripts', directorySpec ) ( 'makeJava.sh', 'makeJvmPact.sh', 'template.java' )

  templateFile ( `${javaAppRoot}/pom.xml`, 'templates/mvnTemplate.pom', params, directorySpec )
  copyFiles ( javaAppRoot, 'templates/raw/java', directorySpec ) ( 'application.properties' )
  templateFile ( `${javaCodeRoot}/SchemaController.java`, 'templates/raw/java/SchemaController.java', params, directorySpec )
  templateFile ( `${javaControllerRoot}/Transform.java`, 'templates/Transform.java', params, directorySpec )
  copyFiles ( javaAppRoot, 'templates/raw', directorySpec ) ( '.gitignore' )
  copyFiles ( javaCodeRoot, 'templates/raw/java', directorySpec ) ( 'CorsConfig.java' )


  allMainPages ( pages ).forEach ( p => {
    sortedEntries ( p.rest ).forEach ( ( [ restName, defn ] ) => {
      let resolver = defn.rest.resolver;
      if ( isSqlResolverD ( resolver ) ) {
        const getSql = resolver.get
        if ( getSql ) {
          const sqlData = makeSqlDataFor ( findSqlRoot ( defn.rest.dataDD, getSql ), getSql )
          walkSqlData ( sqlData, restName, ( sd, suffix ) =>
            writeToFile ( `${javaDbPackages}/${allMapsName ( p, suffix )}.java`, makeAggregateMapsFor (params, p, suffix, sd ) ) );
        }
      }
    } )
  } )

  writeToFile ( `${javaResourcesRoot}/${params.schema}`, makeGraphQlSchema ( rests ) )
  rests.forEach ( rest =>
    writeToFile ( `${javaCodeRoot}/${params.fetcherPackage}/${fetcherInterfaceName ( params, rest )}.java`, makeJavaResolversInterface ( params, rest ) )
  )
  writeToFile ( `${javaCodeRoot}/${params.wiringClass}.java`, makeAllJavaWiring ( params, rests, directorySpec ) )
  templateFile ( `${javaCodeRoot}/${params.applicationName}.java`, 'templates/JavaApplicationTemplate.java', params, directorySpec )
  rests.forEach ( restD => templateFile ( `${javaMockFetcherRoot}/${mockFetcherClassName ( params, restD )}.java`, 'templates/JavaFetcherClassTemplate.java',
    {
      ...params,
      fetcherInterface: fetcherInterfaceName ( params, restD ),
      fetcherClass: mockFetcherClassName ( params, restD ),
      thePackage: params.thePackage + "." + params.mockFetcherPackage,
      content: makeAllMockFetchers ( params, [ restD ] ).join ( "\n" )
    }, directorySpec ) )
  templateFile ( `${javaCodeRoot}/${params.sampleClass}.java`, 'templates/JavaSampleTemplate.java',
    { ...params, content: indentList ( makeAllJavaVariableName ( pages, 0 ) ).join ( "\n" ) }, directorySpec )
  rests.forEach ( r => templateFile ( `${javaQueriesPackages}/${queryClassName ( params, r )}.java`, 'templates/JavaQueryTemplate.java',
    {
      ...params,
      queriesClass: queryClassName ( params, r ),
      content: indentList ( makeJavaVariablesForGraphQlQuery ( [ r ] ) ).join ( "\n" )
    }, directorySpec ) )

  rests.forEach ( rest => writeToFile ( `${javaControllerRoot}/${restControllerName ( rest )}.java`, makeSpringEndpointsFor ( params, rest ) ) )

  rests.forEach ( rest => {
    if ( isSqlResolverD ( rest.resolver ) ) {
      let sqlG = rest.resolver.get;
      if ( sqlG ) {
        console.log ( 'sqlG', rest.dataDD.name )

        writeToFile ( `${javaSql}/${javaSqlCreateTableSqlName ( rest )}`, makeCreateTableSql ( rest.dataDD, sqlG ) )
        const sqlRoots = findSqlRoot ( JointAccountDd, sqlG );
        const sqlData = walkRoots ( sqlRoots, r => makeSqlDataFor ( r, sqlG ) )
        const makeSql = sqlData.flatMap ( makeGetSqlFor )
        writeToFile ( `${javaSql}/${javaSqlReadSqlName ( rest )}`, makeSql )

      }
    }
  } )

};
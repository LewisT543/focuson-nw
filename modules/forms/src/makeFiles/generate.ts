import { DirectorySpec } from "@focuson/files";
import { CombinedParams } from "../codegen/config";
import { MainPageD } from "../common/pageD";
import { makeJavaFiles } from "./makeJavaFiles";
import { makeTsFiles } from "./makeTsFiles";
import { ButtonD } from "../buttons/allButtons";
import { GuardWithCondition, MakeGuard } from "../buttons/guardButton";
import { MakeButton } from "../codegen/makeButtons";
import { AppConfig } from "../focuson.config";
import { validate } from "./validateModel";
import { unique } from "../common/restD";
import { safeArray } from "@focuson/utils";

export const generate = <G extends GuardWithCondition> ( appConfig: AppConfig, javaOutputRoot: string, tsRoot: string, focusOnVersion: string, makeGuards: MakeGuard<G>, makeButtons: MakeButton<G> ) => <B extends ButtonD> ( pages: MainPageD<B, G>[] ) => {
  const params: CombinedParams = {
    pagesFile: 'pages',
    focusOnVersion,
    commonParams: "CommonIds",
    stateName: "FState",
    commonFile: "common",
    pageDomainsFile: "pageDomains",
    domainsFile: "domains",
    fetchersFile: "fetchers",
    mockFetcherPackage: "mockfetchers",
    controllerPackage: "controllers",
    restsFile: "rests",
    pactsFile: "pact.spec",
    samplesFile: "samples",
    emptyFile: "empty",
    renderFile: "render",
    urlparams: 'commonIds',
    queriesPackage: 'queries',
    thePackage: 'focuson.data',
    applicationName: 'ExampleApp',
    fetcherPackage: 'fetchers',
    fetcherInterface: 'FFetcher',
    wiringClass: 'Wiring',
    fetcherClass: 'MockFetchers',
    schema: 'someSchema.graphql',
    sampleClass: 'Sample',
    dbPackage: 'db',
    sqlDirectory: 'sql'
  };

  console.log ( 0 )
  console.log ( "focusOnVersion", focusOnVersion )
  const directorySpec: DirectorySpec = {
    main: '.',
    backup: 'node_modules/@focuson/forms'
  }

  validate ( pages )
  const fullPages = unique ( pages.flatMap ( p => [ p, ...safeArray(p.modals).map ( m => m.modal ) ] ), p => p.name )

  makeJavaFiles ( appConfig, javaOutputRoot, params, directorySpec ) ( fullPages )
  makeTsFiles<G> ( appConfig, tsRoot, params, makeGuards, makeButtons, directorySpec ) ( fullPages )
};
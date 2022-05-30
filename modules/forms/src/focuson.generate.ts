import { directorySpec, generate, params } from "./makeFiles/generate";
import *  as fse from "fs-extra";
import { devAppConfig, focusOnVersion, generatedPages, javaOutputRoot, tsRoot } from "./focuson.config";
import { AllGuardCreator } from "./buttons/guardButton";
import { makeButtons } from "./buttons/allButtons";
import { GenerateLogLevel, safeObject, toArray } from "@focuson/utils";
import { mapRestAndActions, RestD } from "./common/restD";
import { MainPageD } from "./common/pageD";
import { allOutputParams, MutationDetail } from "./common/resolverD";


const logLevel: GenerateLogLevel = 'detailed';



generate ( logLevel, directorySpec, devAppConfig, { ...params, focusOnVersion, thePackage: 'focuson.data', theme: "theme-dark" }, javaOutputRoot, tsRoot, AllGuardCreator, makeButtons () ) ( generatedPages )


fse.copySync ( '../formComponents/src', tsRoot + "/src/formComponents" )
fse.copySync ( './templates/raw/ts/public', tsRoot + "/public" )



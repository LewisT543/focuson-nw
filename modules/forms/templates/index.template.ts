import { SelectedPage } from "@focuson/pages";
import { getElement } from "@focuson/state";
import ReactDOM from "react-dom";
import {  {stateName}, identityL } from "./{commonFile}";
import { context } from "./config";
import { defaultDateFn } from "@focuson/utils";
import { IndexPage } from "@focuson/form_components";
import { config, start } from "./config";
import { focusOnMiddlewareFor{teamName}, {teamName}Reducer, makeLsFor{teamName} } from "./store";
import { applyMiddleware, combineReducers, legacy_createStore } from "@reduxjs/toolkit";
import { Lenses } from '@focuson/lens'

export const combineAll = combineReducers ( {
   {teamName}: {teamName}Reducer ( identityL )
} )
export const store: any = legacy_createStore ( combineAll, undefined, applyMiddleware ( 
  focusOnMiddlewareFor{teamName} ( config, context, Lenses.identity<any> ().focusOn ( '{teamName}' ) ) ) );
let rootElement = getElement ( "root" );
console.log ( "set json" )
store.subscribe ( () => {
  ReactDOM.render (
    <IndexPage state={makeLsFor{teamName}<{stateName}> ( store, '{teamName}' )} dateFn={defaultDateFn}>
  <SelectedPage state={makeLsFor{teamName}<{stateName}> ( store, '{teamName}' )}/>
  </IndexPage>, rootElement )
} )

console.log ( "dispatching" )
store.dispatch ( { type: 'setMain', s: start, team: '{teamName}' } )
console.log ( "dispatched" )

import { DateDD, MoneyDD } from "../common/dataD";
import { EAccountsSummaryDD, EAccountsSummaryTableDD } from "../example/eAccounts/eAccountsSummary.dataD";
import { createAllReactCalls, createAllReactComponents, createOneReact, createReactComponent, createReactPageComponent, listComponentsIn, processParam } from "../codegen/makeRender";
import { DisplayCompParamType, LabelAndNumberInputCD, LabelAndStringInputCD, TableCD } from "../common/componentsD";
import { EAccountsSummaryPD } from "../example/eAccounts/eAccountsSummary.pageD";
import { paramsForTest } from "./makeJavaResolvers.spec";
import { CreatePlanPD } from "../example/eAccounts/createPlanPD";
import { transformButtons } from "../buttons/allButtons";
import { occupationIncomeDetailsDD } from "../example/occupationAndIncomeDetails/occupationAndIncome.dataD";
import { ETransferDataD } from "../example/eTransfers/eTransfers.dataD";

//
describe ( " listComponentsIn", () => {
  it ( "should make the react component lists", () => {
    expect ( createAllReactCalls ( listComponentsIn ( EAccountsSummaryDD ) ).map ( s => s.replace ( /"/g, "'" ) ) ).toEqual ( [
      "<LabelAndBooleanInput id={`${id}.useEStatements`} state={state.focusOn('useEStatements')} mode={mode} label='use e statements' />",
      "<Table id={`${id}.eAccountsTable`} state={state.focusOn('eAccountsTable')} mode={mode} order={['accountId','displayType','description','virtualBankSeq','frequency','total']} />",
      "<LabelAndNumberInput id={`${id}.totalMonthlyCost`} state={state.focusOn('totalMonthlyCost')} mode={mode} label='total monthly cost' required={true} />",
      "<LabelAndNumberInput id={`${id}.oneAccountBalance`} state={state.focusOn('oneAccountBalance')} mode={mode} label='one account balance' required={true} />",
      "<LabelAndNumberInput id={`${id}.currentAccountBalance`} state={state.focusOn('currentAccountBalance')} mode={mode} label='current account balance' required={true} />",
      "<LabelAndStringInput id={`${id}.createPlan.createPlanStart`} state={state.focusOn('createPlan').focusOn('createPlanStart')} mode={mode} label='Create Start' required={true} />",
      "<LabelAndStringInput id={`${id}.createPlan.createPlanDate`} state={state.focusOn('createPlan').focusOn('createPlanDate')} mode={mode} label='create plan date' required={true} ariaLabel='The Create Plan Date' />",
      "<LabelAndStringInput id={`${id}.createPlan.createPlanEnd`} state={state.focusOn('createPlan').focusOn('createPlanEnd')} mode={mode} label='create plan end' required={true} />"
    ] )
  } )

  it ( "should createReactComponent", () => {
    expect ( createReactComponent ( EAccountsSummaryDD ).map ( s => s.replace ( /"/g, "'" ) ) ).toEqual ( [
      "export function EAccountsSummaryDD<S, Context extends FocusOnContext<S>>({id,state,mode}: FocusedProps<S, EAccountsSummaryDDDomain,Context>){",
      "  return(<>",
      "  <LabelAndBooleanInput id={`${id}.useEStatements`} state={state.focusOn('useEStatements')} mode={mode} label='use e statements' />",
      "  <Table id={`${id}.eAccountsTable`} state={state.focusOn('eAccountsTable')} mode={mode} order={['accountId','displayType','description','virtualBankSeq','frequency','total']} />",
      "  <LabelAndNumberInput id={`${id}.totalMonthlyCost`} state={state.focusOn('totalMonthlyCost')} mode={mode} label='total monthly cost' required={true} />",
      "  <LabelAndNumberInput id={`${id}.oneAccountBalance`} state={state.focusOn('oneAccountBalance')} mode={mode} label='one account balance' required={true} />",
      "  <LabelAndNumberInput id={`${id}.currentAccountBalance`} state={state.focusOn('currentAccountBalance')} mode={mode} label='current account balance' required={true} />",
      "  <LabelAndStringInput id={`${id}.createPlan.createPlanStart`} state={state.focusOn('createPlan').focusOn('createPlanStart')} mode={mode} label='Create Start' required={true} />",
      "  <LabelAndStringInput id={`${id}.createPlan.createPlanDate`} state={state.focusOn('createPlan').focusOn('createPlanDate')} mode={mode} label='create plan date' required={true} ariaLabel='The Create Plan Date' />",
      "  <LabelAndStringInput id={`${id}.createPlan.createPlanEnd`} state={state.focusOn('createPlan').focusOn('createPlanEnd')} mode={mode} label='create plan end' required={true} />",
      "</>)",
      "}",
      ""
    ] )
  } )
  it ( "should createAllReactComponents ", () => {
    expect ( createAllReactComponents ( paramsForTest, transformButtons, [ EAccountsSummaryPD, CreatePlanPD ] ).map ( s => s.replace ( /"/g, "'" ) ) ).toEqual ( [
      "import { LensProps } from '@focuson/state';",
      "import { Layout } from '../copied/layout';",
      "import { FocusOnContext } from '@focuson/focuson';",
      "import {  focusedPage, focusedPageWithExtraState,   fullState,pageState} from '@focuson/pages';",
      "import { Context, FocusedProps } from '../common';",
      "import { Lenses } from '@focuson/lens';",
      "import { Guard } from '../copied/guard';",
      "import {CreatePlanDDDomain} from '../EAccountsSummary/EAccountsSummary.domains'",
      "import {CreatePlanDD} from '../EAccountsSummary/EAccountsSummary.render'",
      "import { LabelAndStringInput } from '../copied/LabelAndInput';",
      "import { LabelAndNumberInput } from '../copied/LabelAndInput';",
      "import { Table } from '../copied/table';",
      "import { LabelAndBooleanInput } from '../copied/LabelAndInput';",
      "import { LabelAndRadio } from '../copied/Radio';",
      "import {ListNextButton} from '../copied/listNextPrevButtons';",
      "import {ListPrevButton} from '../copied/listNextPrevButtons';",
      "import {ModalButton} from '@focuson/pages';",
      "import {ModalCancelButton} from '@focuson/pages';",
      "import {ModalCommitButton} from '@focuson/pages';",
      "import {RestButton} from '../copied/rest';",
      "import {ValidationButton} from '../copied/ValidationButton';",
      "import {EAccountsSummaryPageDomain} from '../EAccountsSummary/EAccountsSummary.domains';",
      "import {CreatePlanDDDomain} from '../EAccountsSummary/EAccountsSummary.domains'",
      "import {EAccountsSummaryDDDomain} from '../EAccountsSummary/EAccountsSummary.domains'",
      "import {EAccountSummaryDDDomain} from '../EAccountsSummary/EAccountsSummary.domains'",
      "export function EAccountsSummaryPage<S, Context extends FocusOnContext<S>>(){",
      "  return focusedPageWithExtraState<S, EAccountsSummaryPageDomain, EAccountsSummaryDDDomain, Context> ( s => 'EAccountsSummary' ) ( s => s.focusOn('fromApi')) (\n    ( fullState, state , full, d, mode) => {",
      "  return (<Layout  details='[1][3,3][5]'>",
      "     <EAccountsSummaryDD id='root' state={state}  mode={mode} />",
      "     <ModalButton id='amendExistingPlan' text='amendExistingPlan'  state={state} modal = 'CreatePlan'  focusOn={['EAccountsSummary','tempCreatePlan']} copyFrom={['EAccountsSummary','fromApi','createPlan']}    pageMode='edit'   rest={{'name':'EAccountsSummary_CreatePlanDDRestDetails','restAction':'update','path':['EAccountsSummary']}} />",
      "     <ModalButton id='createNewPlan' text='createNewPlan'  state={state} modal = 'CreatePlan'  focusOn={['EAccountsSummary','tempCreatePlan']}  createEmpty={empty.emptyCreatePlanDD}   pageMode='create'   rest={{'name':'EAccountsSummary_CreatePlanDDRestDetails','restAction':'create','path':['EAccountsSummary']}} />",
      "     <RestButton  id='deleteExistingPlan'   name='deleteExistingPlan' action='delete' path={['EAccountsSummary','fromApi']} state={state} rest='EAccountsSummary_CreatePlanDDRestDetails' confirm={true} />",
      "     <button>refresh of type ResetStateButton cannot be created yet</button>",
      "   </Layout>)})}",
      "",
      "export function CreatePlanPage<S, Context extends FocusOnContext<S>>(){",
      "  return focusedPage<S, CreatePlanDDDomain, Context> ( s => '' ) (",
      "     ( state, d, mode ) => {",
      "          return (<Layout  details='[3]'>",
      "               <CreatePlanDD id='root' state={state}  mode={mode} />",
      "               <ModalCancelButton id='cancel' state={state} />",
      "               <ModalCommitButton id='commit'  state={state} />",
      "            </Layout>)})}",
      "",
      "export function CreatePlanDD<S, Context extends FocusOnContext<S>>({id,state,mode}: FocusedProps<S, CreatePlanDDDomain,Context>){",
      "  return(<>",
      "  <LabelAndStringInput id={`${id}.createPlanStart`} state={state.focusOn('createPlanStart')} mode={mode} label='Create Start' required={true} />",
      "  <LabelAndStringInput id={`${id}.createPlanDate`} state={state.focusOn('createPlanDate')} mode={mode} label='create plan date' required={true} ariaLabel='The Create Plan Date' />",
      "  <LabelAndStringInput id={`${id}.createPlanEnd`} state={state.focusOn('createPlanEnd')} mode={mode} label='create plan end' required={true} />",
      "</>)",
      "}",
      "",
      "export function EAccountsSummaryDD<S, Context extends FocusOnContext<S>>({id,state,mode}: FocusedProps<S, EAccountsSummaryDDDomain,Context>){",
      "  return(<>",
      "  <LabelAndBooleanInput id={`${id}.useEStatements`} state={state.focusOn('useEStatements')} mode={mode} label='use e statements' />",
      "  <Table id={`${id}.eAccountsTable`} state={state.focusOn('eAccountsTable')} mode={mode} order={['accountId','displayType','description','virtualBankSeq','frequency','total']} />",
      "  <LabelAndNumberInput id={`${id}.totalMonthlyCost`} state={state.focusOn('totalMonthlyCost')} mode={mode} label='total monthly cost' required={true} />",
      "  <LabelAndNumberInput id={`${id}.oneAccountBalance`} state={state.focusOn('oneAccountBalance')} mode={mode} label='one account balance' required={true} />",
      "  <LabelAndNumberInput id={`${id}.currentAccountBalance`} state={state.focusOn('currentAccountBalance')} mode={mode} label='current account balance' required={true} />",
      "  <LabelAndStringInput id={`${id}.createPlan.createPlanStart`} state={state.focusOn('createPlan').focusOn('createPlanStart')} mode={mode} label='Create Start' required={true} />",
      "  <LabelAndStringInput id={`${id}.createPlan.createPlanDate`} state={state.focusOn('createPlan').focusOn('createPlanDate')} mode={mode} label='create plan date' required={true} ariaLabel='The Create Plan Date' />",
      "  <LabelAndStringInput id={`${id}.createPlan.createPlanEnd`} state={state.focusOn('createPlan').focusOn('createPlanEnd')} mode={mode} label='create plan end' required={true} />",
      "</>)",
      "}",
      "",
      "export function EAccountSummaryDD<S, Context extends FocusOnContext<S>>({id,state,mode}: FocusedProps<S, EAccountSummaryDDDomain,Context>){",
      "  return(<>",
      "  <LabelAndNumberInput id={`${id}.accountId`} state={state.focusOn('accountId')} mode={mode} label='Account Id' required={true} min={10000000} max={99999999} />",
      "  <LabelAndRadio id={`${id}.displayType`} state={state.focusOn('displayType')} mode={mode} label='display type' enums={{'savings':'Savings','checking':'Checking'}} />",
      "  <LabelAndStringInput id={`${id}.description`} state={state.focusOn('description')} mode={mode} label='description' required={true} />",
      "  <LabelAndStringInput id={`${id}.virtualBankSeq`} state={state.focusOn('virtualBankSeq')} mode={mode} label='virtual bank seq' required={true} />",
      "  <LabelAndNumberInput id={`${id}.total`} state={state.focusOn('total')} mode={mode} label='total' required={true} />",
      "  <LabelAndStringInput id={`${id}.frequency`} state={state.focusOn('frequency')} mode={mode} label='Frequency/Amount' required={true} />",
      "</>)",
      "}",
      ""
    ])
  } )

  it ( "should createReactPageComponent", () => {
    expect ( createReactPageComponent ( paramsForTest, transformButtons, EAccountsSummaryPD ).map ( s => s.replace ( /"/g, "'" ) ) ).toEqual ( [
      "export function EAccountsSummaryPage<S, Context extends FocusOnContext<S>>(){",
      "  return focusedPageWithExtraState<S, EAccountsSummaryPageDomain, EAccountsSummaryDDDomain, Context> ( s => 'EAccountsSummary' ) ( s => s.focusOn('fromApi')) (\n    ( fullState, state , full, d, mode) => {",
      "  return (<Layout  details='[1][3,3][5]'>",
      "     <EAccountsSummaryDD id='root' state={state}  mode={mode} />",
      "     <ModalButton id='amendExistingPlan' text='amendExistingPlan'  state={state} modal = 'CreatePlan'  focusOn={['EAccountsSummary','tempCreatePlan']} copyFrom={['EAccountsSummary','fromApi','createPlan']}    pageMode='edit'   rest={{'name':'EAccountsSummary_CreatePlanDDRestDetails','restAction':'update','path':['EAccountsSummary']}} />",
      "     <ModalButton id='createNewPlan' text='createNewPlan'  state={state} modal = 'CreatePlan'  focusOn={['EAccountsSummary','tempCreatePlan']}  createEmpty={empty.emptyCreatePlanDD}   pageMode='create'   rest={{'name':'EAccountsSummary_CreatePlanDDRestDetails','restAction':'create','path':['EAccountsSummary']}} />",
      "     <RestButton  id='deleteExistingPlan'   name='deleteExistingPlan' action='delete' path={['EAccountsSummary','fromApi']} state={state} rest='EAccountsSummary_CreatePlanDDRestDetails' confirm={true} />",
      "     <button>refresh of type ResetStateButton cannot be created yet</button>",
      "   </Layout>)})}",
      ""
    ])
    expect ( createReactPageComponent ( paramsForTest, transformButtons, CreatePlanPD ).map ( s => s.replace ( /"/g, "'" ) ) ).toEqual ( [
      "export function CreatePlanPage<S, Context extends FocusOnContext<S>>(){",
      "  return focusedPage<S, CreatePlanDDDomain, Context> ( s => '' ) (",
      "     ( state, d, mode ) => {",
      "          return (<Layout  details='[3]'>",
      "               <CreatePlanDD id='root' state={state}  mode={mode} />",
      "               <ModalCancelButton id='cancel' state={state} />",
      "               <ModalCommitButton id='commit'  state={state} />",
      "            </Layout>)})}",
      ""
    ])
  } )
} )

describe ( "makeComponentWithGuard", () => {
  it ( "should make guard variables", () => {
    expect ( createReactComponent ( occupationIncomeDetailsDD ).slice ( 0, 5 ).map ( r => r.replace ( /"/g, "'" ) ) ).toEqual ( [
      "export function OccupationIncomeDetailsDD<S, Context extends FocusOnContext<S>>({id,state,mode}: FocusedProps<S, OccupationIncomeDetailsDDDomain,Context>){",
      "const areYouGuard = state.chainLens(Lenses.fromPath(['areYou'])).optJson();console.log('areYouGuard', areYouGuard)",
      "  return(<>",
      "  <LabelAndStringInput id={`${id}.areYou`} state={state.focusOn('areYou')} mode={mode} label='are you' required={true} />",
      "  <Guard value={areYouGuard} cond={['E','S']}><LabelAndStringInput id={`${id}.currentEmployment`} state={state.focusOn('currentEmployment')} mode={mode} label='current employment' required={true} /></Guard>"
    ] )
  } )
} )

describe ( "make components - the different parameter types", () => {
  function makeParam ( theType: DisplayCompParamType, val: string | string[] ) {
    return processParam ( [ 'some', 'path' ], EAccountsSummaryDD, { ...LabelAndStringInputCD, params: { p1: { paramType: theType, needed: 'no' } } } ) ( 'p1', val );
  }
  it ( "should create paramtype object", () => {
    expect ( makeParam ( 'object', 'obj' ) ).toEqual ( '{obj}' )
  } )
  it ( "should create paramtype boolean", () => {
    expect ( makeParam ( 'boolean', 'obj' ) ).toEqual ( '{obj}' )
  } )
  it ( "should create paramtype string", () => {
    expect ( makeParam ( 'string', 'obj' ) ).toEqual ( "'obj'" )
  } )
  it ( "should create paramtype string[]", () => {
    expect ( makeParam ( 'string[]', [ 'a', 'b' ] ).replace ( /"/g, "'" ) ).toEqual ( "{['a','b']}" )
  } )
  it ( "should create paramtype state", () => {
    expect ( makeParam ( 'state', [ 'a', 'b' ] ).replace ( /"/g, "'" ) ).toEqual ( "{state.focusOn('a').focusOn('b')}" )
  } )
  it ( "should create paramtype stateValue", () => {
    expect ( makeParam ( 'stateValue', [ 'a', 'b' ] ).replace ( /"/g, "'" ) ).toEqual ( "{state.focusOn('a').focusOn('b').json()}" )
  } )
  it ( "should create paramtype pageState", () => {
    expect ( makeParam ( 'pageState', [ 'a', 'b' ] ).replace ( /"/g, "'" ) ).toEqual ( "{pageState(state).focusOn('a').focusOn('b')}" )
  } )
  it ( "should create paramtype pageStateValue", () => {
    expect ( makeParam ( 'pageStateValue', [ 'a', 'b' ] ).replace ( /"/g, "'" ) ).toEqual ( "{pageState(state).focusOn('a').focusOn('b').json()}" )
  } )
  it ( "should create paramtype fullState", () => {
    expect ( makeParam ( 'fullState', [ 'a', 'b' ] ).replace ( /"/g, "'" ) ).toEqual ( "{fullState(state).focusOn('a').focusOn('b')}" )
  } )
  it ( "should create paramtype fullStateValue", () => {
    expect ( makeParam ( 'fullStateValue', [ 'a', 'b' ] ).replace ( /"/g, "'" ) ).toEqual ( "{fullState(state).focusOn('a').focusOn('b').json()}" )
  } )


} )
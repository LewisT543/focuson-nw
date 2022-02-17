import { DateDD, MoneyDD } from "../common/dataD";
import { EAccountsSummaryDD, EAccountsSummaryTableDD } from "../example/eAccountsSummary.dataD";
import { createAllReactCalls, createAllReactComponents, createReactComponent, createReactPageComponent, listComponentsIn } from "../codegen/makeComponents";
import { LabelAndInputCD, TableCD } from "../common/componentsD";
import { createPlanPD, EAccountsSummaryPD } from "../example/eAccountsSummary.pageD";


describe ( " listComponentsIn", () => {
  it ( "should list the components used to display the ", () => {
    let expected = [
      { dataDD: EAccountsSummaryTableDD, display: TableCD, path: [ "eAccountsTable" ] },
      { dataDD: { ...MoneyDD, resolver: 'getTotalMonthlyCost', sample: [ '1000' ] }, display: LabelAndInputCD, path: [ "totalMonthlyCost" ] },
      { dataDD: { ...MoneyDD, resolver: 'getOneAccountBalance', sample: [ '9921' ] }, display: LabelAndInputCD, path: [ "oneAccountBalance" ] },
      { dataDD: { ...MoneyDD, resolver: 'getCurrentAccountBalance', sample:[ "12321"] }, display: LabelAndInputCD, path: [ "currentAccountBalance" ] },
      { dataDD: DateDD, display: LabelAndInputCD, displayParams: { label: 'Create Start' }, path: [ "createPlan", "createPlanStart" ] },
      { dataDD: DateDD, display: LabelAndInputCD, displayParams: { ariaLabel: 'The Create Plan Date' }, path: [ "createPlan", "createPlanDate" ] },
      { dataDD: DateDD, display: LabelAndInputCD, path: [ "createPlan", "createPlanEnd" ] }
    ];
    let actual = listComponentsIn ( EAccountsSummaryDD );
    for ( let i = 0; i < actual.length; i++ ) {
      let a: any = actual[ i ]
      let e: any = expected[ i ]
      // console.log ( "loop", i , a.dataDD.name, e.dataDD.name)
      expect ( a.dataDD ).toEqual ( e.dataDD )
      expect ( a.display ).toEqual ( e.display )
      expect ( a.displayParams ).toEqual ( e.displayParams )
      expect ( a.path ).toEqual ( e.path )
    }
    expect ( actual.length ).toEqual ( expected.length )
    expect ( actual ).toEqual ( expected )
  } )

  it ( "should make the react component lists", () => {
    expect ( createAllReactCalls ( listComponentsIn ( EAccountsSummaryDD ) ) ).toEqual (
      [
        "<Table state={state.focusOn('eAccountsTable')} order={['accountId','displayType','description','virtualBankSeq','frequency','total']} />",
        "<LabelAndInput state={state.focusOn('totalMonthlyCost')} label='totalMonthlyCostCC' />",
        "<LabelAndInput state={state.focusOn('oneAccountBalance')} label='oneAccountBalanceCC' />",
        "<LabelAndInput state={state.focusOn('currentAccountBalance')} label='currentAccountBalanceCC' />",
        "<LabelAndInput state={state.focusOn('createPlan').focusOn('createPlanStart')} label='Create Start' />",
        "<LabelAndInput state={state.focusOn('createPlan').focusOn('createPlanDate')} label='createPlanDateCC' ariaLabel='The Create Plan Date' />",
        "<LabelAndInput state={state.focusOn('createPlan').focusOn('createPlanEnd')} label='createPlanEndCC' />"
      ]
    )
  } )

  it ( "should createReactComponent", () => {
    expect ( createReactComponent ( EAccountsSummaryDD ) ).toEqual ( [
      "function EAccountsSummaryDD<S>({state}: LensProps<S, EAccountsSummaryDDDomain>){",
      "  return(<>",
      "  <Table state={state.focusOn('eAccountsTable')} order={['accountId','displayType','description','virtualBankSeq','frequency','total']} />",
      "  <LabelAndInput state={state.focusOn('totalMonthlyCost')} label='totalMonthlyCostCC' />",
      "  <LabelAndInput state={state.focusOn('oneAccountBalance')} label='oneAccountBalanceCC' />",
      "  <LabelAndInput state={state.focusOn('currentAccountBalance')} label='currentAccountBalanceCC' />",
      "  <LabelAndInput state={state.focusOn('createPlan').focusOn('createPlanStart')} label='Create Start' />",
      "  <LabelAndInput state={state.focusOn('createPlan').focusOn('createPlanDate')} label='createPlanDateCC' ariaLabel='The Create Plan Date' />",
      "  <LabelAndInput state={state.focusOn('createPlan').focusOn('createPlanEnd')} label='createPlanEndCC' />",
      "</>)",
      "}"
    ] )
  } )
  it ( "should createAllReactComponents ", () => {
    expect ( createAllReactComponents ( [ EAccountsSummaryPD, createPlanPD, EAccountsSummaryPD, createPlanPD ] ) ).toEqual ( [
      "function EAccountsSummaryPage<S>({state}: LensProps<S, EAccountsSummaryDDDomain>){",
      "  return (<Layout  details='[1][3,3][5]'>",
      "   <EAccountsSummaryDD state={state} />",
      "   <ModalButton id='amendExistingPlan' state={state} mode='edit' mainData='fromApi' tempData='temp' rest='createPlanRestD' action='update'  />",
      "   <ModalButton id='createNewPlan' state={state} mode='create'  tempData='temp' rest='createPlanRestD' action='create'  />",
      "   <RestButton id='deleteExistingPlan' state={state} />",
      "   <RestButton id='refresh' state={state} />",
      "   <ModalButton id='requestInfo' state={state} mode='view' mainData='TDB' tempData='TBD'   />",
      "   </Layout>)",
      "}",
      "function CreatePlanPage<S>({state}: LensProps<S, CreatePlanDDDomain>){",
      "  return (<Layout  details='[3]'>",
      "   <CreatePlanDD state={state} />",
      "   <ModalCancelButton id='cancel' state={state} />",
      "   <ModalCommitButton id='commit' state={state} />",
      "   </Layout>)",
      "}",
      "function EAccountsSummaryPage<S>({state}: LensProps<S, EAccountsSummaryDDDomain>){",
      "  return (<Layout  details='[1][3,3][5]'>",
      "   <EAccountsSummaryDD state={state} />",
      "   <ModalButton id='amendExistingPlan' state={state} mode='edit' mainData='fromApi' tempData='temp' rest='createPlanRestD' action='update'  />",
      "   <ModalButton id='createNewPlan' state={state} mode='create'  tempData='temp' rest='createPlanRestD' action='create'  />",
      "   <RestButton id='deleteExistingPlan' state={state} />",
      "   <RestButton id='refresh' state={state} />",
      "   <ModalButton id='requestInfo' state={state} mode='view' mainData='TDB' tempData='TBD'   />",
      "   </Layout>)",
      "}",
      "function CreatePlanPage<S>({state}: LensProps<S, CreatePlanDDDomain>){",
      "  return (<Layout  details='[3]'>",
      "   <CreatePlanDD state={state} />",
      "   <ModalCancelButton id='cancel' state={state} />",
      "   <ModalCommitButton id='commit' state={state} />",
      "   </Layout>)",
      "}",
      "function CreatePlanDD<S>({state}: LensProps<S, CreatePlanDDDomain>){",
      "  return(<>",
      "  <LabelAndInput state={state.focusOn('createPlanStart')} label='Create Start' />",
      "  <LabelAndInput state={state.focusOn('createPlanDate')} label='createPlanDateCC' ariaLabel='The Create Plan Date' />",
      "  <LabelAndInput state={state.focusOn('createPlanEnd')} label='createPlanEndCC' />",
      "</>)",
      "}",
      "function EAccountsSummaryDD<S>({state}: LensProps<S, EAccountsSummaryDDDomain>){",
      "  return(<>",
      "  <Table state={state.focusOn('eAccountsTable')} order={['accountId','displayType','description','virtualBankSeq','frequency','total']} />",
      "  <LabelAndInput state={state.focusOn('totalMonthlyCost')} label='totalMonthlyCostCC' />",
      "  <LabelAndInput state={state.focusOn('oneAccountBalance')} label='oneAccountBalanceCC' />",
      "  <LabelAndInput state={state.focusOn('currentAccountBalance')} label='currentAccountBalanceCC' />",
      "  <LabelAndInput state={state.focusOn('createPlan').focusOn('createPlanStart')} label='Create Start' />",
      "  <LabelAndInput state={state.focusOn('createPlan').focusOn('createPlanDate')} label='createPlanDateCC' ariaLabel='The Create Plan Date' />",
      "  <LabelAndInput state={state.focusOn('createPlan').focusOn('createPlanEnd')} label='createPlanEndCC' />",
      "</>)",
      "}"
    ] )
  } )

  it ( "should createReactPageComponent", () => {
    expect ( createReactPageComponent ( EAccountsSummaryPD ) ).toEqual ( [
      "function EAccountsSummaryPage<S>({state}: LensProps<S, EAccountsSummaryDDDomain>){",
      "  return (<Layout  details='[1][3,3][5]'>",
      "   <EAccountsSummaryDD state={state} />",
      "   <ModalButton id='amendExistingPlan' state={state} mode='edit' mainData='fromApi' tempData='temp' rest='createPlanRestD' action='update'  />",
      "   <ModalButton id='createNewPlan' state={state} mode='create'  tempData='temp' rest='createPlanRestD' action='create'  />",
      "   <RestButton id='deleteExistingPlan' state={state} />",
      "   <RestButton id='refresh' state={state} />",
      "   <ModalButton id='requestInfo' state={state} mode='view' mainData='TDB' tempData='TBD'   />",
      "   </Layout>)",
      "}"
    ] )
    expect ( createReactPageComponent ( createPlanPD ) ).toEqual ( [
      "function CreatePlanPage<S>({state}: LensProps<S, CreatePlanDDDomain>){",
      "  return (<Layout  details='[3]'>",
      "   <CreatePlanDD state={state} />",
      "   <ModalCancelButton id='cancel' state={state} />",
      "   <ModalCommitButton id='commit' state={state} />",
      "   </Layout>)",
      "}"
    ] )
  } )
} )


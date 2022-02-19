import { LensProps } from "@focuson/state";

function EAccountsSummaryPage<S>({state}: LensProps<S, EAccountsSummaryDDDomain>){
  return (<Layout  details='[1][3,3][5]'>
   <EAccountsSummaryDD state={state} />
   <ModalButton id='amendExistingPlan' state={state} mode='edit' mainData='fromApi' tempData='temp' rest='createPlanRestD' action='update'  />
   <ModalButton id='createNewPlan' state={state} mode='create'  tempData='temp' rest='createPlanRestD' action='create'  />
   <RestButton id='deleteExistingPlan' state={state} />
   <RestButton id='refresh' state={state} />
   <ModalButton id='requestInfo' state={state} mode='view' mainData='TDB' tempData='TBD'   />
   </Layout>)
}
function CreatePlanPage<S>({state}: LensProps<S, CreatePlanDDDomain>){
  return (<Layout  details='[3]'>
   <CreatePlanDD state={state} />
   <ModalCancelButton id='cancel' state={state} />
   <ModalCommitButton id='commit' state={state} />
   </Layout>)
}
function CreatePlanDD<S>({state}: LensProps<S, CreatePlanDDDomain>){
  return(<>
  <LabelAndInput state={state.focusOn('createPlanStart')} label='Create Start' />
  <LabelAndInput state={state.focusOn('createPlanDate')} label='createPlanDateCC' ariaLabel='The Create Plan Date' />
  <LabelAndInput state={state.focusOn('createPlanEnd')} label='createPlanEndCC' />
</>)
}
function EAccountsSummaryDD<S>({state}: LensProps<S, EAccountsSummaryDDDomain>){
  return(<>
  <Table state={state.focusOn('eAccountsTable')} order={['accountId','displayType','description','virtualBankSeq','frequency','total']} />
  <LabelAndInput state={state.focusOn('totalMonthlyCost')} label='totalMonthlyCostCC' />
  <LabelAndInput state={state.focusOn('oneAccountBalance')} label='oneAccountBalanceCC' />
  <LabelAndInput state={state.focusOn('currentAccountBalance')} label='currentAccountBalanceCC' />
  <LabelAndInput state={state.focusOn('createPlan').focusOn('createPlanStart')} label='Create Start' />
  <LabelAndInput state={state.focusOn('createPlan').focusOn('createPlanDate')} label='createPlanDateCC' ariaLabel='The Create Plan Date' />
  <LabelAndInput state={state.focusOn('createPlan').focusOn('createPlanEnd')} label='createPlanEndCC' />
</>)
}
export interface CreatePlanDDDomain{
  createPlanDate: string;
  createPlanEnd: string;
  createPlanStart: string;
}
export interface EAccountsSummaryDDDomain{
  createPlan: CreatePlanDDDomain;
  currentAccountBalance: string;
  eAccountsTable: EAccountSummaryDDDomain[];
  oneAccountBalance: string;
  totalMonthlyCost: string;
}
export interface EAccountSummaryDDDomain{
  accountId: string;
  description: string;
  displayType: string;
  frequency: string;
  total: string;
  virtualBankSeq: string;
}
import * as domains from './domains';
import * as empty from './empty';
import { LensProps } from "@focuson/state";
import { Layout } from "../copied/layout";
import { FocusOnContext } from '@focuson/focuson';
import {  focusedPage, focusedPageWithExtraState,   fullState,pageState} from "@focuson/pages";
import { Context, FocusedProps } from "../common";
import { Lenses } from '@focuson/lens';
import { Guard } from "../copied/guard";
import { SelectedItem } from '../copied/table';
import { LabelAndNumberInput } from '../copied/LabelAndInput';
import { LabelAndStringInput } from '../copied/LabelAndInput';
import {ListNextButton} from '../copied/listNextPrevButtons';
import {ListPrevButton} from '../copied/listNextPrevButtons';
import {ModalButton} from '@focuson/pages';
import {ModalCancelButton} from '@focuson/pages';
import {ModalCommitButton} from '@focuson/pages';
import {RestButton} from '../copied/rest';
import {ValidationButton} from '../copied/ValidationButton';
import {OccupationAndIncomeSummaryPageDomain} from "./domains";
import {OccupationAndIncomeDetailsDDDomain} from "./domains"
import {OccupationIncomeDetailsDDDomain} from "./domains"
export function OccupationAndIncomeSummaryPage<S, Context extends FocusOnContext<S>>(){
  return focusedPageWithExtraState<S, OccupationAndIncomeSummaryPageDomain, OccupationAndIncomeDetailsDDDomain, Context> ( s => 'OccupationAndIncomeSummary' ) ( s => s.focusOn('fromApi')) (
    ( fullState, state , full, d, mode) => {
  return (<Layout  details='[1][3,3][5]'>
     <OccupationAndIncomeDetailsDD id='root' state={state}  mode={mode} />
     <ModalButton id='addEntry' text='addEntry'  state={state} modal = 'OccupationIncomeModalPD'  focusOn={["OccupationAndIncomeSummary","temp"]}  copyOnClose={["OccupationAndIncomeSummary","fromApi","customerOccupationIncomeDetails","[append]"]}createEmpty={empty.emptyOccupationIncomeDetailsDD}  setToLengthOnClose={{"array":["OccupationAndIncomeSummary","fromApi","customerOccupationIncomeDetails"],"variable":["OccupationAndIncomeSummary","selectedItem"]}} pageMode='create'   />
     <ModalButton id='edit' text='edit'  state={state} modal = 'OccupationIncomeModalPD'  focusOn={["OccupationAndIncomeSummary","temp"]} copyFrom={["OccupationAndIncomeSummary","fromApi","customerOccupationIncomeDetails","{selectedItem}"]} copyOnClose={["OccupationAndIncomeSummary","fromApi","customerOccupationIncomeDetails","{selectedItem}"]}   pageMode='edit'   />
     <ListNextButton id='nextOccupation' title='Next' list={fullState.focusOn('fromApi').focusOn('customerOccupationIncomeDetails')} value={fullState.focusOn('selectedItem')} />
     <ListPrevButton id='prevOccupation' title='Prev' list={fullState.focusOn('fromApi').focusOn('customerOccupationIncomeDetails')} value={fullState.focusOn('selectedItem')} />
   </Layout>)})}

export function OccupationAndIncomeDetailsDD<S, Context extends FocusOnContext<S>>({id,state,mode}: FocusedProps<S, OccupationAndIncomeDetailsDDDomain,Context>){
  return(<>
  <LabelAndStringInput id={`${id}.mainCustomerName`} state={state.focusOn('mainCustomerName')} mode={mode} label='main customer name' required={true} />
  <SelectedItem id={`${id}.customerOccupationIncomeDetails`} state={state.focusOn('customerOccupationIncomeDetails')} mode={mode} index={pageState(state).focusOn('selectedItem').json()} display={OccupationIncomeDetailsDD} />
</>)
}

export function OccupationIncomeDetailsDD<S, Context extends FocusOnContext<S>>({id,state,mode}: FocusedProps<S, OccupationIncomeDetailsDDDomain,Context>){
const areYouGuard = state.chainLens(Lenses.fromPath(["areYou"])).optJson();console.log('areYouGuard', areYouGuard)
  return(<>
  <LabelAndStringInput id={`${id}.areYou`} state={state.focusOn('areYou')} mode={mode} label='are you' required={true} />
  <Guard value={areYouGuard} cond={["E","S"]}><LabelAndStringInput id={`${id}.currentEmployment`} state={state.focusOn('currentEmployment')} mode={mode} label='current employment' required={true} /></Guard>
  <Guard value={areYouGuard} cond={["E"]}><LabelAndStringInput id={`${id}.occupation`} state={state.focusOn('occupation')} mode={mode} label='occupation' required={true} /></Guard>
  <Guard value={areYouGuard} cond={["E"]}><LabelAndStringInput id={`${id}.customerDescription`} state={state.focusOn('customerDescription')} mode={mode} label='customer description' required={true} /></Guard>
  <Guard value={areYouGuard} cond={["E"]}><LabelAndStringInput id={`${id}.ownShareOfTheCompany`} state={state.focusOn('ownShareOfTheCompany')} mode={mode} label='own share of the company' required={true} /></Guard>
  <Guard value={areYouGuard} cond={["E"]}><LabelAndStringInput id={`${id}.owningSharesPct`} state={state.focusOn('owningSharesPct')} mode={mode} label='owning shares pct' required={true} /></Guard>
  <Guard value={areYouGuard} cond={["E"]}><LabelAndStringInput id={`${id}.workFor`} state={state.focusOn('workFor')} mode={mode} label='work for' required={true} /></Guard>
  <Guard value={areYouGuard} cond={["E"]}><LabelAndStringInput id={`${id}.employmentType`} state={state.focusOn('employmentType')} mode={mode} label='employment type' required={true} /></Guard>
  <LabelAndNumberInput id={`${id}.annualSalaryBeforeDeduction`} state={state.focusOn('annualSalaryBeforeDeduction')} mode={mode} label='annual salary before deduction' required={true} />
  <LabelAndNumberInput id={`${id}.annualIncomeExcludingRent`} state={state.focusOn('annualIncomeExcludingRent')} mode={mode} label='annual income excluding rent' required={true} />
  <LabelAndNumberInput id={`${id}.regularCommissionBonus`} state={state.focusOn('regularCommissionBonus')} mode={mode} label='regular commission bonus' required={true} />
  <LabelAndStringInput id={`${id}.dateOfEmploymentStart`} state={state.focusOn('dateOfEmploymentStart')} mode={mode} label='date of employment start' required={true} />
  <LabelAndStringInput id={`${id}.otherSourceOfIncome`} state={state.focusOn('otherSourceOfIncome')} mode={mode} label='other source of income' required={true} />
  <LabelAndStringInput id={`${id}.createdBy`} state={state.focusOn('createdBy')} mode={mode} label='created by' required={true} />
  <LabelAndStringInput id={`${id}.createdDate`} state={state.focusOn('createdDate')} mode={mode} label='created date' required={true} />
  <LabelAndStringInput id={`${id}.employerName`} state={state.focusOn('employerName')} mode={mode} label='employer name' required={true} />
  <LabelAndStringInput id={`${id}.whatTypeOfBusiness`} state={state.focusOn('whatTypeOfBusiness')} mode={mode} label='what type of business' required={true} />
  <LabelAndStringInput id={`${id}.whatNameBusiness`} state={state.focusOn('whatNameBusiness')} mode={mode} label='what name business' required={true} />
  <LabelAndStringInput id={`${id}.establishedYear`} state={state.focusOn('establishedYear')} mode={mode} label='established year' required={true} />
  <LabelAndNumberInput id={`${id}.annualDrawing3Yrs`} state={state.focusOn('annualDrawing3Yrs')} mode={mode} label='annual drawing3 yrs' required={true} />
  <LabelAndStringInput id={`${id}.empStartDate`} state={state.focusOn('empStartDate')} mode={mode} label='emp start date' required={true} />
  <LabelAndStringInput id={`${id}.empEndDate`} state={state.focusOn('empEndDate')} mode={mode} label='emp end date' required={true} />
  <LabelAndStringInput id={`${id}.sePositionHeld`} state={state.focusOn('sePositionHeld')} mode={mode} label='se position held' required={true} />
  <LabelAndStringInput id={`${id}.occupationCategory`} state={state.focusOn('occupationCategory')} mode={mode} label='occupation category' required={true} />
  <LabelAndNumberInput id={`${id}.empEmploymentSeq`} state={state.focusOn('empEmploymentSeq')} mode={mode} label='emp employment seq' required={true} />
  <LabelAndNumberInput id={`${id}.empAppRoleSeq`} state={state.focusOn('empAppRoleSeq')} mode={mode} label='emp app role seq' required={true} />
  <LabelAndNumberInput id={`${id}.accountantAppRoleSeq`} state={state.focusOn('accountantAppRoleSeq')} mode={mode} label='accountant app role seq' required={true} />
</>)
}

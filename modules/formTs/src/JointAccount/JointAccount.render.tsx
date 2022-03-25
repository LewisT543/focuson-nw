import * as domain from '../JointAccount/JointAccount.domains';
import * as empty from '../JointAccount/JointAccount.empty';
import { LensProps } from "@focuson/state";
import { FocusOnContext } from '@focuson/focuson';
import {  focusedPage, focusedPageWithExtraState,   fullState,pageState} from "@focuson/pages";
import { Context, FocusedProps, FState } from "../common";
import { Lenses } from '@focuson/lens';
import { Guard } from "@focuson/form_components";
import { GuardButton } from "@focuson/form_components";
import { LabelAndNumberInput } from '@focuson/form_components';
import { LabelAndStringInput } from '@focuson/form_components';
import { Table } from '@focuson/form_components';
import {ListNextButton} from '@focuson/form_components';
import {ListPrevButton} from '@focuson/form_components';
import {ModalButton} from '@focuson/pages';
import {ModalCancelButton} from '@focuson/pages';
import {ModalCommitButton} from '@focuson/pages';
import {RestButton} from '@focuson/form_components';
import {ToggleButton} from '@focuson/form_components';
import {ValidationButton} from '@focuson/form_components';
import {JointAccountPageDomain} from "../JointAccount/JointAccount.domains";
import {JointAccountDomain} from "../JointAccount/JointAccount.domains"
import {JointAccountAddressDomain} from "../JointAccount/JointAccount.domains"
import {JointAccountAddressesDomain} from "../JointAccount/JointAccount.domains"
import {JointAccountCustomerDomain} from "../JointAccount/JointAccount.domains"
export function JointAccountPage(){
  return focusedPageWithExtraState<FState, JointAccountPageDomain, JointAccountDomain, Context> ( s => 'JointAccount' ) ( s => sstate: pageState - ~/fromApi) (
    ( fullState, state , full, d, mode) => {
  const id='root';
  const buttons =    {toggle:<ToggleButton state={state: fullState - ~/joint}
        id='toggle'
        buttonText='Toggle [{~/joint}]'
         />,}

      return <>
          <JointAccount id={`${id}`} state={state} mode={mode} buttons={buttons} />
      { buttons.toggle } 
      </>})}

export function JointAccount({id,state,mode,buttons}: FocusedProps<FState, JointAccountDomain,Context>){
  return <>
    <LabelAndNumberInput id={`${id}.balance`} state={state.focusOn('balance')} mode={mode} label='balance' allButtons={buttons} required={true} />
    <JointAccountCustomer id={`${id}.main`} state={state.focusOn('main')} mode={mode} buttons={buttons} />
    <JointAccountCustomer id={`${id}.joint`} state={state.focusOn('joint')} mode={mode} buttons={buttons} />
</>
}

export function JointAccountAddress({id,state,mode,buttons}: FocusedProps<FState, JointAccountAddressDomain,Context>){
  return <>
    <LabelAndStringInput id={`${id}.line1`} state={state.focusOn('line1')} mode={mode} label='line1' allButtons={buttons} required={true} />
    <LabelAndStringInput id={`${id}.line2`} state={state.focusOn('line2')} mode={mode} label='line2' allButtons={buttons} required={true} />
</>
}

export function JointAccountCustomer({id,state,mode,buttons}: FocusedProps<FState, JointAccountCustomerDomain,Context>){
  return <>
    <LabelAndStringInput id={`${id}.name`} state={state.focusOn('name')} mode={mode} label='name' allButtons={buttons} required={true} />
    <Table id={`${id}.addresses`} state={state.focusOn('addresses')} mode={mode} order={["line1","line2"]} />
</>
}

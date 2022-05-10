import * as empty from '../LinkedAccountDetails/LinkedAccountDetails.empty';
import * as domain from '../LinkedAccountDetails/LinkedAccountDetails.domains';
import { LensProps } from "@focuson/state";
import { FocusOnContext } from '@focuson/focuson';
import {  focusedPage, focusedPageWithExtraState, fullState, pageState} from "@focuson/pages";
import { Context, FocusedProps, FState, identityL } from "../common";
import { Lenses } from '@focuson/lens';
import { Guard } from "@focuson/form_components";
import { GuardButton } from "@focuson/form_components";
//if there is an error message here... did you set the importFrom on this modal correctly, and also check that the PageD links to this DataD in a domain or rest block
import {OverpaymentPageDomain} from '../LinkedAccountDetails/LinkedAccountDetails.domains'; 
import {OverpaymentPage} from '../LinkedAccountDetails/LinkedAccountDetails.render'
import {DeleteStateButton} from '@focuson/form_components';
import {ListNextButton} from '@focuson/form_components';
import {ListPrevButton} from '@focuson/form_components';
import {ModalButton} from '@focuson/pages';
import {ModalCancelButton} from '@focuson/pages';
import {ModalCommitButton} from '@focuson/pages';
import {RestButton} from '@focuson/form_components';
import {ToggleButton} from '@focuson/form_components';
import {ValidationButton} from '@focuson/form_components';
export function OverpaymentModalPagePage(){
  return focusedPage<FState, OverpaymentPageDomain, Context> ( s => '' ) (//If there is a compilation here have you added this to the 'domain' of the main page
     ( state, d, mode, index ) => {
          const id=`page${index}`;
          const buttons =    {cancel:<ModalCancelButton id={`${id}.cancel`} state={state} />,}
          return <>
          <OverpaymentPage id={`${id}`} state={state} mode={mode} buttons={buttons} />
          { buttons.cancel } 
          </>})}
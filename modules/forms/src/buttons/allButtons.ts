import { makeModalButtons, ModalButtonInPage } from "./modalButtons";
import { ResetStateButton } from "./stateButtons";
import { ListNextButtonInPage, ListPrevButtonInPage, makeListMarkerButtons } from "./listButtons";
import { MakeButton } from "../codegen/makeButtons";
import { makeModalCloseButtons, ModalCancelButtonInPage, ModalCommitButtonInPage } from "./modalCloseButtons";
import { makeRestButtons, RestButtonInPage } from "./restButton";
import { makeValidationButtons, ValidationButtonInPage } from "./ValidationDebugButton";
import { AllGuards, GuardButtonInPage } from "./guardButton";
import { makeToggleButtons, ToggleButtonInPage } from "./toggleButton.page";
import { DeleteStateButtonInPage, makeDeleteStateButtons } from "./DeleteStateButton";
import { makeSelectPageButtons, SelectButtonInPage } from "./selectPageButton";
import { ActionButtonInPage, makeActionButtons } from "./actionButton.page";

export interface ButtonWithControl {
  control: string

}
export function isButtonWithControl ( b: any ): b is ButtonWithControl {
  return b.control !== undefined
}
export type ButtonD = ButtonWithControl | GuardButtonInPage<any, any>



export type RawButtons<G> = ModalButtonInPage<G> | ModalCancelButtonInPage | ModalCommitButtonInPage |
  ResetStateButton | RestButtonInPage<G> | ListNextButtonInPage | ListPrevButtonInPage | ValidationButtonInPage | DeleteStateButtonInPage |
  ToggleButtonInPage<G> | SelectButtonInPage<G> | ActionButtonInPage<G>;

export type AllButtonsInPage<G> = (RawButtons<G> | GuardButtonInPage<AllButtonsInPage<G>, G>)

export function makeButtons<G> (): MakeButton<G> {
  return {
    ...makeDeleteStateButtons (),
    ...makeModalButtons (),
    ...makeModalCloseButtons (),
    ...makeListMarkerButtons (),
    ...makeRestButtons (),
    ...makeValidationButtons (),
    ...makeToggleButtons (),
    ...makeActionButtons(),
    ...makeSelectPageButtons ()
  }
}


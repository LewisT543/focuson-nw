import { ButtonCreator, MakeButton, makeIdForButton } from "../codegen/makeButtons";
import { opt } from "../codegen/codegen";


function makeValidationDebugButton<G> (): ButtonCreator<ValidationButtonInPage, G> {
  return {
    import: "@focuson-nw/form_components",
    makeButton:
      ( { params, parent, name, button } ) => {
        return [`<ValidationButton  id=${makeIdForButton(name)}   ${opt ( 'name', name )}  />`]
      }
  }
}

export function makeValidationButtons<G> (): MakeButton<G> {
  return { ValidationButton: makeValidationDebugButton (), }
}

export interface ValidationButtonInPage {
  control: 'ValidationButton';
}


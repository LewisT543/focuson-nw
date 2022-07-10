import { ButtonCreator, MakeButton, makeIdForButton } from "../codegen/makeButtons";
import { opt } from "../codegen/codegen";
import { stateForButtonWithPath } from "../codegen/lens";
import { toArray } from "@focuson/utils";
import { CustomButtonType } from "./enabledBy";

function makeDeleteStateButton<G> (): ButtonCreator<DeleteStateButtonInPage, G> {
  return {
    import: "@focuson/form_components",
    makeButton:
      ( createButton ) => {
        const { params, parent, name, button } = createButton
        const states = toArray ( button.path ).map ( p => stateForButtonWithPath ( createButton, 'DeleteStateButton' ) ( p ) )
        return [ `<DeleteStateButton  id=${makeIdForButton ( name )} states={[${states.join ( ',' )}]} ${opt ( 'label', button.label )}  ${opt ( 'buttonType', button.buttonType ? button.buttonType : 'primary')} />` ]
      }
  }
}

export function makeDeleteStateButtons<G> (): MakeButton<G> {
  return { DeleteStateButton: makeDeleteStateButton () }
}

export interface DeleteStateButtonInPage extends CustomButtonType {
  control: 'DeleteStateButton';
  label: string;
  path: string | string[];
}


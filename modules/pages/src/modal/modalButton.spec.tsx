import { LensState, lensState } from "@focuson/state";
import { mount } from "enzyme";
import { enzymeSetup } from "../enzymeAdapterSetup";

import { ModalButton } from "./modalButton";
import { HasPageSelection, PageSelectionContext, pageSelectionlens } from "../pageSelection";

enzymeSetup ()
interface StateForModalButtonTest extends HasPageSelection {
  data?: string
}

const context: PageSelectionContext<StateForModalButtonTest> = {
  combine: ( pages: JSX.Element[] ): JSX.Element => <div>{pages}</div>,
  pageSelectionL: pageSelectionlens (),
  pages: {}

}

describe ( "modal button", () => {
  it ( "should render with an id and title", () => {
    const state: LensState<StateForModalButtonTest, HasPageSelection, PageSelectionContext<StateForModalButtonTest>> =
            lensState<StateForModalButtonTest, PageSelectionContext<StateForModalButtonTest>> (
              { pageSelection: [] }, ( s: StateForModalButtonTest ) => {}, 'ModalButton', context )
    const comp = mount ( <ModalButton text='someTitle' id='someId' to={state} modal={'someModal'} base={[]} pageMode='view'/> )
    const button = comp.find ( "button" )
    expect ( button.text () ).toEqual ( 'someTitle' )

  } )
  it ( "should change the state to have a model when clicked", () => {
    var remembered: any = {}
    const state: LensState<StateForModalButtonTest, HasPageSelection, PageSelectionContext<StateForModalButtonTest>> =
            lensState<StateForModalButtonTest, PageSelectionContext<StateForModalButtonTest>> (
              { pageSelection: [] }, ( s: StateForModalButtonTest ) => {remembered = s}, 'ModalButton', context )
    const comp = mount ( <ModalButton text='someTitle' id='someId' to={state} modal={'someModal'} base={[]} pageMode='edit'/> )
    const button = comp.find ( "button" )
    button.simulate ( 'click' )
    expect ( remembered ).toEqual ( { "pageSelection": [ { "firstTime": true, "pageMode": "edit", "pageName": "someModal", "base": [] } ] } )
  } )

  it ( "should create an empty if needed when clicked", () => {
    var remembered: any = {}
    const state: LensState<StateForModalButtonTest, StateForModalButtonTest, PageSelectionContext<StateForModalButtonTest>> =
            lensState<StateForModalButtonTest, PageSelectionContext<StateForModalButtonTest>> (
              { pageSelection: [] }, ( s: StateForModalButtonTest ) => {remembered = s}, 'ModalButton', context )
    const comp = mount ( <ModalButton text='someTitle' id='someId' to={state.focusOn ( 'data' )} modal={'someModal'} base={[]} pageMode='edit' createEmpty='someData'/> )
    const button = comp.find ( "button" )
    button.simulate ( 'click' )
    expect ( remembered ).toEqual ( {
      "data": "someData",
      "pageSelection": [ { "base": [], "firstTime": true, "pageMode": "edit", "pageName": "someModal" } ]
    } )

  } )
} )
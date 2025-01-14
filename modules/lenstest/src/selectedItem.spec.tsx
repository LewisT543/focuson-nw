import { enzymeSetup } from "./enzymeAdapterSetup";
import { mount } from "enzyme";
import { SelectedItem, SelectedItemDisplayProps } from "@focuson-nw/form_components";
import { PageMode } from "@focuson-nw/utils";
import { LensState, lensState } from "@focuson-nw/state";
import { Lenses } from "@focuson-nw/lens";


enzymeSetup ()

interface StateForSelectedItem {
  data?: string[]
}

interface SelectedItemThings {
  index: number;
  mode: PageMode;
  header?: string;
  showNofM?: boolean;
  headerIfEmpty?: string;
}
function displaySelectedItem ( s: StateForSelectedItem, selectedItemThings: SelectedItemThings, setMain: ( s: StateForSelectedItem ) => void ) {
  function display ( { state, mode, id }: SelectedItemDisplayProps<StateForSelectedItem, string, {}> ) {
    const optJson = state.optJson ();
    return <span id={id}>{mode}/{optJson}</span>
  }
  const state: LensState<StateForSelectedItem, StateForSelectedItem, {}> = lensState ( s, setMain, 'desc', {} );
  return mount ( <SelectedItem {...selectedItemThings} id='someId' display={display} state={state.focusOn ( 'data' )} allButtons={{}}/> )
}

describe ( "selectedItem", () => {
  it ( "should display the selected item", () => {
    const x = Lenses.identity<StateForSelectedItem> ().focusQuery ( 'data' ).chain ( Lenses.nth ( 1 ) ).getOption ( { data: [ '1', '2', '3' ] } )
    expect ( displaySelectedItem ( { data: [ 'a', 'b' ] }, { index: 1, mode: 'view' }, () => {} ).html () ).toEqual ( '<span id="someId">view/b</span>' )
    expect ( displaySelectedItem ( { data: [ 'a', 'b' ] }, { index: 999, mode: 'view' }, () => {} ).html () ).toEqual ( '<span id="someId">view/</span>' )
    expect ( displaySelectedItem ( { data: [] }, { index: 999, mode: 'view' }, () => {} ).html () ).toEqual ( '<span id="someId">view/</span>' )
  } )
  it ( "should display the selected item with a header", () => {
    expect ( displaySelectedItem ( { data: [ 'a', 'b' ] }, { index: 1, mode: 'view', header: 'someTitle' }, () => {} ).html () ).toEqual ( '<div><h2>someTitle</h2><span id="someId">view/b</span></div>' )
    expect ( displaySelectedItem ( { data: [ 'a', 'b' ] }, { index: 999, mode: 'view', header: 'someTitle' }, () => {} ).html () ).toEqual ( '<div><h2>someTitle</h2><span id="someId">view/</span></div>' )
    expect ( displaySelectedItem ( { data: [] }, { index: 999, mode: 'view', header: 'someTitle' }, () => {} ).html () ).toEqual ( '<div><h2>someTitle</h2><span id="someId">view/</span></div>' )
  } )
  it ( "should display the selected item with a  n of m", () => {
    expect ( displaySelectedItem ( { data: [ 'a', 'b' ] }, { index: 1, mode: 'view', showNofM: true }, () => {} ).html () ).toEqual ( '<div><h2><span id="someId.nOfM"> 2 / 2</span></h2><span id="someId">view/b</span></div>' )
    expect ( displaySelectedItem ( { data: [ 'a', 'b' ] }, { index: 999, mode: 'view', showNofM: true }, () => {} ).html () ).toEqual ( '<div><h2><span id="someId.nOfM"> 1000 / 2</span></h2><span id="someId">view/</span></div>' )
    expect ( displaySelectedItem ( { data: [] }, { index: 999, mode: 'view', showNofM: true }, () => {} ).html () ).toEqual ( '<div><h2><span id="someId.nOfM"> 1000 / 0</span></h2><span id="someId">view/</span></div>' )
  } )
  it ( "should display the selected item with a header and n of m", () => {
    expect ( displaySelectedItem ( { data: [ 'a', 'b' ] }, { index: 1, mode: 'view', header: 'someTitle', showNofM: true }, () => {} ).html () ).toEqual ( '<div><h2>someTitle<span id="someId.nOfM"> 2 / 2</span></h2><span id="someId">view/b</span></div>' )
    expect ( displaySelectedItem ( { data: [ 'a', 'b' ] }, { index: 999, mode: 'view', header: 'someTitle', showNofM: true }, () => {} ).html () ).toEqual ( '<div><h2>someTitle<span id="someId.nOfM"> 1000 / 2</span></h2><span id="someId">view/</span></div>' )
    expect ( displaySelectedItem ( { data: [] }, { index: 999, mode: 'view', header: 'someTitle', showNofM: true }, () => {} ).html () ).toEqual ( '<div><h2>someTitle<span id="someId.nOfM"> 1000 / 0</span></h2><span id="someId">view/</span></div>' )
  } )
  it ( "should display the selected item  headerIfEmpty and data empty", () => {
    expect ( displaySelectedItem ( { data: [] }, { index: 1, mode: 'view', headerIfEmpty: 'emptyHeader' }, () => {} ).html () ).toEqual ( '<div><h2><span id="someId.emptyHeader">emptyHeader</span></h2><span id="someId">view/</span></div>' )
    expect ( displaySelectedItem ( { data: [] }, { index: 1, mode: 'view', header: 'theHeader', headerIfEmpty: 'emptyHeader' }, () => {} ).html () ).toEqual ( '<div><h2>theHeader<span id="someId.emptyHeader">emptyHeader</span></h2><span id="someId">view/</span></div>' )
    expect ( displaySelectedItem ( { data: [] }, { index: 1, mode: 'view', header: 'theHeader', headerIfEmpty: 'emptyHeader', showNofM: true }, () => {} ).html () ).toEqual ( '<div><h2>theHeader<span id="someId.emptyHeader">emptyHeader</span></h2><span id="someId">view/</span></div>' )
  } )
  it ( "should display the selected item  headerIfEmpty and data not empty", () => {
    expect ( displaySelectedItem ( { data: [ 'a', 'b' ] }, { index: 1, mode: 'view', headerIfEmpty: 'emptyHeader' }, () => {} ).html () ).toEqual ( '<div><h2></h2><span id="someId">view/b</span></div>' )
    expect ( displaySelectedItem ( { data: [ 'a', 'b' ] }, { index: 1, mode: 'view', header: 'theHeader', headerIfEmpty: 'emptyHeader' }, () => {} ).html () ).toEqual ( '<div><h2>theHeader</h2><span id="someId">view/b</span></div>' )
    expect ( displaySelectedItem ( { data: [ 'a', 'b' ] }, { index: 1, mode: 'view', header: 'theHeader', headerIfEmpty: 'emptyHeader', showNofM: true }, () => {} ).html () ).toEqual ( '<div><h2>theHeader<span id="someId.nOfM"> 2 / 2</span></h2><span id="someId">view/b</span></div>' )
  } )
} )
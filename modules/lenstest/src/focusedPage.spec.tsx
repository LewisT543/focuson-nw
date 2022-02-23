import { lensState } from "@focuson/state";
import { mount, shallow } from "enzyme";
import { PageMode, SelectedPage } from "@focuson/pages";
import { context, ContextForTest, emptyState, lensStateWith, PageSpecState, rootState } from "./page.fixture";
import { enzymeSetup } from "./enzymeAdapterSetup";


enzymeSetup ()

let view: PageMode = 'view';

const nothingDisplayed: PageSpecState = { ...emptyState, messages: [], pageSelection: [ { pageName: 'nothing', pageMode: view } ] };

describe ( "selectedPage", () => {
  it ( "should display zero pages", () => {
    const state = lensState<PageSpecState, ContextForTest> ( { ...rootState }, () => {}, 'displayMain / focusedPage', context )
    const comp = shallow ( <SelectedPage state={state}/> )
    // expect ( comp.html () ).toEqual ( '' )
    expect ( comp.text () ).toEqual ( "" )
  } )

  it ( "should display one page", () => {
    const state = lensStateWith ( () => {}, [ 'firstPage', 'edit' ] )
    const comp = mount ( <SelectedPage state={state}/> )
    expect ( comp.text () ).toEqual ( "[firstPageTitle]:firstPage[x]/edit" )
  } )

  it ( "should display two pages", () => {
    const state = lensStateWith ( () => {}, [ 'firstPage', 'edit' ], [ 'secondPage', 'view' ] )
    const comp = shallow ( <SelectedPage state={state}/> )
    // expect ( comp.html () ).toEqual ( '' )
    expect ( comp.text () ).toEqual ( "[firstPageTitle]:firstPage[x]/edit[secondPageTitle]:secondPage[x]/view" )
  } )

  it ( "should display three pages", () => {
    const state = lensStateWith ( () => {}, [ 'firstPage', 'edit' ], [ 'secondPage', 'view' ], [ 'modalData', 'edit' ] )
    const comp = shallow ( <SelectedPage state={state}/> )
    // expect ( comp.html () ).toEqual ( '' )
    expect ( comp.text () ).toEqual ( "[firstPageTitle]:firstPage[x]/edit[secondPageTitle]:secondPage[x]/view[modalDataTitle]:modalData[x]/edit" )
  } )

  it ( "shouldbe using the combine for multiple pages", () => {
    const state = lensStateWith ( () => {}, [ 'firstPage', 'edit' ], [ 'secondPage', 'view' ], [ 'modalData', 'edit' ] )
    const comp = shallow ( <SelectedPage state={state}/> )
    expect ( comp.find ( '#combine' ).length ).toEqual ( 1 )

  } )
} )


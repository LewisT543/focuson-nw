import { HasPageSelection, ModalButton, ModalCommitButton, PageDetailsForCombine, pageSelectionlens, simpleMessagesL } from "@focuson/pages";
import { HasRestCommands, restL } from "@focuson/rest";
import { lensState, LensState } from "@focuson/state";
import { shallow } from "enzyme";
import { FocusOnContext } from "@focuson/focuson";
import { enzymeSetup } from "./enzymeAdapterSetup";
import { SimpleMessage } from "@focuson/utils";
import { identityOptics } from "@focuson/lens";

enzymeSetup ()


interface ModalChildData {
  data: string
}
interface PageData {
  child?: ModalChildData;
  list?: ModalChildData[];
  temp?: ModalChildData;
  tempAr?: ModalChildData[];
  index?: number
  nested?: {
    child?: ModalChildData,
    list?: ModalChildData[]
  }
}

export interface ModalButtonStateForTest extends HasPageSelection, HasRestCommands {
  messages: SimpleMessage[],
  mainPage: PageData
}
const emptyS: ModalButtonStateForTest = {
  messages: [],
  pageSelection: [ { "pageName": "mainPage", "pageMode": "view" } ],
  restCommands: [],
  mainPage: {}
}
const emptyNestedS: ModalButtonStateForTest = {
  ...emptyS,
  mainPage: { nested: {} }
}
const dataS: ModalButtonStateForTest = {
  ...emptyS,
  mainPage: { child: { data: 'a' } }
}
const nestedS: ModalButtonStateForTest = {
  ...emptyS,
  mainPage: { nested: { child: { data: 'a' } } }
}
const listS: ModalButtonStateForTest = {
  ...emptyS,
  mainPage: {
    index: 1,
    list: [ { data: '0' }, { data: '1' }, { data: '2' } ]
  }
}
type Context = FocusOnContext<ModalButtonStateForTest>
const context: Context = {
  restL: restL<ModalButtonStateForTest> (),
  combine: ( state, pages: PageDetailsForCombine[] ): JSX.Element => <div>{pages.map ( p => p.element )}</div>,
  pageSelectionL: pageSelectionlens (),
  simpleMessagesL: simpleMessagesL (),
  pages: { mainPage: { lens: identityOptics<ModalButtonStateForTest> ().focusQuery ( 'mainPage' ), pageType: 'MainPage', pageFunction: () => <span/>, config: {}, pageMode: 'edit' } },
  commonIds: {}
}

function displayAndGetButton ( s: ModalButtonStateForTest, setMain: ( s: ModalButtonStateForTest ) => void, fn: ( s: LensState<ModalButtonStateForTest, PageData, Context> ) => JSX.Element ) {
  const comp = shallow ( fn ( lensState<ModalButtonStateForTest, Context> ( s, setMain, 'ModalButton', context ).focusOn ( 'mainPage' ) ) )
  return comp.find ( "button" )

}

describe ( "modal buttons", () => {
  describe ( "with single child", () => {
    it ( "should copy", () => {
      var remembered: any = {}
      const button = displayAndGetButton ( dataS, s => remembered = s, state =>
        <ModalButton text='someTitle' id='someId' state={state} copy={[ { from: '~/child' } ]} focusOn={'~/temp'} modal={'someModal'} pageMode='view'/> )
      button.simulate ( 'click' )
      expect ( remembered ).toEqual ( {
        messages: [],
        mainPage: {
          "child": { "data": "a" },
          "temp": { "data": "a" }
        },
        "restCommands": [],
        "pageSelection": [ { "pageName": "mainPage", "pageMode": "view" }, { "focusOn": "~/temp", "firstTime": true, "pageMode": "view", "pageName": "someModal" } ],
      } )
    } )
    it ( "should create empty", () => {
      var remembered: any = {}
      const button = displayAndGetButton ( emptyS, s => remembered = s, state =>
        <ModalButton text='someTitle' id='someId' state={state} createEmpty={{ data: 'data' }} focusOn={'~/temp'} modal={'someModal'} pageMode='view'/> )
      button.simulate ( 'click' )
      expect ( remembered ).toEqual ( {
        messages: [],
        "pageSelection": [ { "pageName": "mainPage", "pageMode": "view" }, { "focusOn": "~/temp", "firstTime": true, "pageMode": "view", "pageName": "someModal" } ],
        "restCommands": [],
        mainPage: { "temp": { "data": "data" } }
      } )
    } )
    it ( "should copyJustString", () => {
      var remembered: any = {}
      const state = { ...emptyS, a: { x: 'somedata', y: 'other' } }
      const button = displayAndGetButton ( state, s => remembered = s, state =>
        <ModalButton text='someTitle' id='someId' state={state} copyJustString={[ { from: '/a', to: '/b', joiner: '*' } ]} focusOn={'~/temp'} modal={'someModal'} pageMode='view'/> )
      button.simulate ( 'click' )
      expect ( remembered ).toEqual ( {
        ...state,
        "b": "somedata*other",
        "pageSelection": [ { "pageName": "mainPage", "pageMode": "view" }, { "focusOn": "~/temp", "firstTime": true, "pageMode": "view", "pageName": "someModal" } ]
      } )
    } )
    it ( "should handle copyJustString when target is not there", () => {
      var remembered: any = {}
      const button = displayAndGetButton ( emptyS, s => remembered = s, state =>
        <ModalButton text='someTitle' id='someId' state={state} copyJustString={[ { from: '/a', to: '/b', joiner: '*' } ]} focusOn={'~/temp'} modal={'someModal'} pageMode='view'/> )
      button.simulate ( 'click' )
      expect ( remembered ).toEqual ( {
        ...emptyS,
        "pageSelection": [ { "pageName": "mainPage", "pageMode": "view" }, { "focusOn": "~/temp", "firstTime": true, "pageMode": "view", "pageName": "someModal" } ]
      } )
    } )

    it ( "should create empty, then copy back", () => {
      var remembered: any = {}
      displayAndGetButton ( emptyS, s => remembered = s, state =>
        <ModalButton text='someTitle' id='someId' state={state} focusOn='~/temp'
                     createEmpty={{ data: 'data' }}
                     modal={'someModal'}
                     copyOnClose={[ { to: '~/data' } ]}
                     pageMode='view'/> )
        .simulate ( 'click' )
      expect ( remembered ).toEqual ( {
        messages: [],
        "pageSelection": [
          { "pageName": "mainPage", "pageMode": "view" },
          { "focusOn": '~/temp', "firstTime": true, "pageMode": "view", "pageName": "someModal", copyOnClose: [ { to: "~/data" } ] } ],
        "restCommands": [],
        mainPage: { "temp": { "data": "data" } }
      } )

      var remembered1: any = {}
      displayAndGetButton ( remembered, s => remembered1 = s, state => <ModalCommitButton id='id' state={state}/> ).simulate ( 'click' )
      expect ( remembered1 ).toEqual ( {
        messages: [],
        "mainPage": { "temp": { "data": "data" }, "data": { "data": "data" } },
        "pageSelection": [ { "pageMode": "view", "pageName": "mainPage" } ],
        "restCommands": []
      } )
    } )
    it ( "should create empty, then copy back with a rest command", () => {
      var remembered: any = {}
      displayAndGetButton ( emptyS, s => remembered = s, state =>
        <ModalButton text='someTitle' id='someId' state={state}
                     focusOn='~/temp' createEmpty={{ data: 'data' }}
                     rest={{ name: 'restName', restAction: 'update' }} modal={'someModal'}
                     copyOnClose={[ { to: '~/data' } ]} pageMode='view'/> )
        .simulate ( 'click' )
      expect ( remembered ).toEqual ( {
        "mainPage": { "temp": { "data": "data" } },
        "messages": [],
        "pageSelection": [
          { "pageMode": "view", "pageName": "mainPage" },
          {
            "copyOnClose": [ { "to": "~/data" } ],
            "firstTime": true, "focusOn": "~/temp", "pageMode": "view", "pageName": "someModal",
            "rest": { "name": "restName", "restAction": "update" }
          }
        ],
        "restCommands": []
      } )

      var remembered1: any = {}
      displayAndGetButton ( remembered, s => remembered1 = s, state => <ModalCommitButton id='id' state={state}/> ).simulate ( 'click' )
      expect ( remembered1 ).toEqual ( {
        messages: [],
        "mainPage": { "temp": { "data": "data" }, "data": { "data": "data" } },
        "pageSelection": [ { "pageMode": "view", "pageName": "mainPage" } ],
        "restCommands": [ { "name": "restName", "restAction": "update" } ]
      } )
    } )
  } )
} )


describe ( "with nested child", () => {
  it ( "should copy", () => {
    var remembered: any = {}
    const button = displayAndGetButton ( nestedS, s => remembered = s, state =>
      <ModalButton text='someTitle' id='someId' state={state} copy={[ { from: '~/nested/child' } ]} focusOn='~/temp' modal={'someModal'} pageMode='view'/> )
    button.simulate ( 'click' )
    expect ( remembered ).toEqual ( {
      messages: [],
      mainPage: {
        nested: { "child": { "data": "a" } },
        "temp": { "data": "a" }
      },
      "restCommands": [],
      "pageSelection": [ { "pageName": "mainPage", "pageMode": "view" }, { "focusOn": "~/temp", "firstTime": true, "pageMode": "view", "pageName": "someModal" } ],
    } )
  } )
  it ( "should create empty, then copy back", () => {
    var remembered: any = {}
    displayAndGetButton ( emptyNestedS, s => remembered = s, state =>
      <ModalButton text='someTitle' id='someId' state={state} focusOn='~/temp' createEmpty={{ data: 'data' }} modal={'someModal'}
                   copyOnClose={[ { to: '~/nested/data' } ]} pageMode='view'/> )
      .simulate ( 'click' )
    expect ( remembered ).toEqual ( {
      messages: [],
      "pageSelection": [ { "pageName": "mainPage", "pageMode": "view" }, {
        "firstTime": true, "pageMode": "view", "pageName": "someModal",
        "focusOn": "~/temp",
        copyOnClose: [ { "to": "~/nested/data" } ]
      } ],
      "restCommands": [],
      mainPage: { "temp": { "data": "data" }, nested: {} }
    } )

    var remembered1: any = {}
    displayAndGetButton ( remembered, s => remembered1 = s, state => <ModalCommitButton id='id' state={state}/> ).simulate ( 'click' )
    expect ( remembered1 ).toEqual ( {
      messages: [],
      "mainPage": { "temp": { "data": "data" }, nested: { "data": { "data": "data" } } },
      "pageSelection": [ { "pageMode": "view", "pageName": "mainPage" } ],
      "restCommands": []
    } )
  } )

  it ( "should create empty, then copy back with a rest command", () => {
    var remembered: any = {}
    displayAndGetButton ( emptyNestedS, s => remembered = s, state =>
      <ModalButton text='someTitle' id='someId' state={state} focusOn='~/temp' createEmpty={{ data: 'data' }} rest={{ name: 'restName', restAction: 'update' }}
                   modal={'someModal'} copyOnClose={[ { to: '~/nested/data' } ]} pageMode='view'/> )
      .simulate ( 'click' )
    expect ( remembered ).toEqual ( {
      messages: [],
      "pageSelection": [
        { "pageName": "mainPage", "pageMode": "view" },
        {
          "focusOn": "~/temp", rest: { name: 'restName', restAction: 'update' }, "firstTime": true, "pageMode": "view", "pageName": "someModal",
          copyOnClose: [ { "to": "~/nested/data" } ]
        } ],
      "restCommands": [],
      mainPage: { "temp": { "data": "data" }, nested: {} }
    } )

    var remembered1: any = {}
    displayAndGetButton ( remembered, s => remembered1 = s, state => <ModalCommitButton id='id' state={state}/> ).simulate ( 'click' )
    expect ( remembered1 ).toEqual ( {
      messages: [],
      "mainPage": { "temp": { "data": "data" }, nested: { "data": { "data": "data" } } },
      "pageSelection": [ { "pageMode": "view", "pageName": "mainPage" } ],
      "restCommands": [ { "name": "restName", "restAction": "update" } ]
    } )
  } )
} )


describe ( "with lists of data", () => {
  it ( "should copy from [1]", () => {
    var remembered: any = {}
    const button = displayAndGetButton ( listS, s => remembered = s, state =>
      <ModalButton text='someTitle' id='someId' state={state} copy={[ { from: '~/list[1]' } ]} focusOn='~/temp' modal={'someModal'} pageMode='view'/> )
    button.simulate ( 'click' )
    expect ( remembered ).toEqual ( {
      messages: [],
      mainPage: {
        "index": 1,
        list: [ { data: '0' }, { data: '1' }, { data: '2' } ],
        temp: { "data": "1" }
      },
      "restCommands": [],
      "pageSelection": [ { "pageName": "mainPage", "pageMode": "view" }, { "focusOn": "~/temp", "firstTime": true, "pageMode": "view", "pageName": "someModal" } ],
    } )
  } )
  it ( "should copy from [last]", () => {
    var remembered: any = {}
    const button = displayAndGetButton ( listS, s => remembered = s, state =>
      <ModalButton text='someTitle' id='someId' state={state}
                   copy={[ { from: '~/list[$last]' } ]}
                   focusOn='~/temp' modal={'someModal'} pageMode='view'/> )
    button.simulate ( 'click' )
    expect ( remembered.mainPage.temp ).toEqual ( { data: '2' } )
  } )
  it ( "should copy from [~/index]", () => {
    var remembered: any = {}
    const button = displayAndGetButton ( listS, s => remembered = s, state =>
      <ModalButton text='someTitle' id='someId' state={state}
                   copy={[ { from: '~/list/[~/index]' } ]}
                   focusOn='~/temp' modal={'someModal'} pageMode='view'/> )
    button.simulate ( 'click' )
    expect ( remembered.mainPage.temp ).toEqual ( { data: '1' } )
  } )

} )


it ( "should create empty, then copy back", () => {
  var remembered: any = {}
  displayAndGetButton ( emptyNestedS, s => remembered = s, state =>
    <ModalButton text='someTitle' id='someId' state={state} focusOn='~/temp' createEmpty={{ data: 'data' }} modal={'someModal'}
                 copyOnClose={[ { to: '~/nested/data' } ]} pageMode='view'/> )
    .simulate ( 'click' )
  expect ( remembered ).toEqual ( {
    messages: [],
    "pageSelection": [ { "pageName": "mainPage", "pageMode": "view" },
      {
        "focusOn": "~/temp", "firstTime": true, "pageMode": "view", "pageName": "someModal",
        copyOnClose: [ { "to": "~/nested/data" } ]
      } ],
    "restCommands": [],
    mainPage: { "temp": { "data": "data" }, nested: {} }
  } )

  var remembered1: any = {}
  displayAndGetButton ( remembered, s => remembered1 = s, state => <ModalCommitButton id='id' state={state}/> ).simulate ( 'click' )
  expect ( remembered1 ).toEqual ( {
    messages: [],
    "mainPage": { "temp": { "data": "data" }, nested: { "data": { "data": "data" } } },
    "pageSelection": [ { "pageMode": "view", "pageName": "mainPage" } ],
    "restCommands": []
  } )
} )

it ( "should create empty, then copy back with a rest command", () => {
  var remembered: any = {}
  displayAndGetButton ( emptyNestedS, s => remembered = s, state =>
    <ModalButton text='someTitle' id='someId' state={state} focusOn='~/temp' createEmpty={{ data: 'data' }} rest={{ name: 'restName', restAction: 'update' }}
                 modal={'someModal'} copyOnClose={[ { to: '~/nested/data' } ]} pageMode='view'/> )
    .simulate ( 'click' )
  expect ( remembered ).toEqual ( {
    messages: [],
    "pageSelection": [
      { "pageName": "mainPage", "pageMode": "view" },
      {
        "focusOn": "~/temp", rest: { name: 'restName', restAction: 'update' }, "firstTime": true, "pageMode": "view", "pageName": "someModal",
        copyOnClose: [ { "to": "~/nested/data" } ]
      } ],
    "restCommands": [],
    mainPage: { "temp": { "data": "data" }, nested: {} }
  } )

  var remembered1: any = {}
  displayAndGetButton ( remembered, s => remembered1 = s, state => <ModalCommitButton id='id' state={state}/> ).simulate ( 'click' )
  expect ( remembered1 ).toEqual ( {
    messages: [],
    "mainPage": { "temp": { "data": "data" }, nested: { "data": { "data": "data" } } },
    "pageSelection": [ { "pageMode": "view", "pageName": "mainPage" } ],
    "restCommands": [ { "name": "restName", "restAction": "update" } ]
  } )
} )
// describe ( "with nested lists of data", () => {
// } )

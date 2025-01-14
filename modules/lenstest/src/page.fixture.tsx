import { lensState } from "@focuson-nw/state";
import { identityOptics } from "@focuson-nw/lens";
import { focusedPage, HasPageSelection, Loading, MultiPageDetails, PageConfig,simpleMessagesPageConfig } from "@focuson-nw/pages";
import { HasSimpleMessages, PageMode, SimpleMessage, testDateFn } from "@focuson-nw/utils";
import { defaultPageSelectionAndRestCommandsContext, FocusOnContext } from "@focuson-nw/focuson";
import { HasTagHolder } from "@focuson-nw/template";
import { HasRestCommands, RestCommand } from "@focuson-nw/rest";


export interface PageSpecState extends HasPageSelection, HasSimpleMessages, HasTagHolder, HasRestCommands {
  tag1?: string,
  tag2?: string,
  tempData?: string,

  firstPage?: string,
  secondPage?: SecondPageDomain
}
export interface SecondPageDomain {
  fromApi?: string
}

export const emptyState: PageSpecState = {
  pageSelection: [], messages: [], tags: {}, restCommands: []
}
export const rootState: PageSpecState = { ...emptyState, messages: [], pageSelection: [], tempData: 'x' };
export const dataDefinedState: PageSpecState = { ...emptyState, firstPage: 'one', secondPage: { fromApi: 'two' }, messages: [], pageSelection: [], tempData: 'x' };
export const firstPageSelectedState = stateWith ( rootState, [ 'firstPage', 'view', undefined ] )
export const firstPageWithFirstTime: PageSpecState = stateWithFirstTimes ( rootState, [ 'firstPage', 'view', undefined ] )
export const secondPageSelectedState = stateWith ( rootState, [ 'secondPage', 'view', undefined ] )
export const invalidPageState = stateWithFirstTimes ( rootState, [ 'unknownpage', 'view', undefined ] )

export function stateWith ( main: PageSpecState, ...nameAndModes: [ string, PageMode, RestCommand | undefined ][] ): PageSpecState {
  return { ...main, pageSelection: nameAndModes.map ( ( [ pageName, pageMode, rest ] ) => ({ pageName, pageMode, rest, time: 'now' }) ) }
}
export function stateWithFirstTimes ( main: PageSpecState, ...nameAndModes: [ string, PageMode, RestCommand | undefined ][] ): PageSpecState {
  return { ...main, pageSelection: nameAndModes.map ( ( [ pageName, pageMode, rest ] ) => ({ pageName, pageMode, firstTime: true, rest, time: 'now' }) ) }
}
export function lensStateWith ( main: PageSpecState, setMain: ( s: PageSpecState ) => void, ...nameAndModes: [ string, PageMode, RestCommand | undefined ][] ) {
  return lensState<PageSpecState, ContextForTest> ( stateWith ( main, ...nameAndModes ), setMain, 'displayMain / focusedPage', context )
}

export type ContextForTest = FocusOnContext<PageSpecState>


const DisplayPageSpecState = ( prefix: string , haveTopRightCrossToCancel?: boolean) =>
  focusedPage<PageSpecState, string, ContextForTest> ( () => ({title:`[${prefix}Title]:`} ),haveTopRightCrossToCancel===true) ( ( s, d, mode ) => (<p>{prefix}[{d}]/{mode}</p>) );

export function pageSpecStateConfig<D> (): PageConfig<PageSpecState, D, SimpleMessage[], ContextForTest> {
  // @ts-ignore  There is some crazy thing going on here around SimpleMessage and SimpleMessage[].
  let pageConfig: PageConfig<PageSpecState, D, SimpleMessage[], ModalDetails> = simpleMessagesPageConfig<PageSpecState, D, ModalDetails> ( Loading );
  return pageConfig;
}

export const pageDetails: MultiPageDetails<PageSpecState, ContextForTest> = {
  firstPage: { pageType: 'MainPage', config: pageSpecStateConfig (), lens: identityOptics<PageSpecState> ().focusQuery ( 'firstPage' ), pageFunction: DisplayPageSpecState ( 'firstPage' ), pageMode: 'edit' },
  clearAtStart: { pageType: 'MainPage', config: pageSpecStateConfig (), lens: identityOptics<PageSpecState> ().focusQuery ( 'firstPage' ), pageFunction: DisplayPageSpecState ( 'firstPage' ), clearAtStart: true, pageMode: 'edit' },
  init: {
    pageType: 'MainPage', config: pageSpecStateConfig (), lens: identityOptics<PageSpecState> ().focusQuery ( 'firstPage' ), pageFunction: DisplayPageSpecState ( 'firstPage' ),
    initialValue: [ { command: 'set', path: '~', value: "Initial Value" } ], pageMode: 'edit'
  },
  secondPage: { pageType: 'MainPage', config: pageSpecStateConfig (), lens: identityOptics<PageSpecState> ().focusQuery ( 'secondPage' ).focusQuery ( 'fromApi' ), pageFunction: DisplayPageSpecState ( 'secondPage' ), clearAtStart: true, pageMode: 'edit' },
  modalData: {
    pageType: 'MainPage', config: pageSpecStateConfig (), lens: identityOptics<PageSpecState> ().focusQuery ( 'tempData' ), pageFunction: DisplayPageSpecState ( 'modalData' ),
    initialValue: [ { command: 'set', path: '~', value: "Initial Value" } ], pageMode: 'edit'
  },
  error: {
    pageType: 'MainPage', config: pageSpecStateConfig (), lens: identityOptics<PageSpecState> ().focusQuery ( 'tempData' ), pageFunction: DisplayPageSpecState ( 'error' ), clearAtStart: true,
    initialValue: [ { command: 'set', path: '~', value: "Initial Value" } ], pageMode: 'edit'
  },
}
export type PageDetails = typeof pageDetails

export const context: ContextForTest = defaultPageSelectionAndRestCommandsContext<PageSpecState> ( pageDetails, {}, {}, {} ,testDateFn, true)

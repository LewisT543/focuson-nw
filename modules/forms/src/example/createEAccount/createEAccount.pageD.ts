import { PageD } from "../../common/pageD";

import { CreateEAccountDataD } from "./createEAccount.dataD";
import { createEAccountRestD } from "./createEAccount.restD";


/** This is the 'bringing it all together */
export const CreateEAccountPageD: PageD = {
  name: 'CreateEAccount',
  pageType: 'MainPage',

  /** This page can only view data */
  modes: [ 'create' ],
  /** How we display the page.*/
  display: { layout: { name: 'Layout', details: '[1][1][1][1]]' }, target: [ 'editing' ], dataDD: CreateEAccountDataD },
  /** When the page is selected for the first time this is the initial state */
  initialValue: 'empty',
  /** This defines the domain data structures in react*/
  domain: {
    editing: { dataDD: CreateEAccountDataD }
  },

  /** Binds the rest to 'where it takes place'. So we have these rest actions, and the gui data is at the location defined by 'targetFromPath'. Fetcher 'true' means set up a fetcher to go get the data when the page is selected */
  rest: {
    eTransfer: { rest: createEAccountRestD, targetFromPath: 'editing', fetcher: undefined }
  },
  /** As well as displaying/editing the data we have these buttons. These are passed to layout */
  buttons: {
    eTransfers: { control: 'RestButton', rest: 'eTransferRestD', action: 'create', confirm: true },
    //questions: how do we know which is the existing plan... is there a list? are we an entry in the list? do we need to navigate to it?
    resetAll: { control: 'ResetStateButton' },
    cancel: { control: 'ResetStateButton' }
  }
}
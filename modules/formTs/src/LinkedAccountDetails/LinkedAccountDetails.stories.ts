import { Story } from "@storybook/react";
import { findOneSelectedPageDetails, PageMode, PageSelection } from "@focuson/pages";
import { SBookProvider } from "@focuson/stories";
import { Lenses } from "@focuson/lens";
import { context, Context, emptyState, FState } from "../common";
import { pages } from "../pages";
import * as render  from "../LinkedAccountDetails/LinkedAccountDetails.render";
import * as domain  from "../LinkedAccountDetails/LinkedAccountDetails.domains";
import * as samples  from "../LinkedAccountDetails/LinkedAccountDetails.samples";
import * as empty from "../LinkedAccountDetails/LinkedAccountDetails.empty";
 
export default {
   component: render.LinkedAccountDetailsPage,
   title: 'Forms/LinkedAccountDetails'
}
 
interface StoryState {
   domain: domain.LinkedAccountDetailsDisplayDomain
   pageMode: PageMode
}
 
const initial = undefined
function pageSelection ( pageMode: PageMode ): PageSelection { return { pageName: 'LinkedAccountDetails', pageMode}}
const Template: Story<StoryState> = ( args: StoryState ) =>{
  const pageDetails: any = pages[ 'LinkedAccountDetails' ];
  const initial = pageDetails.initialValue?pageDetails.initialValue:{}
  const rawState: FState = { ...emptyState, pageSelection: [ pageSelection ( args.pageMode ) ], LinkedAccountDetails: initial }
  const startState=Lenses.identity<FState>().focusQuery('LinkedAccountDetails').focusQuery('display').set(rawState, args.domain)
  return SBookProvider<FState, Context> (startState, context,
     s => findOneSelectedPageDetails ( s, pageDetails.lens, 1) (pageSelection(args.pageMode), 0).element );}
 
 
export const View = Template.bind ( {} );
View.args = {
   domain: samples.sampleLinkedAccountDetailsDisplay0,
   pageMode: 'view'
};
export const Edit = Template.bind ( {} );
 Edit.args = {
   domain: samples.sampleLinkedAccountDetailsDisplay0,
   pageMode: 'edit'
};
 
export const Empty = Template.bind ( {} );
Empty.args = {
   domain: empty.emptyLinkedAccountDetailsDisplay,
   pageMode: 'create'
};
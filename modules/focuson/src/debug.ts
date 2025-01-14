import { FetcherDebug } from "@focuson-nw/fetcher";
import { ModalDebug, SelectedPageDebug } from "@focuson-nw/pages";
import { RestDebug } from "@focuson-nw/rest";
import { AccordionsInDebug, TracingDebug } from "./config";
import { TagFetcherDebug } from "./tagFetcher";

export interface HasFocusOnDebug {
  debug?: FocusOnDebug
}
export interface GuardDebug {
  guardDebug?: boolean
}
export interface ReduxDebug {
  reduxDebug?: boolean
}
export interface ShowValidityDebug {
  validityDebug?: boolean
}
export interface DateDebug {
  dateDebug?: boolean
}
export interface OptionalsDebug {
  optionalsDebug?: boolean
}
export interface FocusOnDebug extends FetcherDebug, SelectedPageDebug, RestDebug, TracingDebug, AccordionsInDebug, TagFetcherDebug, GuardDebug, ReduxDebug, ShowValidityDebug, DateDebug, ModalDebug,OptionalsDebug {


}
import { FetcherDebug } from "@focuson/fetcher";
import { ModalDebug, SelectedPageDebug } from "@focuson/pages";
import { RestDebug } from "@focuson/rest";
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
export interface ShowOptionalsDebug{
  showOptionalsDebug?: boolean
}
export interface FocusOnDebug extends FetcherDebug, SelectedPageDebug, RestDebug, TracingDebug, AccordionsInDebug, TagFetcherDebug, GuardDebug, ReduxDebug, ShowValidityDebug, DateDebug, ModalDebug,ShowOptionalsDebug {


}
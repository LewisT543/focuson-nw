import { CommonStateProps } from "./common";
import { LensState } from "@focuson-nw/state";
import { PageMode } from "@focuson-nw/utils";

export interface SearchListItemsCDProps<S, T, Context> extends CommonStateProps<S, T, Context> {
    title: string
    children?: ( { state, mode }: { state: LensState<S, T[], Context>, mode: PageMode, id: string } ) => JSX.Element
}
//
// // state will be whatever the selected is
// export function SearchListItemsCD<S, T, Context> ( { state, title, children, mode }: SearchListItemsCDProps<S, T, Context> ) {
//     return (
//         <div style={{ border: '2px solid black', backgroundColor: 'white' , 'height': 'auto'}}>
//             <h5>{title}</h5>
//             <div style={{ display: 'flex', flexDirection: 'column', padding: '10px' }}>
//                 <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '20px'}}>
//                     {/*@ts-ignore*/}
//                     <LabelAndStringInput label={'Search: '} state={state}/>
//                 </div>
//                 {children({state, mode})}
//             </div>
//         </div>
//     )
//
// }
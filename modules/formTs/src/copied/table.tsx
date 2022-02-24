import { CommonStateProps } from "./common";
import { PageMode } from "@focuson/pages";
import { safeArray } from "@focuson/utils";
import decamelize from 'decamelize';

export interface TableProps<S, T, Context> extends CommonStateProps<S, T[], Context> {
  order: (keyof T)[];
}

export function Table<S, T, Context> ( { id, order, state }: TableProps<S, T, Context> ) {
  const orderJsx = order.map ( o => <th key={o.toString ()} id={`header-${0})}`}>{decamelize(o.toString(), {separator:' '})}</th> )
  const json: T[] = safeArray ( state.optJson () )
  return <table>
    <thead>{orderJsx}</thead>
    <tbody>{json.map ( ( row, i ) =>
      <tr key={i}>{order.map ( o => <td key={o.toString ()}>{row[ o ]}</td> )}</tr> )}</tbody>
  </table>
}
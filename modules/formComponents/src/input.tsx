import { BooleanValidations, CommonStateProps, NumberValidations, StringValidations } from "./common";
import { reasonFor } from "@focuson/state";
import React from "react";
import { TransformerProps } from "./labelAndInput";
import { BooleanTransformer, NumberTransformer, StringTransformer } from "./transformers";
import { NameAnd } from "@focuson/utils";

export interface InputProps<S, T, Context> extends CommonStateProps<S, T, Context> {
  defaultValue?: string | number;
  readonly?: boolean;
  enums?: NameAnd<string>;
}

export const cleanInputProps = <T extends NameAnd<any>> ( p: T ): T => {
  const result = { ...p }

  delete result.allButtons
  delete result.state
  delete result.readonly
  delete result.ariaLabel
  console.log ( 'in clean props', p, result )
  return result
};

export const Input = <T extends any, P> ( tProps: TransformerProps<T> ) => {
  const { transformer, type } = tProps
  return <S, Props extends InputProps<S, T, Context> & P, Context> ( props: Props ) => {
    const { state, mode, id, name, ariaLabel, defaultValue, readonly } = props
    const onChange = ( transformer: ( s: string ) => T, e: React.ChangeEvent<HTMLInputElement> ) =>
      state.setJson ( transformer ( e.target.value ), reasonFor ( 'Input', 'onChange', id ) );
    console.log ( 'in input' )
    return <input type={type} {...cleanInputProps ( props )} value={`${state.optJsonOr ( tProps.default )}`} readOnly={mode === 'view' || readonly} onChange={( e ) => onChange ( transformer, e )}/>
  }
}

export const StringInput: <S, Context>( props: InputProps<S, string, Context> & StringValidations ) => JSX.Element =
               Input<string, StringValidations> ( StringTransformer )
export const NumberInput: <S, Context>( props: InputProps<S, number, Context> & NumberValidations ) => JSX.Element =
               Input<number, NumberValidations> ( NumberTransformer )
export const BooleanInput: <S, Context>( props: InputProps<S, boolean, Context> & BooleanValidations ) => JSX.Element =
               Input<boolean, BooleanValidations> ( BooleanTransformer )


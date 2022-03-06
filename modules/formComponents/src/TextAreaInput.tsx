import React from 'react';

import {CommonStateProps} from "./common";

export interface TextareaProps<S, T, Context> extends CommonStateProps<S, T, Context> {
    maxLength?: number;
    label?: string
    defaultValue?: string
    value?: string | number
}

export function TextareaInput<S, T, Context>({ id, label, maxLength, state, defaultValue, value }: TextareaProps<S, string, Context>) {
    function onChange(s?: string) {
        if (s) state.setJson(s);
    }
    return (
        <div>
            {label && <label>{label}: </label>}
            <textarea
                id={id}
                maxLength={maxLength}
                onChange={(e) => onChange(e.target?.value)}
                defaultValue={defaultValue}
                value={value}
            />
        </div>
    );
}
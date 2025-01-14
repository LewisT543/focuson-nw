//Copyright (c)2020-2022 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import React from 'react';

import {enzymeSetup} from './enzymeAdapterSetup';
import {shallow} from "enzyme";
import {LensState, lensState} from "@focuson-nw/state";
import {CounterData} from "./domain";
import {Counter} from "./Counter";
import { context, Context } from "./context";


enzymeSetup()
let emptyCounter: CounterData = {value: 0}

function setup<T>(json: T, block: (state: LensState<T, T, Context>, remembered: () => T | undefined) => void) {
    var remembered: T | undefined = undefined
    let state = lensState<T, Context>(json, (json: T): void => {remembered = json}, 'game', context)
    block(state, () => remembered)
}
describe("Counter", () => {
    it("should render", () => {
        setup(emptyCounter, (state, remembered) => {
            const counter = shallow(<Counter state={state}/>)
            expect(counter.text()).toBe("Clicked: 0 times + -")
            expect(remembered()).toEqual(undefined)
        })
    })
    it("should have an increment button that increases the value in the state", () => {
        setup(emptyCounter, (state, remembered) => {
            const counter = shallow(<Counter state={state}/>)
            counter.find("#increment").simulate('click')
            expect(remembered()).toEqual({value: 1})
        })
    })
    it("should have an decrement button that increases the value in the state", () => {
        setup(emptyCounter, (state, remembered) => {
            const counter = shallow(<Counter state={state}/>)
            counter.find("#decrement").simulate('click')
            expect(remembered()).toEqual({value: -1})
        })
    })
})

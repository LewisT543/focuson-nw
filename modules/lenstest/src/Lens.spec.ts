//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {Lens, Lenses} from "@focuson/lens";
import {a1b2ca3, dragon, Dragon, dragon2, letnstoca, list123, Stomach} from "./LensFixture";


describe("Lens", () => {
    describe("identity", () => {
        let lens: Lens<any, any> = Lenses.identity()
        it("should return the same", () => {
            expect(lens.get(a1b2ca3)).toBe(a1b2ca3)
        })
        it("should create the new value", () => {
            expect(lens.set(a1b2ca3, "newValue")).toBe("newValue")
        })
        it("should have a description = identity", () => {
            expect(lens.description).toEqual('I')
        })
    })
    describe("nth", () => {
        it("should allow access to nth item", () => {
            expect(Lenses.nth(0).get(list123)).toBe(1)
            expect(Lenses.nth(1).get(list123)).toBe(2)
            expect(Lenses.nth(2).get(list123)).toBe(3)
        })

        it("should set the nth item", () => {
            expect(Lenses.nth(0).set(list123, 4)).toEqual([4, 2, 3])
            expect(Lenses.nth(1).set(list123, 4)).toEqual([1, 4, 3])
            expect(Lenses.nth(2).set(list123, 4)).toEqual([1, 2, 4])
        })
    })
    describe("lens composition", () => {
        expect(letnstoca.get(a1b2ca3)).toEqual(3)
        expect(letnstoca.set(a1b2ca3, 9)).toEqual({a: 1, b: 2, c: {a: 9}})
        expect(letnstoca.transform(old => {
            expect(old).toEqual(3);
            return 9
        })(a1b2ca3)).toEqual({a: 1, b: 2, c: {a: 9}})
        expect(letnstoca.description).toEqual('toC.chain(toa)')
    })
    describe("'then' should use the field names", () => {
        let dragonStomachL: Lens<Dragon, Stomach> = Lenses.build<Dragon>('dragon').focusOn('body').focusOn('chest').focusOn('stomach')
        let contentL = dragonStomachL.focusOn('contents')
        it("allow chained focusOn", () => {
            expect(dragonStomachL.get(dragon)).toEqual(({contents: ['the adventurer']}))
            expect(contentL.transform(old => [...old, 'moreGoodness'])(dragon)).toEqual(dragon2)
            //and nothing should have changed
            expect(dragonStomachL.get(dragon)).toEqual(({contents: ['the adventurer']}))

        })
        it('should have a nice description', () => {
            expect(dragonStomachL.description).toEqual("dragon.focusOn(body).focusOn(chest).focusOn(stomach)")
        })
    })
    describe("lens.nth", () => {
        let abc = ['a', 'b', 'c'];
        it("should throw exception with negative length", () => {
            expect(() => Lenses.nth<string>(-1)).toThrow('Cannot give Lens.nth a negative n [-1]')
        })
        it("should have a description", () => {
            expect(Lenses.nth(0).description).toEqual('[0]')
            expect(Lenses.nth(5).description).toEqual('[5]')
        })
        describe("get", () => {
            it("should  get", () => {
                expect(Lenses.nth<string>(0).get(abc)).toEqual('a')
                expect(Lenses.nth<string>(1).get(abc)).toEqual('b')
                expect(Lenses.nth<string>(2).get(abc)).toEqual('c')
            })
            it("should  report error if out of range", () => {
                expect(() => Lenses.nth<string>(4).get(abc)).toThrow('Cannot Lens.nth(4).get. arr.length is 3')
            })
        })
        describe("set", () => {
            it("should create new with data inserted", () => {
                expect(Lenses.nth<string>(1).set(abc, 'd')).toEqual(["a", "d", "c"])
                expect(abc).toEqual(['a', 'b', 'c'])
            })
            it("should report error with number out of bounds", () => {
                expect(() => Lenses.nth<string>(4).set(abc, 'd')).toThrow("Cannot Lens.nth(4).set. arr.length is 3")
            })
        })
    })
})
import { lensBuilder, Lenses, NameAndLensFn, Optional, parsePath, PathBuilder, prefixNameAndLens, stateCodeBuilder, stateCodeInitials, tokenisePath } from "@focuson-nw/lens";

describe ( 'tokenisepath', () => {
  it ( "should extract the prefix as a token, replacing 'no prefix with ''", () => {
    expect ( tokenisePath ( 'a' ) ).toEqual ( [ 'a' ] )
    expect ( tokenisePath ( 'a/b' ) ).toEqual ( [ 'a', '/', 'b' ] )
    expect ( tokenisePath ( 'one/two/three' ) ).toEqual ( [ 'one', '/', 'two', '/', 'three' ] )
    expect ( tokenisePath ( '/one/two/three' ) ).toEqual ( [ '/', 'one', '/', 'two', '/', 'three' ] )
    expect ( tokenisePath ( '~one/two/three' ) ).toEqual ( [ '~', 'one', '/', 'two', '/', 'three' ] )
    expect ( tokenisePath ( '' ) ).toEqual ( [] )
    expect ( tokenisePath ( '/' ) ).toEqual ( [ '/' ] )
    expect ( tokenisePath ( '~' ) ).toEqual ( [ '~' ] )
    expect ( tokenisePath ( '$variable' ) ).toEqual ( [ '$variable' ] ) // no prefix
    expect ( tokenisePath ( "/one[$var]" ) ).toEqual ( [ "/", "one", "$var" ] )
  } )

  it ( "should tokenise [ ... ] with simple content", () => {
    expect ( tokenisePath ( '/one[a]/two[b]/three[c]' ) ).toEqual ( [
      "/", "one", "[", "a", "]", "/", "two", "[", "b", "]", "/", "three", "[", "c", "]"
    ] )
  } )
  it ( "should tokenise [ ... ] with numbers", () => {
    expect ( tokenisePath ( '/one[1]/two[2]/three[3]' ) ).toEqual ( [
      "/", "one", "$1", "/", "two", "$2", "/", "three", "$3" ] )
  } )
  it ( "should tokenise [ ... ] with $tokens", () => {
    expect ( tokenisePath ( '/a[$one]/bb[$two]/ccc[$three]' ) ).toEqual ( [
      "/", "a", "$one", "/", "bb", "$two", "/", "ccc", "$three"
    ] )
  } )

  it ( "should tokenise [ ... ] with path in the []", () => {
    expect ( tokenisePath ( '/one[a/b]/two[/bbb/ccc]/three[~/ccc]' ) ).toEqual ( [
      "/", "one", "[", "a", "/", "b", "]", "/", "two", "[", "/", "bbb", "/", "ccc", "]", "/", "three", "[", "~", "/", "ccc", "]" ] )
  } )
  it ( "should tokenise [ ... ] with path in the [] and a $ or two", () => {
    expect ( tokenisePath ( '/one[$next]/two[bbb/ccc]/three[~/ccc][$next]' ) ).toEqual ( [
      "/", "one", "$next", "/", "two", "[", "bbb", "/", "ccc", "]", "/", "three", "[", "~", "/", "ccc", "]", "$next"
    ] )
  } )

  it ( "should tokenise the common usages of #", () => {
    expect ( tokenisePath ( '#variable' ) ).toEqual ( [ "#variable" ] )
    expect ( tokenisePath ( '#var1[#var2]' ) ).toEqual ( [ "#var1", "[", "#var2", "]" ] )
  } )

} )

const stringBuilder: PathBuilder<string> = {
  initialVariable ( name: string ): string {return `initialV(${name})`;},
  isVariable ( name: string ): boolean {return !name.match ( /^[0-9]+$/ );},
  foldVariable ( acc: string, name: string ): string {return acc + `.variable(${name})`;},
  zero ( initial: string ): string { return `#${initial}#`; },
  foldAppend ( acc: string ): string {return acc + '.APPEND' },
  foldLast ( acc: string ): string {return acc + '.LAST' },
  foldNth ( acc: string, n: number ): string {return acc + `.[${n}]` },
  foldBracketsPath ( acc: string, path: string ): any { return acc + '.OPEN[' + path + ']CLOSE' },
  foldKey ( acc: string, key: string ): string { return acc + '.' + key }
}

describe ( "parsePath", () => {
  it ( "should fold the tokens", () => {
    expect ( parsePath ( '/one[$last]/two[bbb/ccc]/three[~/ccc][1][$append]/[#var]', stringBuilder ) ).toEqual (
      '#/#.one.LAST.two.OPEN[##.bbb.ccc]CLOSE.three.OPEN[#~#.ccc]CLOSE.[1].APPEND.OPEN[initialV(var)]CLOSE' )
  } )
  it ( "should fold 'just a variable name'", () => {
    expect ( parsePath ( '#name', stringBuilder ) ).toEqual (
      'initialV(name)' )
  } )
  it ( "should fold '#var1[#var2]", () => {
    expect ( parsePath ( '#var1[#var2]', stringBuilder ) ).toEqual (
      'initialV(var1).OPEN[initialV(var2)]CLOSE' )
  } )
} )

const someData = {
  a: {
    b: {
      c: 'cValue', d: 'dValue',
    },
    e: [ 'zero', 'one' ],
    v0: 0,
    v1: 1,
    vc: 'c',
    vd: 'd',
    vfalse: false,
    vtrue: true
  }
}
const id = Lenses.identity<typeof someData> ()
function makeAbL ( path: Optional<any, any> ) {
  return id.focusQuery ( 'a' ).focusQuery ( 'b' ).chainCalc ( path )
}
function makeAEL ( path: Optional<any, any> ) {
  return id.focusQuery ( 'a' ).focusQuery ( 'e' ).chainCalc ( path )
}
describe ( "calculateNth", () => {
  it ( "should use the data at the end of  pathL as an index into first - string", () => {
    expect ( makeAbL ( id.focusQuery ( 'a' ).focusQuery ( 'vc' ) ).getOption ( someData ) ).toEqual ( 'cValue' )
    expect ( makeAbL ( id.focusQuery ( 'a' ).focusQuery ( 'vd' ) ).getOption ( someData ) ).toEqual ( 'dValue' )
  } )
  it ( "should use the data at the end of  pathL as an index into first - numbers", () => {
    expect ( makeAEL ( id.focusQuery ( 'a' ).focusQuery ( 'v0' ) ).getOption ( someData ) ).toEqual ( 'zero' )
    expect ( makeAEL ( id.focusQuery ( 'a' ).focusQuery ( 'v1' ) ).getOption ( someData ) ).toEqual ( 'one' )
  } )
  it ( "should use the data at the end of  pathL as an index into first - boolean", () => {
    expect ( makeAEL ( id.focusQuery ( 'a' ).focusQuery ( 'vfalse' ) ).getOption ( someData ) ).toEqual ( 'zero' )
    expect ( makeAEL ( id.focusQuery ( 'a' ).focusQuery ( 'vtrue' ) ).getOption ( someData ) ).toEqual ( 'one' )
  } )
} )
describe ( "chainIntoArray", () => {
  function makeLens ( fn: ( o: Optional<any, any> ) => Optional<any, any> ) {return fn ( id.focusQuery ( 'a' ) ).chainIntoArray ( [ 'x', 'y', 'z' ] )}
  const data = { a: { v0: 0, v1: 1, vt: true, vf: false }, b: 'stuff' }
  it ( "should make an optional that uses the value focused on to select an element of an array", () => {
    expect ( makeLens ( s => s.focusQuery ( 'v0' ) ).getOption ( data ) ).toEqual ( 'x' )
    expect ( makeLens ( s => s.focusQuery ( 'v0' ) ).setOption ( data, 'y' ) ).toEqual ( { "a": { "v0": 1, "v1": 1, "vf": false, "vt": true }, "b": "stuff" } )
    expect ( makeLens ( s => s.focusQuery ( 'v1' ) ).getOption ( data ) ).toEqual ( 'y' )
    expect ( makeLens ( s => s.focusQuery ( 'v1' ) ).setOption ( data, 'z' ) ).toEqual ( { "a": { "v0": 0, "v1": 2, "vf": false, "vt": true }, "b": "stuff" } )
    expect ( makeLens ( s => s.focusQuery ( 'vt' ) ).getOption ( data ) ).toEqual ( 'y' )
    expect ( makeLens ( s => s.focusQuery ( 'vt' ) ).setOption ( data, 'x' ) ).toEqual ( { "a": { "v0": 0, "v1": 1, "vf": false, "vt": 0 }, "b": "stuff" } )
    expect ( makeLens ( s => s.focusQuery ( 'vf' ) ).getOption ( data ) ).toEqual ( 'x' )
    expect ( makeLens ( s => s.focusQuery ( 'vf' ) ).setOption ( data, 'y' ) ).toEqual ( { "a": { "v0": 0, "v1": 1, "vf": 1, "vt": true }, "b": "stuff" } )
    expect ( makeLens ( s => s.focusQuery ( 'vf' ) ).description ).toEqual ( "chainIntoArray(x,y,z)" )
  } )
} )

describe ( "parsePathMakingLens", () => {
  const optionals: NameAndLensFn<any> = {
    a: l => l.focusQuery ( 'a' ),
    b: l => l.focusQuery ( 'a' ).focusQuery ( 'b' ),
  }
  it ( "should make an optional", () => {
    expect ( parsePath ( '/', lensBuilder ( prefixNameAndLens (), optionals ) ).description ).toEqual ( 'I' )
    expect ( parsePath ( '/a/v0', lensBuilder ( prefixNameAndLens (), optionals ) ).description ).toEqual ( 'I.focus?(a).focus?(v0)' )
    expect ( parsePath ( '/a/$last', lensBuilder ( prefixNameAndLens (), optionals ) ).description ).toEqual ( 'I.focus?(a).chain([last])' )
    expect ( parsePath ( '/a/$append', lensBuilder ( prefixNameAndLens (), optionals ) ).description ).toEqual ( 'I.focus?(a).chain([append])' )
    expect ( parsePath ( '/a/[1]', lensBuilder ( prefixNameAndLens (), optionals ) ).description ).toEqual ( 'I.focus?(a).chain([1])' )
    expect ( parsePath ( '/a/[/a/b]', lensBuilder ( prefixNameAndLens (), optionals ) ).description ).toEqual ( 'I.focus?(a).chainCalc(I.focus?(a).focus?(b))' )
    expect ( parsePath ( '/a/[b]', lensBuilder ( prefixNameAndLens ( [ '', id.focusQuery ( 'a' ) ] ), optionals ) ).description ).toEqual ( 'I.focus?(a).chainCalc(I.focus?(a).focus?(b))' )
    // expect ( parsePath ( '', lensBuilder ( prefixNameAndLens () ) ) ).toEqual ( undefined )
  } )
  it ( "should throw error if the initial  isn't defined", () => {
    expect ( () => parsePath ( 'a/b', lensBuilder ( prefixNameAndLens (), optionals ) ) ).toThrow ( "Error parsing 'a/b'. Cannot find initial  ''" )
  } )
  it ( "should use variables", () => {
    expect ( parsePath ( '/a/#b', lensBuilder ( prefixNameAndLens (), optionals ) ).description ).toEqual ( 'I.focus?(a).chain(I.focus?(a).focus?(b))' )
    expect ( parsePath ( '/a/#a', lensBuilder ( prefixNameAndLens (), optionals ) ).description ).toEqual ( 'I.focus?(a).chain(I.focus?(a))' )
    expect ( parsePath ( '#a', lensBuilder ( prefixNameAndLens (), optionals ) ).description ).toEqual ( 'I.focus?(a)' )
    expect ( parsePath ( '#b', lensBuilder ( prefixNameAndLens (), optionals ) ).description ).toEqual ( 'I.focus?(a).focus?(b)' )
  } )

  it ( "should work in the style $currentOccupation[$selected]/occupation", () => {
    const data = {
      cur: [ { occupation: 'zero' }, { occupation: 'one' } ],
      selected: 1
    }
    const optionals: NameAndLensFn<any> = {
      currentOccupation: l => l.focusQuery ( 'cur' ),
      selected: l => l.focusQuery ( 'selected' )
    }
    let builder = lensBuilder ( prefixNameAndLens (), optionals );
    expect ( tokenisePath ( '#currentOccupation[#selected]/occupation' ) ).toEqual ( [
      "#currentOccupation", "[", "#selected", "]", "/", "occupation" ] )
    let lens = parsePath ( '#currentOccupation[#selected]/occupation', builder );
    expect ( lens.description ).toEqual ( 'I.focus?(cur).chainCalc(I.focus?(selected)).focus?(occupation)' )
    expect ( lens.getOption ( data ) ).toEqual ( 'one' )
  } )

} )

describe ( "parseMakingCode", () => {
  const initials = stateCodeInitials ( 'FState' )
  it ( "should make code", () => {
    expect ( parsePath ( '/a/v0', stateCodeBuilder ( initials, 'opts' ) ) ).toEqual ( "state.copyWithIdentity().focusQuery('a').focusQuery('v0')" )
    expect ( parsePath ( '~/a/$last', stateCodeBuilder ( initials, 'opts' ) ) ).toEqual ( "fullState.focusQuery('a').chain(Lenses.last())" )
    expect ( parsePath ( 'a/$append', stateCodeBuilder ( initials, 'opts' ) ) ).toEqual ( "state.focusQuery('a').chain(Lenses.append())" )
    expect ( parsePath ( 'a/[1]', stateCodeBuilder ( initials, 'opts' ) ) ).toEqual ( "state.focusQuery('a').chain(Lenses.nth(1))" )
    expect ( parsePath ( '/a/[/a/b]', stateCodeBuilder ( initials, 'opts' ) ) ).toEqual ( "state.copyWithIdentity().focusQuery('a').chainNthFromPath(state.copyWithIdentity().focusQuery('a').focusQuery('b'))" )
    expect ( parsePath ( '/a/[b]', stateCodeBuilder ( initials, 'opts' ) ) ).toEqual ( "state.copyWithIdentity().focusQuery('a').chainNthFromPath(state.focusQuery('b'))" )
  } )
} )
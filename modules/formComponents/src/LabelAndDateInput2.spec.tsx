import { acceptDate, DateInfo, errorsAnd, firstAllowedDate, Holidays, parseDate, validateDateInfo } from "./LabelAndDateInput2";

interface StateForLabelAndStateInput2 {
  dateInfo?: DateInfo;
  theDate?: string
}
const okDateInfo: DateInfo = {
  holidays: [
    { date: '12/11/2022', jurisdiction: 'GB' },
    { date: '12/11/2022', jurisdiction: 'I' },
    { date: '15/11/2022', jurisdiction: 'GB' },
    { date: '17/11/2022', jurisdiction: 'I' },
  ],
  today: '7/11/2022',
}
const badDateInfo: DateInfo = {
  holidays: [
    { date: 'bad1', jurisdiction: 'GB' },
    { date: 'bad2', jurisdiction: 'I' },
  ],
  today: '7/11/2022',
}
const dateFormat = 'dd/MM/yyyy'
const nov7 = new Date ( '2022/11/7' ).toISOString () // need this so that the tests can run in different places
const nov12 = new Date ( '2022/11/12' ).toISOString ()
const nov15 = new Date ( '2022/11/15' ).toISOString ()
const nov17 = new Date ( '2022/11/17' ).toISOString ()

function date ( d: Date | string[] ) {
  if ( Array.isArray ( d ) ) throw Error ()
  return d
}
const toDate = parseDate ( '', dateFormat )

describe ( "parseDate", () => {
  it ( "should parse dates", () => {
    expect ( date ( parseDate ( 'somePrefix', 'dd/MM/yyyy' ) ( '7/11/2022' ) ).toISOString () ).toEqual ( nov7 )
    expect ( date ( parseDate ( 'somePrefix', 'yyyy/MM/dd' ) ( '2022/11/7' ) ).toISOString () ).toEqual ( nov7 )
  } )
  it ( "should handle non dates", () => {
    expect ( parseDate ( 'somePrefix', 'yyyy/MM/dd' ) ( 'someJunk' ) ).toEqual ( [ 'somePrefix Invalid date [someJunk]. Use yyyy/MM/dd' ] )
    expect ( parseDate ( 'somePrefix', 'dd/MM/yyyy' ) ( 'someJunk' ) ).toEqual ( [ 'somePrefix Invalid date [someJunk]. Use dd/MM/yyyy' ] )
  } )
} )

describe ( "validateDateInfo", () => {
  it ( "should turn strings into dates", () => {
    const [ errors, [ dateInfo ] ] = errorsAnd ( [ validateDateInfo ( dateFormat, okDateInfo ) ] )
    expect ( errors ).toHaveLength ( 0 )
    const { holidays, today } = dateInfo
    expect ( today.toISOString () ).toEqual ( nov7 )
    expect ( holidays.map ( ( { date, jurisdiction } ) => `${jurisdiction}:${date.toISOString ()}` ) ).toEqual ( [
      `GB:${nov12}`,
      `I:${nov12}`,
      `GB:${nov15}`,
      `I:${nov17}`
    ] )
  } )
  describe ( "should return issues", () => {
    it ( "should report issues with today", () => {
      const [ errors, [ dateInfo ] ] = errorsAnd ( [ validateDateInfo ( dateFormat, { ...okDateInfo, today: 'junk' } ) ] )
      expect ( errors ).toEqual ( [ "today Invalid date [junk]. Use dd/MM/yyyy" ] )
    } )
    it ( "should report issues with holidayDates", () => {
      const [ errors, [ dateInfo ] ] = errorsAnd ( [ validateDateInfo ( dateFormat, badDateInfo ) ] )
      expect ( errors ).toEqual ( [
        "holidays[0] Invalid date [bad1]. Use dd/MM/yyyy",
        "holidays[1] Invalid date [bad2]. Use dd/MM/yyyy"
      ] )
    } )
  } )
} )

describe ( "acceptDate", () => {
  describe ( "futureOk", () => {
    it ( "should return empty errors if the date is in the future", () => {
      const accept = acceptDate ( dateFormat, 'GB', okDateInfo ) ( { type: 'future', dateFormat } );
      expect ( accept ( new Date ( "2022/11/7" ) ) ).toEqual ( [] ) //today
      expect ( accept ( new Date ( "2022/12/1" ) ) ).toEqual ( [] )
      expect ( accept ( new Date ( "2022/10/3" ) ) ).toEqual ( [ "is before first valid date" ] )
    } )
  } )
  describe ( "pastOk", () => {
    it ( "should return empty errors if the date is in the past", () => {
      const accept = acceptDate ( dateFormat, 'GB', okDateInfo ) ( { type: 'past', dateFormat } );
      expect ( accept ( new Date ( "2022/11/7" ) ) ).toEqual ( [] ) //today
      expect ( accept ( new Date ( "2022/12/1" ) ) ).toEqual ( [ 'is in the future' ] )
      expect ( accept ( new Date ( "2022/10/3" ) ) ).toEqual ( [] )
    } )
  } )
  describe ( "weekendsOK", () => {
    it ( "should return empty errors  no matter the date if 'allowsWeekends' is true", () => {
      const accept = acceptDate ( dateFormat, 'GB', okDateInfo ) ( { type: 'future', dateFormat, allowsWeekends: true } );
      expect ( accept ( new Date ( "2022/11/7" ) ) ).toEqual ( [] ) //today
      expect ( accept ( new Date ( "2022/11/12" ) ) ).toEqual ( [] )
      expect ( accept ( new Date ( "2022/11/8" ) ) ).toEqual ( [] )
    } )
    it ( "should return  errors  if a weekend if 'allowsWeekends' is false ", () => {
      const accept = acceptDate ( dateFormat, 'GB', okDateInfo ) ( { type: 'future', dateFormat, allowsWeekends: false } );
      expect ( accept ( new Date ( "2022/11/7" ) ) ).toEqual ( [] ) //today
      expect ( accept ( new Date ( "2022/11/12" ) ) ).toEqual ( [ "is a weekend" ] )
      expect ( accept ( new Date ( "2022/11/8" ) ) ).toEqual ( [] )
    } )
    it ( "should default to allowsWeekends true", () => {
      const accept = acceptDate ( dateFormat, 'GB', okDateInfo ) ( { type: 'future', dateFormat, allowsWeekends: undefined } );
      expect ( accept ( new Date ( "2022/11/7" ) ) ).toEqual ( [] ) //today
      expect ( accept ( new Date ( "2022/11/12" ) ) ).toEqual ( [] )
      expect ( accept ( new Date ( "2022/11/8" ) ) ).toEqual ( [] )
    } )
  } )
} )

describe ( 'firstAllowedDate', () => {
  const udi = validateDateInfo ( dateFormat, okDateInfo )
  if ( Array.isArray ( udi ) ) throw Error ( 'okDateInfo is actually not ok' )
  it ( "should ignore weekends and holidays when those are ignored", () => {
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat } )?.toString () ).toEqual ( toDate ( '7/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, minWorkingDaysBefore: 1 } )?.toString () ).toEqual ( toDate ( '8/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, minWorkingDaysBefore: 2 } )?.toString () ).toEqual ( toDate ( '9/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, minWorkingDaysBefore: 10 } )?.toString () ).toEqual ( toDate ( '17/11/2022' ).toString () )
  } )
  it ( "should take account of  weekends  when those are not allowed", () => {
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowsWeekends: false } )?.toString () ).toEqual ( toDate ( '7/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowsWeekends: false, minWorkingDaysBefore: 1 } )?.toString () ).toEqual ( toDate ( '8/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowsWeekends: false, minWorkingDaysBefore: 2 } )?.toString () ).toEqual ( toDate ( '9/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowsWeekends: false, minWorkingDaysBefore: 3 } )?.toString () ).toEqual ( toDate ( '10/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowsWeekends: false, minWorkingDaysBefore: 4 } )?.toString () ).toEqual ( toDate ( '11/11/2022' ).toString () )
    //weekend
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowsWeekends: false, minWorkingDaysBefore: 5 } )?.toString () ).toEqual ( toDate ( '14/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowsWeekends: false, minWorkingDaysBefore: 6 } )?.toString () ).toEqual ( toDate ( '15/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowsWeekends: false, minWorkingDaysBefore: 7 } )?.toString () ).toEqual ( toDate ( '16/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowsWeekends: false, minWorkingDaysBefore: 8 } )?.toString () ).toEqual ( toDate ( '17/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowsWeekends: false, minWorkingDaysBefore: 9 } )?.toString () ).toEqual ( toDate ( '18/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowsWeekends: false, minWorkingDaysBefore: 10 } )?.toString () ).toEqual ( toDate ( '21/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowsWeekends: false, minWorkingDaysBefore: 20 } )?.toString () ).toEqual ( toDate ( '5/12/2022' ).toString () )
  } )
  it ( "should take account of  holidays  when those are not allowed", () => {
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowHolidays: false } )?.toString () ).toEqual ( toDate ( '7/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowHolidays: false, minWorkingDaysBefore: 1 } )?.toString () ).toEqual ( toDate ( '8/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowHolidays: false, minWorkingDaysBefore: 2 } )?.toString () ).toEqual ( toDate ( '9/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowHolidays: false, minWorkingDaysBefore: 3 } )?.toString () ).toEqual ( toDate ( '10/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowHolidays: false, minWorkingDaysBefore: 4 } )?.toString () ).toEqual ( toDate ( '11/11/2022' ).toString () )
    //holiday
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowHolidays: false, minWorkingDaysBefore: 5 } )?.toString () ).toEqual ( toDate ( '13/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowHolidays: false, minWorkingDaysBefore: 6 } )?.toString () ).toEqual ( toDate ( '14/11/2022' ).toString () )
    //holiday
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowHolidays: false, minWorkingDaysBefore: 7 } )?.toString () ).toEqual ( toDate ( '16/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowHolidays: false, minWorkingDaysBefore: 8 } )?.toString () ).toEqual ( toDate ( '17/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowHolidays: false, minWorkingDaysBefore: 9 } )?.toString () ).toEqual ( toDate ( '18/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowHolidays: false, minWorkingDaysBefore: 10 } )?.toString () ).toEqual ( toDate ( '19/11/2022' ).toString () )
    expect ( firstAllowedDate ( 'GB', udi, { type: 'future', dateFormat, allowHolidays: false, minWorkingDaysBefore: 20 } )?.toString () ).toEqual ( toDate ( '29/11/2022' ).toString () )
  } )
} )

describe ( "afterMinWorkingDaysBefore", () => {
  const udi = validateDateInfo ( dateFormat, okDateInfo )
  if ( Array.isArray ( udi ) ) throw Error ( 'okDateInfo is actually not ok' )

  it ( "It should take account of the minWorkingDaysBefore", () => {
    const accept = acceptDate ( dateFormat, 'GB', okDateInfo ) ( { type: 'future', dateFormat, minWorkingDaysBefore: 7 } );
    expect ( accept ( new Date ( '15/11/2022' ) ) ).toEqual ( ['is before first valid date'] )
    expect ( accept ( new Date ( '16/11/2022' ) ) ).toEqual ( [] )
  } )
} )

describe ( "holidaysOk", () => {
  //     { date: '12/11/2022', jurisdiction: 'GB' },
  //     { date: '12/11/2022', jurisdiction: 'I' },
  //     { date: '15/11/2022', jurisdiction: 'GB' },
  //     { date: '17/11/2022', jurisdiction: 'I' },
  it ( "should return empty errors no matter the date if 'allowHolidays'is true", () => {
    const accept = acceptDate ( dateFormat, 'GB', okDateInfo ) ( { type: 'future', dateFormat, allowHolidays: true } );
    expect ( accept ( new Date ( "2022/11/7" ) ) ).toEqual ( [] ) //today
    expect ( accept ( new Date ( "2022/11/12" ) ) ).toEqual ( [] )
    expect ( accept ( new Date ( "2022/11/15" ) ) ).toEqual ( [] )
    expect ( accept ( new Date ( "2022/11/17" ) ) ).toEqual ( [] )
  } )
  it ( "should return empty errors no matter the date if 'allowHolidays'is undefined", () => {
    const accept = acceptDate ( dateFormat, 'GB', okDateInfo ) ( { type: 'future', dateFormat, allowHolidays: undefined } );
    expect ( accept ( new Date ( "2022/11/7" ) ) ).toEqual ( [] ) //today
    expect ( accept ( new Date ( "2022/11/12" ) ) ).toEqual ( [] )
    expect ( accept ( new Date ( "2022/11/15" ) ) ).toEqual ( [] )
    expect ( accept ( new Date ( "2022/11/17" ) ) ).toEqual ( [] )
  } )
  it ( "should return an error if 'allowHolidays'is false, and the date is a holiday in the jurisdiction", () => {
    const accept = acceptDate ( dateFormat, 'GB', okDateInfo ) ( { type: 'future', dateFormat, allowHolidays: false } );
    expect ( accept ( new Date ( "2022/11/7" ) ) ).toEqual ( [] ) //today
    expect ( accept ( new Date ( "2022/11/12" ) ) ).toEqual ( [ "is a holiday" ] )
    expect ( accept ( new Date ( "2022/11/15" ) ) ).toEqual ( [ "is a holiday" ] )
    expect ( accept ( new Date ( "2022/11/17" ) ) ).toEqual ( [] )
  } )
  it ( "should return an error if 'allowHolidays'is false, and the date is a holiday in any jurisdiction when the jurisdiction is undefined", () => {
    const accept = acceptDate ( dateFormat, undefined, okDateInfo ) ( { type: 'future', dateFormat, allowHolidays: false } );
    expect ( accept ( new Date ( "2022/11/7" ) ) ).toEqual ( [] ) //today
    expect ( accept ( new Date ( "2022/11/12" ) ) ).toEqual ( [ "is a holiday" ] )
    expect ( accept ( new Date ( "2022/11/15" ) ) ).toEqual ( [ "is a holiday" ] )
    expect ( accept ( new Date ( "2022/11/17" ) ) ).toEqual ( [ "is a holiday" ] )
  } )
} )

import { makeJavaDataSample, makeSampleVariable, makeTsSample } from "../codegen/makeSample";
import { CreatePlanDD, EAccountsSummaryDD } from "../example/eAccountsSummary.dataD";
import { paramsForTest } from "./makeJavaResolvers.spec";


describe ( 'makeJavaSample', () => {
  it ( "should make a immutable map sample for a simple DataD", () => {
    expect ( makeJavaDataSample ( CreatePlanDD, 0 ).map ( s => s.replace ( /"/g, "'" ) ) ).toEqual ( [
      "Map.of('createPlanDate','2020-10-01','createPlanEnd','2020-10-01','createPlanStart','2020-10-01')"
    ])
  } )
  it ( "should make a immutable map sample for a nested DataD", () => {
    expect ( makeJavaDataSample ( EAccountsSummaryDD, 0 ).map ( s => s.replace ( /"/g, "'" ) ) ).toEqual ( [
      "Map.of('createPlan',Map.of('createPlanDate','2020-10-01','createPlanEnd','2020-10-01','createPlanStart','2020-10-01'),'currentAccountBalance','12321','eAccountsTable',Arrays.asList ( Map.of('accountId','1233450','description','This is a one line string','displayType','checking','frequency','This is a one line string','total','This is a one line string','virtualBankSeq','This is a one line string')),'oneAccountBalance','9921','totalMonthlyCost','1000')"
    ] )
  } )

} )


describe ( 'makeSample', () => {
  it ( "should make a JSON sample", () => {
    expect ( makeTsSample ( CreatePlanDD, 0 ) ).toEqual ( {
      "createPlanDate": "2022-03-01",
      "createPlanEnd": "2022-10-01",
      "createPlanStart": "2022-01-01"
    } )
    expect ( makeTsSample ( EAccountsSummaryDD, 0 ) ).toEqual ( {
      "createPlan": {
        "createPlanDate": "2022-03-01",
        "createPlanEnd": "2022-10-01",
        "createPlanStart": "2022-01-01"
      },
      "currentAccountBalance": "12321",
      "eAccountsTable": [
        {
          "accountId": "1233450",
          "description": "This account has a description",
          "displayType": "checking",
          "frequency": "23",
          "total": "1000",
          "virtualBankSeq": "seq1"
        }
      ],
      "oneAccountBalance": "9921",
      "totalMonthlyCost": "1000"
    } )
  } )

} );

describe ( "makeSampleVariable", () => {
  it ( "should attach a sample to a variable", () => {
    expect ( makeSampleVariable ( paramsForTest,CreatePlanDD, 0 ).map ( s => s.replace ( /"/g, "'" ) ) ).toEqual ( [
      "export const CreatePlanDDSample0: domains.CreatePlanDDDomain = ",
      "{",
      "  'createPlanStart': '2022-01-01',",
      "  'createPlanDate': '2022-03-01',",
      "  'createPlanEnd': '2022-10-01'",
      "}"
    ])
  } )
} )
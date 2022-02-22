import { makeAllMockFetchers } from "../codegen/makeMockFetchers";
import { createPlanRestD, eAccountsSummaryRestD } from "../example/eAccounts/eAccountsSummary.restD";
import { paramsForTest } from "./makeJavaResolvers.spec";


describe ( "makeMockFetchers", () => {
  it ( "to make a java mock fetcher", () => {
    expect ( makeAllMockFetchers ( paramsForTest, [ eAccountsSummaryRestD, createPlanRestD ] ).map ( s => s.replace ( /"/g, "'" ) ) ).toEqual ( [
      " public DataFetcher getEAccountsSummaryDD() {  return dataFetchingEnvironment -> sample.sampleEAccountsSummaryDD0;    }",
      " public DataFetcher getCreatePlanDD() {  return dataFetchingEnvironment -> sample.sampleCreatePlanDD0;    }",
      " public DataFetcher createCreatePlanDD() {  return dataFetchingEnvironment -> sample.sampleCreatePlanDD0;    }",
      " public DataFetcher updateCreatePlanDD() {  return dataFetchingEnvironment -> sample.sampleCreatePlanDD0;    }",
      " public DataFetcher deleteCreatePlanDD() {  return dataFetchingEnvironment -> sample.sampleCreatePlanDD0;    }",
      " public DataFetcher listCreatePlanDD() {  return dataFetchingEnvironment -> sample.sampleCreatePlanDD0;    }",
      "  public DataFetcher getAccountSummaryDescription (){ return new StaticDataFetcher('This account has a description');}",
      "  public DataFetcher getTotalMonthlyCost (){ return new StaticDataFetcher('1000');}",
      "  public DataFetcher getOneAccountBalance (){ return new StaticDataFetcher('9921');}",
      "  public DataFetcher getCurrentAccountBalance (){ return new StaticDataFetcher('12321');}"
    ])
  } )
} )
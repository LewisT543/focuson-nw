import { JointAccountPageD } from "../example/jointAccount/jointAccount.pageD";
import { makeDBFetchers } from "../codegen/makeDBFetchers";
import { jointAccountRestD } from "../example/jointAccount/jointAccount.restD";
import { paramsForTest } from "./paramsForTest";
import { PostCodeMainPage } from "../example/postCodeDemo/addressSearch.pageD";

describe ( "makeDbFetchers", () => {
  it ( "should make the java code for the fetcher - single item", () => {
    expect ( makeDBFetchers ( paramsForTest, JointAccountPageD, 'jointAccount', JointAccountPageD.rest.jointAccount ) ).toEqual ( [
      " package focuson.data.dbfetchers.JointAccount;",
      "",
      "import  focuson.data.db.JointAccount.JointAccount_jointAccountMaps;",
      "import  focuson.data.fetchers.IFetcher;",
      "import  focuson.data.fetchers.JointAccount.pre_JointAccount_get_FFetcher;",
      "import graphql.schema.DataFetcher;",
      "import org.springframework.beans.factory.annotation.Autowired;",
      "import org.springframework.stereotype.Component;",
      "",
      "import javax.sql.DataSource;",
      "import java.sql.Connection;",
      "import java.util.Map;",
      "import java.util.List;",
      "import java.util.Optional;",
      "",
      "  @Component",
      "public class pre_JointAccount_get_FFetcherDB implements pre_JointAccount_get_FFetcher {",
      "",
      "  @Autowired",
      "  private DataSource dataSource;",
      "",
      "  public DataFetcher<Map<String,Object>> getpreJointAccount() {",
      "    return dataFetchingEnvironment -> {",
      "      String accountId = dataFetchingEnvironment.getArgument(\"accountId\");",
      "      String brandRef = dataFetchingEnvironment.getArgument(\"brandRef\");",
      "      String dbName = dataFetchingEnvironment.getArgument(\"dbName\");",
      "       Connection c = dataSource.getConnection();",
      "       try {",
      "         //from the data type in JointAccount.rest[jointAccount].dataDD which is a JointAccount ",
      "         Optional<Map<String, Object>> opt = JointAccount_jointAccountMaps.getAll(c,Integer.parseInt(accountId),Integer.parseInt(brandRef));",
      "         Map json = opt.get();",
      "         return json;",
      "       } finally {",
      "         c.close();",
      "       }",
      "    };",
      "  }",
      "",
      "  @Override",
      "  public String dbName() {",
      "      return IFetcher.db;",
      "  }",
      "}"
    ])
  } )
  it ( "should make the java code for the fetcher - repeating item", () => {
    expect ( makeDBFetchers ( paramsForTest, PostCodeMainPage, 'postcode', PostCodeMainPage.rest.postcode ) ).toEqual ( [
      " package focuson.data.dbfetchers.PostCodeMainPage;",
      "",
      "import  focuson.data.db.PostCodeMainPage.PostCodeMainPage_postcodeMaps;",
      "import  focuson.data.fetchers.IFetcher;",
      "import  focuson.data.fetchers.PostCodeMainPage.PostCodeSearchResponse_get_FFetcher;",
      "import graphql.schema.DataFetcher;",
      "import org.springframework.beans.factory.annotation.Autowired;",
      "import org.springframework.stereotype.Component;",
      "",
      "import javax.sql.DataSource;",
      "import java.sql.Connection;",
      "import java.util.Map;",
      "import java.util.List;",
      "import java.util.Optional;",
      "",
      "  @Component",
      "public class PostCodeSearchResponse_get_FFetcherDB implements PostCodeSearchResponse_get_FFetcher {",
      "",
      "  @Autowired",
      "  private DataSource dataSource;",
      "",
      "  public DataFetcher<List<Map<String,Object>>> getPostCodeDataLine() {",
      "    return dataFetchingEnvironment -> {",
      "      String dbName = dataFetchingEnvironment.getArgument(\"dbName\");",
      "      String postcode = dataFetchingEnvironment.getArgument(\"postcode\");",
      "       Connection c = dataSource.getConnection();",
      "       try {",
      "         //from the data type in PostCodeMainPage.rest[postcode].dataDD which is a PostCodeSearchResponse ",
      "         List<Map<String, Object>> list = PostCodeMainPage_postcodeMaps.getAll(c,(postcode));",
      "         return list;",
      "       } finally {",
      "         c.close();",
      "       }",
      "    };",
      "  }",
      "",
      "  @Override",
      "  public String dbName() {",
      "      return IFetcher.db;",
      "  }",
      "}"
    ])
  } )

} )
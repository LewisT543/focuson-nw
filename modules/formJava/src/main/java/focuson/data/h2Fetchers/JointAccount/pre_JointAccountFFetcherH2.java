 package focuson.data.h2Fetchers.JointAccount;

import  focuson.data.db.JointAccount_jointAccountMaps;
import  focuson.data.fetchers.IFetcher;
import  focuson.data.fetchers.JointAccount.pre_JointAccount_get_FFetcher;
import graphql.schema.DataFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.Map;
import java.util.Optional;

  @Component
public class pre_JointAccountFFetcherH2 implements pre_JointAccount_get_FFetcher {

  @Autowired
  private DataSource dataSource;

  public DataFetcher getpreJointAccount() {
    return dataFetchingEnvironment -> {
      String accountId = dataFetchingEnvironment.getArgument("accountId");
      String brandId = dataFetchingEnvironment.getArgument("brandId");
      String dbName = dataFetchingEnvironment.getArgument("dbName");
       Connection c = dataSource.getConnection();
       try {
         Optional<Map<String, Object>> opt = JointAccount_jointAccountMaps.getAll(c,Integer.parseInt(accountId),Integer.parseInt(brandId));
         Map json = opt.get();
         return json;
       } finally {
         c.close();
       }
    };
  }

  @Override
  public String dbName() {
      return IFetcher.h2;
  }
}
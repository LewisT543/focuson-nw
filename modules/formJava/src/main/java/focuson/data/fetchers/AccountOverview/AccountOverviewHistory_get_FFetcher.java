package focuson.data.fetchers.AccountOverview;

import graphql.schema.DataFetcher;
import java.util.Map;
import focuson.data.fetchers.IFetcher;

public interface AccountOverviewHistory_get_FFetcher extends IFetcher{
   public DataFetcher<Map<String,Object>> getAccountOverviewHistory();
}
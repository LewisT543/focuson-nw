package focuson.data.fetchers.OccupationAndIncomeSummary;

import graphql.schema.DataFetcher;
import java.util.Map;
import focuson.data.fetchers.IFetcher;

public interface Dropdowns_get_FFetcher extends IFetcher{
   public DataFetcher<Map<String,Object>> getDropdowns();
}
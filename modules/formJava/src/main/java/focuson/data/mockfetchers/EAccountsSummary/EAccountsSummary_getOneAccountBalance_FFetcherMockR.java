package focuson.data.mockfetchers.EAccountsSummary;
import com.google.common.collect.ImmutableMap;
import graphql.schema.DataFetcher;
import graphql.schema.StaticDataFetcher;
import org.springframework.stereotype.Component;
import focuson.data.fetchers.IFetcher;
import focuson.data.fetchers.EAccountsSummary.EAccountsSummary_getOneAccountBalance_FFetcher;
import focuson.data.Sample;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
@Component
public class EAccountsSummary_getOneAccountBalance_FFetcherMockR  implements EAccountsSummary_getOneAccountBalance_FFetcher{
@Override
public String dbName() {return IFetcher.mock; }
  public DataFetcher getOneAccountBalance (){ return new StaticDataFetcher(9921);}
}
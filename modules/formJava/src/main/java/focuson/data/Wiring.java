package focuson.data;
import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import graphql.GraphQL;
import graphql.schema.GraphQLSchema;
import graphql.schema.DataFetcher;
import graphql.schema.idl.RuntimeWiring;
import graphql.schema.idl.SchemaGenerator;
import graphql.schema.idl.SchemaParser;
import graphql.schema.idl.TypeDefinitionRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.URL;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import focuson.data.fetchers.IFetcher;
import static graphql.schema.idl.TypeRuntimeWiring.newTypeWiring;
import focuson.data.fetchers.HelloWorldDomainDataFFetcher;
import focuson.data.fetchers.AccountAllFlagsFFetcher;
import focuson.data.fetchers.ArrearsDetailsFFetcher;
import focuson.data.fetchers.previous_ArrearsDetailsFFetcher;
import focuson.data.fetchers.AccountOverviewHistoryFFetcher;
import focuson.data.fetchers.AccountOverviewExcessInfoFFetcher;
import focuson.data.fetchers.AccountOverviewFFetcher;
import focuson.data.fetchers.AccountOverviewReasonFFetcher;
import focuson.data.fetchers.JointAccountFFetcher;
import focuson.data.fetchers.AdditionalInfoFirstFFetcher;
import focuson.data.fetchers.AdditionalInfoSecondFFetcher;
import focuson.data.fetchers.OccupationAndIncomeFullDomainFFetcher;
import focuson.data.fetchers.ListOccupationsFFetcher;
import focuson.data.fetchers.OtherIncomeResponseFFetcher;
import focuson.data.fetchers.CreatePlanFFetcher;
import focuson.data.fetchers.EAccountsSummaryFFetcher;
import focuson.data.fetchers.ETransferDataDFFetcher;
import focuson.data.fetchers.CreateEAccountDataFFetcher;
import focuson.data.fetchers.ChequeCreditbooksFFetcher;
import focuson.data.fetchers.RepeatingWholeDataFFetcher;
import focuson.data.fetchers.PostCodeNameAndAddressFFetcher;
import focuson.data.fetchers.PostCodeDataFFetcher;
@Component
public class Wiring  implements IManyGraphQl{
      @Autowired
      List<HelloWorldDomainDataFFetcher> _HelloWorldDomainDataFFetcher;
      @Autowired
      List<AccountAllFlagsFFetcher> _AccountAllFlagsFFetcher;
      @Autowired
      List<ArrearsDetailsFFetcher> _ArrearsDetailsFFetcher;
      @Autowired
      List<previous_ArrearsDetailsFFetcher> _previous_ArrearsDetailsFFetcher;
      @Autowired
      List<AccountOverviewHistoryFFetcher> _AccountOverviewHistoryFFetcher;
      @Autowired
      List<AccountOverviewExcessInfoFFetcher> _AccountOverviewExcessInfoFFetcher;
      @Autowired
      List<AccountOverviewFFetcher> _AccountOverviewFFetcher;
      @Autowired
      List<AccountOverviewReasonFFetcher> _AccountOverviewReasonFFetcher;
      @Autowired
      List<JointAccountFFetcher> _JointAccountFFetcher;
      @Autowired
      List<AdditionalInfoFirstFFetcher> _AdditionalInfoFirstFFetcher;
      @Autowired
      List<AdditionalInfoSecondFFetcher> _AdditionalInfoSecondFFetcher;
      @Autowired
      List<OccupationAndIncomeFullDomainFFetcher> _OccupationAndIncomeFullDomainFFetcher;
      @Autowired
      List<ListOccupationsFFetcher> _ListOccupationsFFetcher;
      @Autowired
      List<OtherIncomeResponseFFetcher> _OtherIncomeResponseFFetcher;
      @Autowired
      List<CreatePlanFFetcher> _CreatePlanFFetcher;
      @Autowired
      List<EAccountsSummaryFFetcher> _EAccountsSummaryFFetcher;
      @Autowired
      List<ETransferDataDFFetcher> _ETransferDataDFFetcher;
      @Autowired
      List<CreateEAccountDataFFetcher> _CreateEAccountDataFFetcher;
      @Autowired
      List<ChequeCreditbooksFFetcher> _ChequeCreditbooksFFetcher;
      @Autowired
      List<RepeatingWholeDataFFetcher> _RepeatingWholeDataFFetcher;
      @Autowired
      List<PostCodeNameAndAddressFFetcher> _PostCodeNameAndAddressFFetcher;
      @Autowired
      List<PostCodeDataFFetcher> _PostCodeDataFFetcher;
   private String sdl;
   private Map<String, GraphQL> cache = Collections.synchronizedMap(new HashMap<>()); //sucks and need to improve
   @PostConstruct
    public void init() throws IOException {
       URL url = Resources.getResource("someSchema.graphql");
       sdl = Resources.toString(url, Charsets.UTF_8);
    }
   @Override
   public GraphQL get(String dbName) {
        if (!cache.containsKey(dbName)) {
        GraphQLSchema graphQLSchema = buildSchema(dbName);
        cache.put(dbName, GraphQL.newGraphQL(graphQLSchema).build());
        }
        return cache.get(dbName);
    }
   private GraphQLSchema buildSchema(String dbName) {
        TypeDefinitionRegistry typeRegistry = new SchemaParser().parse(sdl);
        RuntimeWiring runtimeWiring = buildWiring(dbName);
        SchemaGenerator schemaGenerator = new SchemaGenerator();
        return schemaGenerator.makeExecutableSchema(typeRegistry, runtimeWiring);
   }
   public <T extends IFetcher> T find(List<T> list, String dbName) {
        return list.stream().filter(f -> f.dbName() == dbName).findFirst().get();
   }
   private RuntimeWiring buildWiring(String dbName) {
       return RuntimeWiring.newRuntimeWiring()
          .type(newTypeWiring("Query").dataFetcher("getHelloWorldDomainData", find(_HelloWorldDomainDataFFetcher, dbName).getHelloWorldDomainData()))
          .type(newTypeWiring("Query").dataFetcher("getAccountAllFlags", find(_AccountAllFlagsFFetcher, dbName).getAccountAllFlags()))
          .type(newTypeWiring("Query").dataFetcher("getArrearsDetails", find(_ArrearsDetailsFFetcher, dbName).getArrearsDetails()))
          .type(newTypeWiring("Query").dataFetcher("getArrearsDetails", find(_previous_ArrearsDetailsFFetcher, dbName).getArrearsDetails()))
          .type(newTypeWiring("Query").dataFetcher("getAccountOverviewHistory", find(_AccountOverviewHistoryFFetcher, dbName).getAccountOverviewHistory()))
          .type(newTypeWiring("Query").dataFetcher("getAccountOverviewExcessInfo", find(_AccountOverviewExcessInfoFFetcher, dbName).getAccountOverviewExcessInfo()))
          .type(newTypeWiring("Query").dataFetcher("getAccountOverview", find(_AccountOverviewFFetcher, dbName).getAccountOverview()))
          .type(newTypeWiring("Query").dataFetcher("getAccountOverviewReason", find(_AccountOverviewReasonFFetcher, dbName).getAccountOverviewReason()))
          .type(newTypeWiring("Query").dataFetcher("getJointAccount", find(_JointAccountFFetcher, dbName).getJointAccount()))
          .type(newTypeWiring("Query").dataFetcher("getAdditionalInfoFirst", find(_AdditionalInfoFirstFFetcher, dbName).getAdditionalInfoFirst()))
          .type(newTypeWiring("Mutation").dataFetcher("updateAdditionalInfoFirst", find(_AdditionalInfoFirstFFetcher, dbName).updateAdditionalInfoFirst()))
          .type(newTypeWiring("Query").dataFetcher("getAdditionalInfoSecond", find(_AdditionalInfoSecondFFetcher, dbName).getAdditionalInfoSecond()))
          .type(newTypeWiring("Mutation").dataFetcher("updateAdditionalInfoSecond", find(_AdditionalInfoSecondFFetcher, dbName).updateAdditionalInfoSecond()))
          .type(newTypeWiring("Query").dataFetcher("getOccupationAndIncomeFullDomain", find(_OccupationAndIncomeFullDomainFFetcher, dbName).getOccupationAndIncomeFullDomain()))
          .type(newTypeWiring("Mutation").dataFetcher("updateOccupationAndIncomeFullDomain", find(_OccupationAndIncomeFullDomainFFetcher, dbName).updateOccupationAndIncomeFullDomain()))
          .type(newTypeWiring("Query").dataFetcher("getListOccupations", find(_ListOccupationsFFetcher, dbName).getListOccupations()))
          .type(newTypeWiring("Query").dataFetcher("getOtherIncomeResponse", find(_OtherIncomeResponseFFetcher, dbName).getOtherIncomeResponse()))
          .type(newTypeWiring("Mutation").dataFetcher("updateOtherIncomeResponse", find(_OtherIncomeResponseFFetcher, dbName).updateOtherIncomeResponse()))
          .type(newTypeWiring("Query").dataFetcher("getCreatePlan", find(_CreatePlanFFetcher, dbName).getCreatePlan()))
          .type(newTypeWiring("Mutation").dataFetcher("createCreatePlan", find(_CreatePlanFFetcher, dbName).createCreatePlan()))
          .type(newTypeWiring("Mutation").dataFetcher("updateCreatePlan", find(_CreatePlanFFetcher, dbName).updateCreatePlan()))
          .type(newTypeWiring("Mutation").dataFetcher("deleteCreatePlan", find(_CreatePlanFFetcher, dbName).deleteCreatePlan()))
          .type(newTypeWiring("Query").dataFetcher("listCreatePlan", find(_CreatePlanFFetcher, dbName).listCreatePlan()))
          .type(newTypeWiring("Query").dataFetcher("getEAccountsSummary", find(_EAccountsSummaryFFetcher, dbName).getEAccountsSummary()))
          .type(newTypeWiring("EAccountSummary").dataFetcher("description", find(_EAccountsSummaryFFetcher, dbName).getAccountSummaryDescription()))
          .type(newTypeWiring("EAccountsSummary").dataFetcher("totalMonthlyCost", find(_EAccountsSummaryFFetcher, dbName).getTotalMonthlyCost()))
          .type(newTypeWiring("EAccountsSummary").dataFetcher("oneAccountBalance", find(_EAccountsSummaryFFetcher, dbName).getOneAccountBalance()))
          .type(newTypeWiring("EAccountsSummary").dataFetcher("currentAccountBalance", find(_EAccountsSummaryFFetcher, dbName).getCurrentAccountBalance()))
          .type(newTypeWiring("Mutation").dataFetcher("createETransferDataD", find(_ETransferDataDFFetcher, dbName).createETransferDataD()))
          .type(newTypeWiring("Mutation").dataFetcher("createCreateEAccountData", find(_CreateEAccountDataFFetcher, dbName).createCreateEAccountData()))
          .type(newTypeWiring("Query").dataFetcher("getCreateEAccountData", find(_CreateEAccountDataFFetcher, dbName).getCreateEAccountData()))
          .type(newTypeWiring("Query").dataFetcher("getChequeCreditbooks", find(_ChequeCreditbooksFFetcher, dbName).getChequeCreditbooks()))
          .type(newTypeWiring("Mutation").dataFetcher("createChequeCreditbooks", find(_ChequeCreditbooksFFetcher, dbName).createChequeCreditbooks()))
          .type(newTypeWiring("Mutation").dataFetcher("createRepeatingLine", find(_RepeatingWholeDataFFetcher, dbName).createRepeatingLine()))
          .type(newTypeWiring("Query").dataFetcher("getRepeatingLine", find(_RepeatingWholeDataFFetcher, dbName).getRepeatingLine()))
          .type(newTypeWiring("Mutation").dataFetcher("createPostCodeNameAndAddress", find(_PostCodeNameAndAddressFFetcher, dbName).createPostCodeNameAndAddress()))
          .type(newTypeWiring("Query").dataFetcher("getPostCodeDataLine", find(_PostCodeDataFFetcher, dbName).getPostCodeDataLine()))
       .build();
    }
    @Bean
    public GraphQL graphQL() {
        return get(IFetcher.mock);
    }
}
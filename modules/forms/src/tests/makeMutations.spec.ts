import { getFromResultSetIntoVariables, getFromStatement, makeMutationResolverReturnStatement, makeMutations, mockReturnStatement, setObjectFor, typeForParamAsInput } from "../codegen/makeMutations";
import { paramsForTest } from "./paramsForTest";
import { EAccountsSummaryPD } from "../example/eAccounts/eAccountsSummary.pageD";
import { eAccountsSummaryRestD } from "../example/eAccounts/eAccountsSummary.restD";
import { chequeCreditBooksRestD } from "../example/chequeCreditBooks/chequeCreditBooks.restD";
import { ChequeCreditbooksPD } from "../example/chequeCreditBooks/chequeCreditBooks.pageD";
import { IntegerMutationParam, MutationParam, NullMutationParam, OutputForManualParam, OutputForSqlMutationParam, OutputForStoredProcMutationParam, StringMutationParam } from "../common/resolverD";
import { fromCommonIds } from "../example/commonIds";
import { safeArray } from "@focuson/utils";
import { PaymentsPageD } from "../example/payments/payments.pageD";
import { newPaymentsRD, ValidatePayeeRD } from "../example/payments/payments.restD";

const stringMP: StringMutationParam = { type: 'string', value: 'someString' }
const integerMP: IntegerMutationParam = { type: "integer", value: 123 }
const spOutputMP: OutputForStoredProcMutationParam = { type: "output", javaType: 'String', name: "someNameSP", sqlType: 'someSqlType' }
const nullMP: NullMutationParam = { type: 'null' }
const sqlOutputMP: OutputForSqlMutationParam = { type: "output", rsName: 'rsName', name: "someNameSql", javaType: 'String' }
const manOutputMp: OutputForManualParam = { type: "output", javaType: 'Integer', name: 'someNameMan' }


describe ( "getFromStatement", () => {
  it ( "generate the code to get the mp from a CallableStatement", () => {
    expect ( getFromStatement ( `somePrefix`,'ss', [ stringMP, integerMP, spOutputMP, nullMP, sqlOutputMP, manOutputMp ] ) ).toEqual ( [
      "String someNameSP = ss.getString(3);",
      "String someNameSql = ss.getString(5);",
      "Integer someNameMan = ss.getInt(6);"
    ] )
  } )
} )
describe ( "getFromResultSet", () => {
  it ( "generate the code to get the mp from a ResultSet", () => {
    expect ( getFromResultSetIntoVariables ( `somePrefix`,'ss', [ stringMP, integerMP, spOutputMP, nullMP, sqlOutputMP, manOutputMp ] ) ).toEqual ( [
      "String someNameSql = ss.getString(\"rsName\");"
    ] )
  } )
} )
describe ( "setObjectFor", () => {
  it ( "generate the code to get the mp from a ResultSet", () => {
    expect ( [ stringMP, integerMP, spOutputMP, nullMP ].map ( setObjectFor ) ).toEqual ( [
      "s.setString(1, \"someString\");",
      "s.setInt(2, 123);",
      "s.registerOutParameter(3,java.sql.Types.someSqlType);",
      "s.setObject(4,null);",
    ] )
  } )
} )

describe ( "typeForParamAsInput", () => {
  it ( "the java type if the MutationParam was an input", () => {
    expect ( [ stringMP, integerMP, spOutputMP, nullMP, sqlOutputMP, manOutputMp ].map ( typeForParamAsInput ( 'someError', {} ) ) ).toEqual (
      [ "String", "Integer", "String", "Object", "String", "Integer" ] )
  } )
  it ( "the java type of the input param if it's an input param or string, or the javaType", () => {
    let params: MutationParam[] = [ { type: "input", name: 'someName' }, { type: "input", name: 'someName', javaType: 'String' }, { type: "input", name: 'notIn' } ];
    expect ( params.map ( typeForParamAsInput ( 'someError', { someName: fromCommonIds ( 'accountId' )[ 'accountId' ] } ) ) ).toEqual (
      [ "int", "String", "Object" ] )
  } )
} )
describe ( "mockReturnStatement", () => {
  it ( "void if no MPs", () => {
    expect ( mockReturnStatement ( [] ) ).toEqual ( 'return;' )
  } )
  it ( "the javatype if one MP", () => {
    expect ( mockReturnStatement ( [ manOutputMp ] ) ).toEqual ( "return 0;" )
    expect ( mockReturnStatement ( [ spOutputMP ] ) ).toEqual ( 'return "0";' )
  } )
  it ( "A tuple if many MPs", () => {
    expect ( mockReturnStatement ( [ spOutputMP, sqlOutputMP, manOutputMp ] ) ).toEqual ( 'return new Tuple3<>("0","1",2);' )
  } )
} )
describe ( "returnStatement", () => {
  it ( "void if no MPs", () => {
    expect ( makeMutationResolverReturnStatement ( [] ) ).toEqual ( 'return;' )
  } )
  it ( "the javatype if one MP", () => {
    expect ( makeMutationResolverReturnStatement ( [ spOutputMP, ] ) ).toEqual ( 'return someNameSP;' )
  } )
  it ( "A tuple if many MPs", () => {
    expect ( makeMutationResolverReturnStatement ( [ spOutputMP, sqlOutputMP, manOutputMp ] ) ).toEqual (
      'return new Tuple3<String,String,Integer>(someNameSP,someNameSql,someNameMan);' )
  } )
} )


describe ( "makeMutations", () => {
  it ( "should create an mutation class with a method for each mutation for that rest - simple", () => {
    expect ( makeMutations ( paramsForTest, EAccountsSummaryPD, 'theRestName', eAccountsSummaryRestD, safeArray ( eAccountsSummaryRestD.mutations )[ 0 ] ) ).toEqual ( [
      "package focuson.data.mutator.EAccountsSummary;",
      "",
      "import focuson.data.fetchers.IFetcher;",
      "import org.springframework.stereotype.Component;",
      "import org.springframework.beans.factory.annotation.Autowired;",
      "",
      "import focuson.data.utils.FocusonNotFound404Exception;",
      "import focuson.data.utils.DateFormatter;",
      "import java.util.Map;",
      "import java.util.HashMap;",
      "import java.util.ArrayList;",
      "import java.util.List;",
      "import java.util.Date;",
      "import java.sql.CallableStatement;",
      "import java.sql.PreparedStatement;",
      "import java.sql.ResultSet;",
      "import java.sql.Connection;",
      "import java.sql.SQLException;",
      "import java.text.SimpleDateFormat;",
      "import focuson.data.utils.IOGNL;",
      "import focuson.data.utils.Messages;",
      "import focuson.data.mutator.utils.Tuple2;",
      "@Component",
      "public class EAccountsSummary_state_invalidateMutation {",
      "",
      "    @Autowired IOGNL ognlForBodyAsJson;",
      "    public void auditStuff0(Connection connection, Messages msgs, String dbName, int accountId, int clientRef) throws SQLException {",
      "        if (dbName.equals(IFetcher.mock)) {",
      "           System.out.println(\"Mock audit: auditStuff0( {'type':'string','value':'someString'}, accountId, clientRef+ )\");",
      "           return;",
      "    }",
      "    try (CallableStatement s = connection.prepareCall(\"call auditStuff(?, ?, ?)\")) {",
      "      s.setString(1, \"someString\");",
      "      s.setObject(2, accountId);",
      "      s.setObject(3, clientRef);",
      "      s.execute();",
      "      return;",
      "  }}",
      "",
      "}"
    ] )
  } )
  it ( "should create an mutation class with a method for each mutation for that rest - complex", () => {
    expect ( makeMutations ( paramsForTest, ChequeCreditbooksPD, 'theRestName', chequeCreditBooksRestD, safeArray ( chequeCreditBooksRestD.mutations )[ 0 ] ) ).toEqual ([
      "package focuson.data.mutator.ChequeCreditbooks;",
      "",
      "import focuson.data.fetchers.IFetcher;",
      "import org.springframework.stereotype.Component;",
      "import org.springframework.beans.factory.annotation.Autowired;",
      "",
      "import focuson.data.utils.FocusonNotFound404Exception;",
      "import focuson.data.utils.DateFormatter;",
      "import java.util.Map;",
      "import java.util.HashMap;",
      "import java.util.ArrayList;",
      "import java.util.List;",
      "import java.util.Date;",
      "import java.sql.CallableStatement;",
      "import java.sql.PreparedStatement;",
      "import java.sql.ResultSet;",
      "import java.sql.Connection;",
      "import java.sql.SQLException;",
      "import java.text.SimpleDateFormat;",
      "import focuson.data.utils.IOGNL;",
      "import focuson.data.utils.Messages;",
      "//added by param systemTime",
      "import focuson.data.utils.ITimeService;",
      "import focuson.data.mutator.utils.Tuple2;",
      "import java.util.Date;",
      "import java.util.Date;",
      "@Component",
      "public class ChequeCreditbooks_createMutation {",
      "",
      "    @Autowired IOGNL ognlForBodyAsJson;",
      "    @Autowired",
      "    focuson.data.utils.ITimeService systemTime;",
      "",
      "    public Tuple2<Integer,String> sequencename0(Connection connection, Messages msgs, Object dbName) throws SQLException {",
      "        if (dbName.equals(IFetcher.mock)) {",
      "           System.out.println(\"Mock audit: sequencename0( {'type':'output','name':'checkbookId','javaType':'Integer','sqlType':'INTEGER'}, {'type':'output','name':'checkbookIdPart2','javaType':'String','sqlType':'DATE','datePattern':'dd-MM-yyyy'}, {'type':'autowired','name':'systemTime','class':'{thePackage}.utils.ITimeService','method':'now()','import':true}+ )\");",
      "           return new Tuple2<>(0,\"1\");",
      "    }",
      "    try (CallableStatement s = connection.prepareCall(\"call sequencename(?, ?, ?)\")) {",
      "      s.registerOutParameter(1,java.sql.Types.INTEGER);",
      "      s.registerOutParameter(2,java.sql.Types.DATE);",
      "      s.setObject(3, systemTime.now());",
      "      s.execute();",
      "      Integer checkbookId = s.getInt(1);",
      "      String checkbookIdPart2 = new SimpleDateFormat(\"dd-MM-yyyy\").format(s.getDate(\"2\"));",
      "      return new Tuple2<Integer,String>(checkbookId,checkbookIdPart2);",
      "  }}",
      "    public void auditCreateCheckBook1(Connection connection, Messages msgs, Object dbName, int brandRef, int accountId, Object checkbookId, String checkbookIdPart2) throws SQLException {",
      "      if (checkbookIdPart2 == null) throw new IllegalArgumentException(\"checkbookIdPart2 must not be null\");//{\"type\":\"input\",\"name\":\"checkbookIdPart2\",\"javaType\":\"String\",\"datePattern\":\"dd-MM-yyyy\"} object",
      "        if (dbName.equals(IFetcher.mock)) {",
      "           System.out.println(\"Mock audit: auditCreateCheckBook1( brandRef, accountId, checkbookId, {'type':'input','name':'checkbookIdPart2','javaType':'String','datePattern':'dd-MM-yyyy'}+ )\");",
      "           return;",
      "    }",
      "    try (CallableStatement s = connection.prepareCall(\"call auditCreateCheckBook(?, ?, ?, ?)\")) {",
      "      s.setObject(1, brandRef);",
      "      s.setObject(2, accountId);",
      "      s.setObject(3, checkbookId);",
      "      s.setDate(4, DateFormatter.parseDate(\"dd-MM-yyyy\", checkbookIdPart2));",
      "      s.execute();",
      "      return;",
      "  }}",
      "//If you have a compiler error in the type here, did you match the types of the output params in your manual code with the declared types in the .restD?",
      "    public void manualLog2(Connection connection, Messages msgs, Object dbName, Object checkbookId, Object checkbookIdPart2) throws SQLException {",
      "        if (dbName.equals(IFetcher.mock)) {",
      "           System.out.println(\"Mock audit: manualLog2( checkbookId, checkbookIdPart2+ )\");",
      "           return;",
      "    }",
      "      String now = new Date().toString(); // just showing we can return values and use them. Also demonstrates import",
      "      System.out.println(now + \" checkbookid: \" + checkbookId + \" part2: \" + checkbookIdPart2);",
      "      return;",
      "  }",
      "",
      "}"
    ])

  } )

  it ( "should make mutations for cases: i.e. where only one of several mutations will happen depending on the situation", () => {
    expect ( makeMutations ( paramsForTest, PaymentsPageD, 'newPayments', newPaymentsRD, safeArray ( newPaymentsRD.mutations )[ 0 ] ) ).toEqual ( [
      "package focuson.data.mutator.Payments;",
      "",
      "import focuson.data.fetchers.IFetcher;",
      "import org.springframework.stereotype.Component;",
      "import org.springframework.beans.factory.annotation.Autowired;",
      "",
      "import focuson.data.utils.FocusonNotFound404Exception;",
      "import focuson.data.utils.DateFormatter;",
      "import java.util.Map;",
      "import java.util.HashMap;",
      "import java.util.ArrayList;",
      "import java.util.List;",
      "import java.util.Date;",
      "import java.sql.CallableStatement;",
      "import java.sql.PreparedStatement;",
      "import java.sql.ResultSet;",
      "import java.sql.Connection;",
      "import java.sql.SQLException;",
      "import java.text.SimpleDateFormat;",
      "import focuson.data.utils.IOGNL;",
      "import focuson.data.utils.Messages;",
      "import focuson.data.mutator.utils.Tuple2;",
      "@Component",
      "public class oneLine_Payment_createMutation {",
      "",
      "    @Autowired IOGNL ognlForBodyAsJson;",
      "  @Autowired",
      "  public focuson.data.utils.IOGNL ognl;",
      "//If you have a compiler error in the type here, did you match the types of the output params in your manual code with the declared types in the .restD?",
      "    public Tuple2<String,Integer> create0(Connection connection, Messages msgs, Object dbName, int brandRef, int accountId) throws SQLException {",
      "        if (dbName.equals(IFetcher.mock)) {",
      "           System.out.println(\"Mock audit: create0( brandRef, accountId, {'type':'output','name':'one','javaType':'String'}, {'type':'output','name':'two','javaType':'Integer'}+ )\");",
      "           return new Tuple2<>(\"0\",1);",
      "    }",
      "      if (true && brandRef==3) {",
      "        Tuple15<String,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer> params0 = one0_0(connection,msgs,dbName,accountId);",
      "        String one = params0.t1;",
      "        Integer two = params0.t2;",
      "        Integer three = params0.t3;",
      "        Integer four = params0.t4;",
      "        Integer five = params0.t5;",
      "        Integer six = params0.t6;",
      "        Integer seven = params0.t7;",
      "        Integer eight = params0.t8;",
      "        Integer nine = params0.t9;",
      "        Integer ten = params0.t10;",
      "        Integer eleven = params0.t11;",
      "        Integer twelve = params0.t12;",
      "        Integer thirteen = params0.t13;",
      "        Integer fourteen = params0.t14;",
      "        Integer fiveteen = params0.t15;",
      "        // If you have a compilation error here: do the output params match the output params in the 'case'?",
      "        return new Tuple2<String,Integer>(one,two);",
      "      }",
      "      if (true) {",
      "        Tuple2<Integer,String> params1 = two0_1(connection,msgs,dbName,accountId);",
      "        Integer two = params1.t1;",
      "        String one = params1.t2;",
      "        // If you have a compilation error here: do the output params match the output params in the 'case'?",
      "        return new Tuple2<String,Integer>(one,two);",
      "      }",
      "      throw new RuntimeException(\"No guard condition executed\");",
      "  }",
      "    public Tuple15<String,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer> one0_0(Connection connection, Messages msgs, Object dbName, int accountId) throws SQLException {",
      "        if (dbName.equals(IFetcher.mock)) {",
      "           System.out.println(\"Mock audit: one0_0( {'type':'string','value':'first'}, accountId, {'type':'output','name':'one','javaType':'String','sqlType':'CHAR'}, {'type':'output','name':'two','javaType':'Integer','sqlType':'INTEGER'}, {'type':'output','name':'three','javaType':'Integer','sqlType':'INTEGER'}, {'type':'output','name':'four','javaType':'Integer','sqlType':'INTEGER'}, {'type':'output','name':'five','javaType':'Integer','sqlType':'INTEGER'}, {'type':'output','name':'six','javaType':'Integer','sqlType':'INTEGER'}, {'type':'output','name':'seven','javaType':'Integer','sqlType':'INTEGER'}, {'type':'output','name':'eight','javaType':'Integer','sqlType':'INTEGER'}, {'type':'output','name':'nine','javaType':'Integer','sqlType':'INTEGER'}, {'type':'output','name':'ten','javaType':'Integer','sqlType':'INTEGER'}, {'type':'output','name':'eleven','javaType':'Integer','sqlType':'INTEGER'}, {'type':'output','name':'twelve','javaType':'Integer','sqlType':'INTEGER'}, {'type':'output','name':'thirteen','javaType':'Integer','sqlType':'INTEGER'}, {'type':'output','name':'fourteen','javaType':'Integer','sqlType':'INTEGER'}, {'type':'output','name':'fiveteen','javaType':'Integer','sqlType':'INTEGER'}+ )\");",
      "           return new Tuple15<>(\"0\",1,2,3,4,5,6,7,8,9,10,11,12,13,14);",
      "    }",
      "    try (CallableStatement s = connection.prepareCall(\"call bo11.one(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\")) {",
      "      s.setString(1, \"first\");",
      "      s.setObject(2, accountId);",
      "      s.registerOutParameter(3,java.sql.Types.CHAR);",
      "      s.registerOutParameter(4,java.sql.Types.INTEGER);",
      "      s.registerOutParameter(5,java.sql.Types.INTEGER);",
      "      s.registerOutParameter(6,java.sql.Types.INTEGER);",
      "      s.registerOutParameter(7,java.sql.Types.INTEGER);",
      "      s.registerOutParameter(8,java.sql.Types.INTEGER);",
      "      s.registerOutParameter(9,java.sql.Types.INTEGER);",
      "      s.registerOutParameter(10,java.sql.Types.INTEGER);",
      "      s.registerOutParameter(11,java.sql.Types.INTEGER);",
      "      s.registerOutParameter(12,java.sql.Types.INTEGER);",
      "      s.registerOutParameter(13,java.sql.Types.INTEGER);",
      "      s.registerOutParameter(14,java.sql.Types.INTEGER);",
      "      s.registerOutParameter(15,java.sql.Types.INTEGER);",
      "      s.registerOutParameter(16,java.sql.Types.INTEGER);",
      "      s.registerOutParameter(17,java.sql.Types.INTEGER);",
      "      s.execute();",
      "      String one = s.getString(3);",
      "      Integer two = s.getInt(4);",
      "      Integer three = s.getInt(5);",
      "      Integer four = s.getInt(6);",
      "      Integer five = s.getInt(7);",
      "      Integer six = s.getInt(8);",
      "      Integer seven = s.getInt(9);",
      "      Integer eight = s.getInt(10);",
      "      Integer nine = s.getInt(11);",
      "      Integer ten = s.getInt(12);",
      "      Integer eleven = s.getInt(13);",
      "      Integer twelve = s.getInt(14);",
      "      Integer thirteen = s.getInt(15);",
      "      Integer fourteen = s.getInt(16);",
      "      Integer fiveteen = s.getInt(17);",
      "      return new Tuple15<String,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer,Integer>(one,two,three,four,five,six,seven,eight,nine,ten,eleven,twelve,thirteen,fourteen,fiveteen);",
      "  }}",
      "    public Tuple2<Integer,String> two0_1(Connection connection, Messages msgs, Object dbName, int accountId) throws SQLException {",
      "        if (dbName.equals(IFetcher.mock)) {",
      "           System.out.println(\"Mock audit: two0_1( {'type':'string','value':'second'}, {'type':'output','name':'two','javaType':'Integer','sqlType':'INTEGER'}, {'type':'output','name':'one','javaType':'String','sqlType':'CHAR'}, accountId+ )\");",
      "           return new Tuple2<>(0,\"1\");",
      "    }",
      "    try (CallableStatement s = connection.prepareCall(\"call bo11.two(?, ?, ?, ?)\")) {",
      "      s.setString(1, \"second\");",
      "      s.registerOutParameter(2,java.sql.Types.INTEGER);",
      "      s.registerOutParameter(3,java.sql.Types.CHAR);",
      "      s.setObject(4, accountId);",
      "      s.execute();",
      "      Integer two = s.getInt(2);",
      "      String one = s.getString(3);",
      "      return new Tuple2<Integer,String>(two,one);",
      "  }}",
      "",
      "}"
    ])
  } )

  it ("shouldn't make mock in message types when makeMock false selected", () =>{
    expect ( makeMutations ( paramsForTest, PaymentsPageD, 'newPayments', ValidatePayeeRD, safeArray ( ValidatePayeeRD.mutations )[ 0 ] ) ).toEqual ( [
      "package focuson.data.mutator.Payments;",
      "",
      "import focuson.data.fetchers.IFetcher;",
      "import org.springframework.stereotype.Component;",
      "import org.springframework.beans.factory.annotation.Autowired;",
      "",
      "import focuson.data.utils.FocusonNotFound404Exception;",
      "import focuson.data.utils.DateFormatter;",
      "import java.util.Map;",
      "import java.util.HashMap;",
      "import java.util.ArrayList;",
      "import java.util.List;",
      "import java.util.Date;",
      "import java.sql.CallableStatement;",
      "import java.sql.PreparedStatement;",
      "import java.sql.ResultSet;",
      "import java.sql.Connection;",
      "import java.sql.SQLException;",
      "import java.text.SimpleDateFormat;",
      "import focuson.data.utils.IOGNL;",
      "import focuson.data.utils.Messages;",
      "import focuson.data.mutator.utils.Tuple2;",
      "@Component",
      "public class ValidatedPayeeDetails_state_validateMutation {",
      "",
      "    @Autowired IOGNL ognlForBodyAsJson;",
      "//If you have a compiler error in the type here, did you match the types of the output params in your manual code with the declared types in the .restD?",
      "    public String ValidatedPayeeDetails_state_validate_undefined0(Connection connection, Messages msgs, Object dbName) throws SQLException {",
      "      String payeeStatus= \"SUCCEEDED!!!!!\";",
      "      return payeeStatus;",
      "  }",
      "",
      "}"
    ])


  })

} )
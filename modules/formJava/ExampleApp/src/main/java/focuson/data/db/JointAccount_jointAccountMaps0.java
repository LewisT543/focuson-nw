package focuson.data.db;

import java.sql.ResultSet;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.LinkedList;
import java.util.Optional;
import java.util.Map;
import java.util.stream.Collectors;

//{"accountId":{"rsSetter":"setInt","javaType":"int","commonLens":"accountId","testValue":"custId"},"brandId":{"rsSetter":"setInt","javaType":"int","commonLens":"brandId","testValue":"custId"}}
public class JointAccount_jointAccountMaps0 {
  @SuppressWarnings("SqlResolve")
  public static String sql = "select"+
  "  ACC_TBL.acc_id as ACC_TBL_acc_id,"+
  "  ACC_TBL.brand_id as ACC_TBL_brand_id,"+
  "  mainCustomer.id as mainCustomer_id,"+
  "  mainAddress.customerId as mainAddress_customerId,"+
  "  ACC_TBL.mainCustomerId as ACC_TBL_mainCustomerId,"+
  "  mainAddress.zzline1 as mainAddress_zzline1,"+
  "  mainAddress.zzline2 as mainAddress_zzline2"+
  " from"+
  "  ACC_TBL ACC_TBL,"+
  "  CUST_TBL mainCustomer,"+
  "  ADD_TBL mainAddress"+
  " where  ACC_TBL.acc_id = ? and  ACC_TBL.brand_id = ? and mainCustomer.id = mainAddress.customerId and ACC_TBL.mainCustomerId = mainCustomer.id";
  
  public static Optional<Map<String,Object>> getAll(Connection connection,int accountId,int brandId) throws SQLException {
     return getRoot(connection,accountId,brandId,get0(connection,accountId,brandId),get1(connection,accountId,brandId)).map(x -> x._root);
  }
  public static Optional<JointAccount_jointAccountMaps> getRoot(Connection connection, int accountId, int brandId, List<JointAccount_jointAccountMaps0> list0, List<JointAccount_jointAccountMaps1> list1) throws SQLException {
      PreparedStatement statement = connection.prepareStatement(JointAccount_jointAccountMaps.sql);
    statement.setInt(1,accountId);
    statement.setInt(2,brandId);
      ResultSet rs = statement.executeQuery();
      try {
        return rs.next() ? Optional.of(new JointAccount_jointAccountMaps(rs,list0,list1)) : Optional.empty();
      } finally {
        rs.close();
        statement.close();
      }
  }
  public static List<JointAccount_jointAccountMaps0> get0(Connection connection, int accountId, int brandId) throws SQLException {
      PreparedStatement statement = connection.prepareStatement(JointAccount_jointAccountMaps0.sql);
    statement.setInt(1,accountId);
    statement.setInt(2,brandId);
      ResultSet rs = statement.executeQuery();
      try {
        List<JointAccount_jointAccountMaps0> result = new LinkedList<>();
        while (rs.next())
          result.add(new JointAccount_jointAccountMaps0(rs));
        return result;
      } finally {
        rs.close();
        statement.close();
      }
  }
  public static List<JointAccount_jointAccountMaps1> get1(Connection connection, int accountId, int brandId) throws SQLException {
      PreparedStatement statement = connection.prepareStatement(JointAccount_jointAccountMaps1.sql);
    statement.setInt(1,accountId);
    statement.setInt(2,brandId);
      ResultSet rs = statement.executeQuery();
      try {
        List<JointAccount_jointAccountMaps1> result = new LinkedList<>();
        while (rs.next())
          result.add(new JointAccount_jointAccountMaps1(rs));
        return result;
      } finally {
        rs.close();
        statement.close();
      }
  }
  
  public final Object ACC_TBL_acc_id;
  public final Object ACC_TBL_brand_id;
  public final Object mainCustomer_id;
  public final Object mainAddress_customerId;
  public final Object ACC_TBL_mainCustomerId;
  
  public final Map<String,Object> _root = new HashMap<>();
  public final Map<String,Object> main = new HashMap<>();
  public final Map<String,Object> main_addresses = new HashMap<>();
  public final Map<String,Object> joint = new HashMap<>();
  public final Map<String,Object> joint_addresses = new HashMap<>();
  
  public JointAccount_jointAccountMaps0(ResultSet rs) throws SQLException{
    this.main_addresses.put("line1", rs.getString("mainAddress_zzline1"));
    this.main_addresses.put("line2", rs.getString("mainAddress_zzline2"));
    
    this.ACC_TBL_acc_id = rs.getInt("ACC_TBL_acc_id");
    this.ACC_TBL_brand_id = rs.getInt("ACC_TBL_brand_id");
    this.mainCustomer_id = rs.getInt("mainCustomer_id");
    this.mainAddress_customerId = rs.getInt("mainAddress_customerId");
    this.ACC_TBL_mainCustomerId = rs.getInt("ACC_TBL_mainCustomerId");
    
    _root.put("main", main);
    main.put("addresses", main_addresses);
    
  }
}
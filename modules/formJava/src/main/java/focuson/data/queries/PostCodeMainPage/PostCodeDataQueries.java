package focuson.data.queries.PostCodeMainPage;
public class PostCodeDataQueries{
  public static  String getPostCodeDataLine(String postcode){ 
    return"query{getPostCodeDataLine(" + "postcode:" + "\"" + postcode + "\"" + "){"+
        "    line1"+
        "    line2"+
        "    line3"+
        "    line4"+
        "  }"
  +"}";}
}
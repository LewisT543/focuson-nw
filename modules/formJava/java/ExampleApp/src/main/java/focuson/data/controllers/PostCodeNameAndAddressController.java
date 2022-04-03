package focuson.data.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import focuson.data.Sample;
import focuson.data.queries.PostCodeNameAndAddressQueries;
import graphql.GraphQL;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Map;

  @RestController
  public class PostCodeNameAndAddressController {

  @Autowired
  public GraphQL graphQL;
    @PostMapping(value="/api/address", produces="application/json")
    public ResponseEntity createPostCodeNameAndAddress(@RequestBody String body) throws Exception{
       return Transform.result(graphQL,PostCodeNameAndAddressQueries.createPostCodeNameAndAddress(  Transform.removeQuoteFromProperties(body, Map.class)), "createPostCodeNameAndAddress");
    }

    @PostMapping(value="/api/address/query", produces="application/json")
    public String querycreatePostCodeNameAndAddress(@RequestBody String body) throws Exception{
       return PostCodeNameAndAddressQueries.createPostCodeNameAndAddress(  Transform.removeQuoteFromProperties(body, Map.class));
    }

  @GetMapping(value = "/api/address/sample", produces = "application/json")
    public static String samplePostCodeNameAndAddress() throws Exception {
      return new ObjectMapper().writeValueAsString( Sample.samplePostCodeNameAndAddress0);
    }
  }
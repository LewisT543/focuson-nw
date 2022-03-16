package focuson.data.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import focuson.data.Sample;
import focuson.data.queries.ChequeCreditbooksQueries;
import graphql.GraphQL;
import org.springframework.beans.factory.annotation.Autowired;

  @RestController
  public class ChequeCreditbooksController {

  @Autowired
  public GraphQL graphQL;
    @GetMapping(value="/api/chequeCreditBooks", produces="application/json")
    public ResponseEntity getChequeCreditbooks(@RequestParam String accountId, @RequestParam String applRef, @RequestParam String brandRef, @RequestParam String customerId) throws Exception{
       return Transform.result(graphQL,ChequeCreditbooksQueries.getChequeCreditbooks(accountId, applRef, brandRef, customerId), "getChequeCreditbooks");
    }

    @PostMapping(value="/api/chequeCreditBooks", produces="application/json")
    public ResponseEntity createChequeCreditbooks(@RequestParam String accountId, @RequestParam String applRef, @RequestParam String brandRef, @RequestParam String customerId, @RequestBody String body) throws Exception{
       return Transform.result(graphQL,ChequeCreditbooksQueries.createChequeCreditbooks(accountId, applRef, brandRef, customerId,   Transform.removeQuoteFromProperties(body)), "createChequeCreditbooks");
    }

    @GetMapping(value="/api/chequeCreditBooks/query", produces="application/json")
    public String querygetChequeCreditbooks(@RequestParam String accountId, @RequestParam String applRef, @RequestParam String brandRef, @RequestParam String customerId) throws Exception{
       return ChequeCreditbooksQueries.getChequeCreditbooks(accountId, applRef, brandRef, customerId);
    }

    @PostMapping(value="/api/chequeCreditBooks/query", produces="application/json")
    public String querycreateChequeCreditbooks(@RequestParam String accountId, @RequestParam String applRef, @RequestParam String brandRef, @RequestParam String customerId, @RequestBody String body) throws Exception{
       return ChequeCreditbooksQueries.createChequeCreditbooks(accountId, applRef, brandRef, customerId,   Transform.removeQuoteFromProperties(body));
    }

  @GetMapping(value = "/api/chequeCreditBooks/sample", produces = "application/json")
    public static String sampleChequeCreditbooks() throws Exception {
      return new ObjectMapper().writeValueAsString( Sample.sampleChequeCreditbooks0);
    }
  }
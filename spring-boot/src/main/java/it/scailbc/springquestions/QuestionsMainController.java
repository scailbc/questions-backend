package it.scailbc.springquestions;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class QuestionsMainController {

    @RequestMapping("/")
    public String index() {
        return "Greetings from Spring Boot! Questions?";
    }

}
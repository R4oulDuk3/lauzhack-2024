package com.lauzhack.backend;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Value;

@Slf4j
@SpringBootTest
public class SpringOpenAiClientTest {
	@Value("${spring.ai.openai.api-key}")
	private String apiKey;
	OpenAiApi openAiApi;
	OpenAiChatOptions openAiChatOptions;
	OpenAiChatModel chatModel;

	@BeforeEach
	void prepare(){
		openAiApi = new OpenAiApi(apiKey);
		openAiChatOptions = OpenAiChatOptions.builder()
				.withModel("gpt-4o-mini")
				.withTemperature(0.4)
				.withMaxTokens(200)
				.build();
		chatModel = new OpenAiChatModel(openAiApi, openAiChatOptions);
	}

	@Test
	void testChatCompletion() {
		log.info("apikey {}", apiKey);

		ChatResponse response = chatModel.call(
				new Prompt("Generate the names of 5 famous pirates."));
		log.info("response {}", response.getResult().toString());
	}

}
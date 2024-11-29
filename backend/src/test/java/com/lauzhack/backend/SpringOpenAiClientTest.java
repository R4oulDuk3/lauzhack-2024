package com.lauzhack.backend;

import groovy.util.logging.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.model.Media;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.util.MimeTypeUtils;

@lombok.extern.slf4j.Slf4j
@Slf4j
public class SpringOpenAiClientTest {

	private static final String API_KEY = "";
	private OpenAiApi openAiApi = new OpenAiApi(API_KEY);
	private OpenAiChatOptions openAiChatOptions = OpenAiChatOptions.builder()
			.withModel("gpt-4o-mini")
			.withTemperature(0.4)
			.withMaxTokens(200)
			.build();
	OpenAiChatModel chatModel = new OpenAiChatModel(openAiApi, openAiChatOptions);



	@Test
	void testChatCompletion() {



		ChatResponse response = chatModel.call(
				new Prompt("Generate the names of 5 famous pirates."));
		log.info("response {}", response.getResult().toString());
//// Or with streaming responses
//		Flux<ChatResponse> fluxResponse = chatModel.stream(
//				new Prompt("Generate the names of 5 famous pirates."));
	}

//	@Test
//	void testVisual(){
//		var userMessage = new UserMessage("Explain what do you see on this picture?",
//				new Media(MimeTypeUtils.IMAGE_PNG,
//						"https://docs.spring.io/spring-ai/reference/_images/multimodal.test.png"));
//
//		ChatResponse response = chatModel.call(new Prompt(userMessage,
//				OpenAiChatOptions.builder().withModel(OpenAiApi.ChatModel.GPT_4_O.getValue()).build()));
//	}
}
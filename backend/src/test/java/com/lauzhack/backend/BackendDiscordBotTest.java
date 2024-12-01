package java.com.lauzhack.backend;

import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.TextChannel;
import org.junit.jupiter.api.Test;

import javax.security.auth.login.LoginException;

import static org.junit.jupiter.api.Assertions.assertNotNull;



public class DiscordBotTest {


    private static final String BOT_TOKEN = "MTMxMjYzODIwNzM3NjIzMjU1Mg.Gw_Hqr._wWkYzFugYv8vvunfn_7FH3uAS2VPJs0SnyQuY"; // Replace with your bot token
    private static final String CHANNEL_ID = "1312629705567899661"; // Replace with the channel ID where the bot sends messages

    @Test
    public void testSendMessage() throws LoginException, InterruptedException {
        // Initialize JDA
        JDA jda = JDABuilder.createDefault(BOT_TOKEN)
                .setAutoReconnect(true)
                .build();

        // Wait until the bot is ready
        jda.awaitReady();

        // Get the channel
        TextChannel channel = jda.getTextChannelById(CHANNEL_ID);
        assertNotNull(channel, "Channel should not be null");

        // Send a message
        channel.sendMessage("Hello, this is a test message!").queue(
                message -> System.out.println("Message sent successfully: " + message.getContentDisplay()),
                throwable -> System.err.println("Failed to send message: " + throwable.getMessage())
        );

        // Shutdown the bot after the test
        jda.shutdownNow();
    }
}

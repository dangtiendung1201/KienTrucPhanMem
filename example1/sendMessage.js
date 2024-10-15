import { ServiceBusClient } from "@azure/service-bus";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const connectionString = process.env.CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const sbClient = new ServiceBusClient(connectionString);
const sender = sbClient.createSender(queueName);

// Function to send a message
async function sendMessage() {
  rl.question("Enter message: ", (body) => {
    rl.question("Set priority (1-5, where 1 is highest): ", async (priority) => {
      const message = { body, applicationProperties: { priority: parseInt(priority) } };

      try {
        console.log(`Sending message with priority ${priority}: ${message.body}`);
        await sender.sendMessages(message);
        console.log("Message sent successfully.");
      } catch (error) {
        console.error("Error sending message: ", error);
      } finally {
        // Ask if user wants to send another message
        sendMessage(); // Continue to send messages
      }
    });
  });
}

// Handle Ctrl+C gracefully
process.on('SIGINT', async () => {
  console.log("\nExiting...");

  await sender.close();
  await sbClient.close();
  rl.close();
  process.exit(0);
});

// Start sending messages
sendMessage().catch(console.error);
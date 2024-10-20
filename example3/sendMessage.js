import { ServiceBusClient } from "@azure/service-bus";
import { create } from "domain";
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

// Create 1000 messages with random priority from 2 to 5
async function createMessages() {
  for (let i = 0; i < 1000; i++) {
    const priority = Math.floor(Math.random() * 4) + 2;
    const message = { body: `Message ${i}`, applicationProperties: { priority } };

    await sender.sendMessages(message);
  }

  console.log("1000 messages sent.");
}

// Create 1 urgent message with priority 1 when click button "u" in keyboard
async function createUrgentMessage() {
  rl.question("Press u to send urgent message: ", async (key) => {
    if (key === "u") {
      const message = { body: "Urgent message", applicationProperties: { priority: 1 } };

      await sender.sendMessages(message);
      console.log("Urgent message sent.");
    }

    createUrgentMessage(); // Continue to ask for urgent message
  });
}

// Uncomment the line below to send 1000 messages
createMessages().catch(console.error);
createUrgentMessage().catch(console.error);
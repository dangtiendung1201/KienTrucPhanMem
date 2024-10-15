import { ServiceBusClient } from "@azure/service-bus";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const connectionString = process.env.CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;

async function receiveAllSortedMessages() {
  const sbClient = new ServiceBusClient(connectionString);
  const receiver = sbClient.createReceiver(queueName, { receiveMode: "peekLock" });

  try {
    console.log("Press Ctrl + C to stop...");

    while (true) {
      console.log("Fetching all available messages...");

      const allMessages = await fetchAllMessages(receiver);

      if (allMessages.length > 0) {
        // Sort messages by priority (lower value = higher priority)
        allMessages.sort((a, b) => a.applicationProperties.priority - b.applicationProperties.priority);

        for (const message of allMessages) {
          console.log(`Received message: ${message.body} (Priority: ${message.applicationProperties.priority})`);
          await receiver.completeMessage(message);
        }
      } else {
        console.log("No messages found.");
      }

      // Wait for a short time before fetching again
      await delay(5000);
    }
  } catch (error) {
    console.error("Error receiving messages:", error);
  } finally {
    await receiver.close();
    await sbClient.close();
  }
}

async function fetchAllMessages(receiver) {
  const messages = [];
  let batch;

  do {
    // Fetch up to 256 messages per batch
    batch = await receiver.receiveMessages(256, { maxWaitTimeInMs: 2000 });
    messages.push(...batch);
  } while (batch.length > 0); // Continue fetching until no more messages

  return messages;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

receiveAllSortedMessages().catch(console.error);
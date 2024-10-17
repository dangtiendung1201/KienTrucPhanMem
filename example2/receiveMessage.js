import { ServiceBusClient } from "@azure/service-bus";
import dotenv from "dotenv";

dotenv.config();

// Replace with your connection string and subscription/topic details
const connectionString = process.env.CONNECTION_STRING;
const topicName = process.env.TOPIC_NAME;
const subscriptionName = process.env.SUBSCRIPTION_NAME;

// console.log("ServiceBusConnection:", connectionString);
// console.log("TOPIC_NAME:", topicName);
// console.log("SUBSCRIPTION_NAME:", subscriptionName);

async function receiveMessages() {
  const sbClient = new ServiceBusClient(connectionString);
  const receiver = sbClient.createReceiver(topicName, subscriptionName);

  try {
    console.log(`Waiting for messages from ${topicName}/${subscriptionName}...`);

    const messageHandler = async (message) => {
      console.log(`Received message: ${message.body}`);
      // Acknowledge the message
      await receiver.completeMessage(message);
    };

    const errorHandler = (error) => {
      console.error(`Error: ${error}`);
    };

    receiver.subscribe({
      processMessage: messageHandler,
      processError: errorHandler,
    });

    // Keep the receiver open for 60 seconds to receive messages
    await new Promise((resolve) => setTimeout(resolve, 60000));
  } finally {
    await receiver.close();
    await sbClient.close();
  }
}

// Call the receiveMessages function
receiveMessages().catch((err) => {
  console.error("Error receiving messages: ", err);
});

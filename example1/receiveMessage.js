import { ServiceBusClient } from "@azure/service-bus";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;

async function receiveMessages() {
  const sbClient = new ServiceBusClient(connectionString);
  const receiver = sbClient.createReceiver(queueName, { receiveMode: "peekLock" });

  try {
    console.log("Waiting for messages...");
    const messages = await receiver.receiveMessages(1, { maxWaitTimeInMs: 5000 });

    for (const message of messages) {
      console.log(`Received message: ${message.body}`);
      await receiver.completeMessage(message);  // Mark message as processed
    }
  } finally {
    await receiver.close();
    await sbClient.close();
  }
}

receiveMessages().catch((err) => {
  console.error("Error receiving message: ", err);
});

import { ServiceBusClient } from "@azure/service-bus";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;

async function sendMessage() {
  const sbClient = new ServiceBusClient(connectionString);
  const sender = sbClient.createSender(queueName);

  try {
    const message = { body: "Hello, Azure Service Bus!", label: "TestMessage" };
    console.log(`Sending message: ${message.body}`);
    await sender.sendMessages(message);
    console.log("Message sent successfully.");
  } finally {
    await sender.close();
    await sbClient.close();
  }
}

sendMessage().catch((err) => {
  console.error("Error sending message: ", err);
});
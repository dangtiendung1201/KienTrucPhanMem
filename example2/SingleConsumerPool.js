import { ServiceBusClient } from "@azure/service-bus";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.CONNECTION_STRING;
const topicName = process.env.TOPIC_NAME;
const subscriptionNames = [process.env.HIGH_PRIORITY_SUBSCRIPTION_NAME, process.env.LOW_PRIORITY_SUBSCRIPTION_NAME];

async function createConsumer(subscriptionName) {
    const client = new ServiceBusClient(connectionString);
    const receiver = client.createReceiver(topicName, subscriptionName);

    return { client, receiver };
}

async function receiveMessages(receiver, subscriptionName) {
    const processMessage = async (message) => {
        console.log(`Received message from ${subscriptionName}: ${message.body}`);
        await receiver.completeMessage(message);
    };

    const processError = async (error) => {
        console.error(`Error in subscription ${subscriptionName}: `, error);
    };

    receiver.subscribe({
        processMessage,
        processError
    });
}

async function main() {
    const consumers = [];

    for (const subscriptionName of subscriptionNames) {
        console.log("subscriptionName", subscriptionName)
        const consumer = await createConsumer(subscriptionName);
        consumers.push(consumer);
    }

    for (let index = 0; index < consumers.length; index++) {
        const consumer = consumers[index];
        // await receiveMessages(consumer.receiver, subscriptionNames[index]);
        console.log("Received message from subscription: ", subscriptionNames[index]);
        await receiveMessages(consumer.receiver, subscriptionNames[index]);
    }        

    setTimeout(async () => {
        for (const { client, receiver } of consumers) {
            await receiver.close();
            await client.close();
        }
        console.log("Stopped all consumers.");
    }, 30000);
}

main().catch((err) => {
    console.error("Error occurred: ", err);
});

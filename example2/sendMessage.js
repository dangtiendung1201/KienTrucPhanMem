import { ServiceBusClient } from "@azure/service-bus";
import dotenv from "dotenv";

dotenv.config();

const Priority = {
    High: "highpriority",
    Low: "lowpriority"
};

async function sendMessage() {
    const connectionString = process.env.CONNECTION_STRING;
    const topicName = process.env.TOPIC_NAME;

    // Kiểm tra giá trị của biến môi trường
    console.log("ServiceBusConnection:", connectionString);
    console.log("TOPIC_NAME:", topicName);

    if (!connectionString || !topicName) {
        console.error("Connection string or topic name is not defined.");
        return;
    }

    const sbClient = new ServiceBusClient(connectionString);
    const sender = sbClient.createSender(topicName);

    try {
        for (let i = 0; i < 10; i++) {
            // Gửi thông điệp ưu tiên thấp
            const lowPriorityMessageId = generateMessageId();
            const lowPriorityMessage = {
                body: `Low priority message with Id: ${lowPriorityMessageId}`,
                applicationProperties: { Priority: Priority.Low },
                messageId: lowPriorityMessageId
            };

            await sender.sendMessages(lowPriorityMessage);
            // console.log(`Sent: ${lowPriorityMessage.body}`);
            // Print application properties
            console.log(`Sent: ${lowPriorityMessage.body}, Priority: ${lowPriorityMessage.applicationProperties.Priority}`);

            // Gửi thông điệp ưu tiên cao
            const highPriorityMessageId = generateMessageId();
            const highPriorityMessage = {
                body: `High priority message with Id: ${highPriorityMessageId}`,
                applicationProperties: { Priority: Priority.High },
                messageId: highPriorityMessageId
            };

            await sender.sendMessages(highPriorityMessage);
            // console.log(`Sent: ${highPriorityMessage.body}`);
            // Print application properties
            console.log(`Sent: ${highPriorityMessage.body}, Priority: ${highPriorityMessage.applicationProperties.Priority}`);
        }
    } finally {
        await sender.close();
        await sbClient.close();
    }
}

function generateMessageId() {
    return 'msg-' + Math.random().toString(36).substr(2, 9);
}

sendMessage().catch(console.error);

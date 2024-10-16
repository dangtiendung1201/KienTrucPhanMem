import { ServiceBusClient } from "@azure/service-bus";
import dotenv from "dotenv";

dotenv.config();

const Priority = {
    High: "highPriority",
    Low: "lowPriority"
};

async function sendMessage() {
    const connectionString = process.env.CONNECTION_STRING;
    const queueName = process.env.TOPIC_NAME;

    // Kiểm tra giá trị của biến môi trường
    console.log("ServiceBusConnection:", connectionString);
    console.log("TOPIC_NAME:", queueName);

    if (!connectionString || !queueName) {
        console.error("Connection string or topic name is not defined.");
        return;
    }

    const sbClient = new ServiceBusClient(connectionString);
    const sender = sbClient.createSender(queueName);

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
            console.log(`Sent: ${lowPriorityMessage.body}`);

            // Gửi thông điệp ưu tiên cao
            const highPriorityMessageId = generateMessageId();
            const highPriorityMessage = {
                body: `High priority message with Id: ${highPriorityMessageId}`,
                applicationProperties: { Priority: Priority.High },
                messageId: highPriorityMessageId
            };

            await sender.sendMessages(highPriorityMessage);
            console.log(`Sent: ${highPriorityMessage.body}`);
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

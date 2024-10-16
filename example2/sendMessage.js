import { ServiceBusClient } from "@azure/service-bus";
import dotenv from "dotenv";

dotenv.config();

const Priority = {
    High: "highpriority",
    Low: "lowpriority"
};

export default async function (context, myTimer) {
    const connectionString = process.env.ServiceBusConnection;
    const queueName = process.env.TOPIC_NAME;
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
            context.log(`Sent: ${lowPriorityMessage.body}`);

            // Gửi thông điệp ưu tiên cao
            const highPriorityMessageId = generateMessageId();
            const highPriorityMessage = {
                body: `High priority message with Id: ${highPriorityMessageId}`,
                applicationProperties: { Priority: Priority.High },
                messageId: highPriorityMessageId
            };

            await sender.sendMessages(highPriorityMessage);
            context.log(`Sent: ${highPriorityMessage.body}`);
        }
    } finally {
        await sender.close();
        await sbClient.close();
    }
}

function generateMessageId() {
    return 'msg-' + Math.random().toString(36).substr(2, 9);
}

const {
  SQSClient,
  GetQueueUrlCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  DeleteMessageBatchCommand,
} = require("@aws-sdk/client-sqs");

// SQS CLIENT
const sqs = new SQSClient({
  region: "eu-central-1",
  endpoint: "https://sqs.sevensenders.com/api/v1/shipment-events",
  credentials: {
    accessKeyId: "your-7s-api-key-here", // 7S Shop API Key
    secretAccessKey: "",                  // Keep it blank
  },
});

async function main() {
  // QUEUE URL
  const getQueueUrlResponse = await sqs.send(new GetQueueUrlCommand({ QueueName: "" }));
  const queueUrl = getQueueUrlResponse.QueueUrl;
  console.log("Queue URL:", queueUrl);

  // Example for receiving messages
  const receiveResponse = await sqs.send(
    new ReceiveMessageCommand({ QueueUrl: queueUrl })
  );
  const messages = receiveResponse.Messages || [];
  console.log("Messages in Queue:", messages.length);

  if (messages.length > 0) {
    // Process each message
    for (const message of messages) {
      const messageId = message.MessageId;
      const body = message.Body;

      console.log(`${messageId}: ${body}`);

      // Process the message here...

      // Example for deleting messages one by one
      await sqs.send(
        new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        })
      );
    }

    // Example for deleting messages in batch
    // const messagesToDelete = messages.map((msg, i) => ({ Id: String(i), ReceiptHandle: msg.ReceiptHandle }));
    // await sqs.send(new DeleteMessageBatchCommand({ QueueUrl: queueUrl, Entries: messagesToDelete }));
  } else {
    console.log("No messages in the queue.");
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});

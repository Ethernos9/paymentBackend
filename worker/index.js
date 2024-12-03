import Queue from "bull";
import WebSocket from "ws";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const paymentQueue = new Queue("payment", process.env.REDIS_URL);
console.log("Payment queue from worker", paymentQueue);
console.log("Redis URL:", process.env.REDIS_URL);

const ws = new WebSocket("ws://localhost:8080"); // Connect to main server WebSocket

// WebSocket connection
ws.on("open", () => {
  console.log("Connected to main server");
});

ws.on("error", (error) => {
  console.error("WebSocket error:", error.message);
});

ws.on("close", () => {
  console.log("WebSocket connection closed");
});

// Process payment jobs in the queue
paymentQueue.process(async (job) => {
  const { transactionId } = job.data;
  console.log("Processing job:", job.data);

  try {
    // Fetch the transaction by ID
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) throw new Error("Transaction not found");
    if (transaction.status !== "pending") return;

    const amount = transaction.amount;

    // Fetch sender and receiver
    const sender = await prisma.user.findUnique({
      where: { id: transaction.senderId },
    });

    if (!sender) throw new Error("Sender not found");

    const receiver = await prisma.user.findUnique({
      where: { id: transaction.receiverId },
    });

    if (!receiver) throw new Error("Receiver not found");

    // Check if sender has enough balance
    if (sender.balance < amount) throw new Error("Insufficient balance");

    // Perform the transaction
    await prisma.$transaction(async (txPrisma) => {
      await txPrisma.user.update({
        where: { id: sender.id },
        data: { balance: sender.balance - amount },
      });

      await txPrisma.user.update({
        where: { id: receiver.id },
        data: { balance: receiver.balance + amount },
      });

      await txPrisma.transaction.update({
        where: { id: transactionId },
        data: { status: "success" },
      });
    });

    // Notify the main server about the transaction status
    const status = "success";
    ws.send(JSON.stringify({ transactionId, status }));
    console.log(`Transaction ${transactionId} processed with status: ${status}`);
  } catch (error) {
    console.error("Error processing transaction:", error.message);

    // Update the transaction status to "failed"
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: "failed" },
    });

    // Notify the main server about the failure
    ws.send(
      JSON.stringify({
        transactionId,
        status: "failed",
        error: error.message,
      })
    );
  }
});







































































































































































































// import Queue from "bull"
// import WebSocket from "ws";
// import { PrismaClient } from "@prisma/client";
// import dotenv from "dotenv";
// dotenv.config();

// const prisma = new PrismaClient();
// const paymentQueue = new Queue('payment', process.env.REDIS_URL);
// console.log("Payment queue from worker", paymentQueue)
// console.log("redis url", process.env.REDIS_URL)
// const ws = new WebSocket('ws://localhost:8080'); // Connect to main server WebSocket

// ws.on('open', () => {
//   console.log('Connected to main server');
// });

// paymentQueue.process(async (job) => {
//   const { transactionId } = job.data;
//  console.log("Inside Worker Queue Job--->",job );
//   try {
//     const transaction = await prisma.transaction.findUnique({
//       where: { id: transactionId },
//     });

//     if (!transaction) throw new Error('Transaction not found');
//     if (transaction.status !== 'pending') return;
    
//     const result = await prisma.$transaction(async (prisma) => {
//       // Fetch sender by ID or phone number
//       const transaction  = await prisma.transaction.findFirst({
//         where:{ id : transactionId}
//       });
//       if (!transaction) throw new Error('Transaction not found');

//      const sender = await prisma.user.findFirst({
//        where:{id :  transactionId.senderId}
//      })
//      console.log("sender found", sender)
    
//      const receiver = await prisma.user.findFirst({
//       where:{id :  transactionId.receiverId}
//     })
//     console.log("receiver found", sender)

//       if (!receiver) throw new Error("Receiver not found");

//       // Check sender's balance
//       if (sender.balance < amount) throw new Error("Insufficient balance");

//       // Update balances
//       await prisma.user.update({
//         where: { id: sender.id },
//         data: { balance: sender.balance - amount },
//       });

//       await prisma.user.update({
//         where: { id: receiver.id },
//         data: { balance: receiver.balance + amount },
//       });

//       // // Update transaction status to "success"
//       // await prisma.transaction.update({
//       //   where: { id: transactionId },
//       //   data: { status: "success" },
//       // });
//     });
//      console.log("RESULT", result)

  

//     ws.send(JSON.stringify({ transactionId, status })); // Notify main server
//     console.log(`Transaction ${transactionId} processed with status: ${status}`);
//   } catch (error) {
//     console.error('Error processing transaction:', error.message);
//   }
// });

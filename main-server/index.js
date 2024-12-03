import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import Queue from "bull";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter.js";
import { ExpressAdapter } from "@bull-board/express";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";

dotenv.config();
const app = express();
console.log(process.env.DATABASE_URL);
console.log(process.env.REDIS_URL);

const prisma = new PrismaClient();
const paymentQueue = new Queue("payment", process.env.REDIS_URL);


const port = 4000;

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Setup Bull Dashboard
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullAdapter(paymentQueue)], // Use BullAdapter to wrap the queue
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

// WebSocket server for receiving updates from workers
const wss = new WebSocketServer({ port: 8080 });
let workerConnections = [];

wss.on("connection", (ws) => {
  console.log("Worker connected");
  workerConnections.push(ws);

  ws.on("message", async (message) => {
    const { transactionId, status } = JSON.parse(message);
    console.log("Worker received message through WS", message);
    console.log(`Received update for transaction through Ws ${transactionId}: ${status}`);

    // // Update transaction status
    // await prisma.transaction.update({
    //   where: { id: transactionId },
    //   data: { status },
    // });

    console.log(`Transaction ${transactionId} updated to ${status}`);
  });

  ws.on("close", () => {
    console.log("Worker disconnected");
    workerConnections = workerConnections.filter((conn) => conn !== ws);
  });
});

// Test endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Create User endpoint
app.post("/create", async (req, res) => {
  const { name, email, balance, password, phoneNumber } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        balance,
        password,
        phoneNumber,
      },
    });
    res.status(201).json({ success: true, message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(400).json({ message: "Error creating user", success: false });
  }
});

// Payment initiation endpoint
app.post("/payment", async (req, res) => {
  const { senderId, receiverId, senderPhoneNumber, receiverPhoneNumber, amount } = req.body;

  try {
    const transaction = await prisma.transaction.create({
      data: {
        senderId,
        receiverId,
        amount,
        senderPhoneNumber,
        receiverPhoneNumber,
        status: "pending",
      },
    });

    // Add transaction to the payment queue
    await paymentQueue.add({ transactionId: transaction.id });
    console.log("Transaction added to queue:", transaction.id);

    res.status(201).json({ message: "Payment initiated", transaction });
  } catch (error) {
    console.error("Error processing payment:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => console.log(`Main server running on port ${port}`));

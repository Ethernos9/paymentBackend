# Payment Application 🚀

## Description 📋

This project is a **Payment Application** built using the MERN stack and Prisma, designed to facilitate seamless financial transactions between users. The application includes the following key features:

- ⚡ Queue-based payment processing for high scalability and reliability.
- 🔗 Integration with Redis for efficient task management and job queuing.
- 🔄 Retry mechanisms and failure handling for payment processing.
- 📊 A dashboard to monitor queue activity using **Bull** and **Bull Board**.
- 📡 WebSocket integration to provide real-time updates on transaction statuses.
- 🗄️ PostgreSQL as the database, managed using Prisma ORM.
- 🐳 A Dockerized environment for running the services efficiently.

The system ensures secure, fast, and reliable transaction processing, making it suitable for various e-commerce and financial applications.

---

## Technologies Used 💻

### Backend

- **Node.js**: For building the server-side application.
- **Express.js**: As the web framework for handling routes and middleware.
- **Prisma**: For database management and ORM with PostgreSQL.

### Frontend

- **React.js**: For building an intuitive user interface (future integration planned).

### Queue Management

- **Redis**: As the message broker for managing queues.
- **Bull**: For implementing job queues and handling asynchronous tasks.
- **Bull Board**: For visualizing and managing job queues via a dashboard.

### WebSockets

- **ws (WebSocket)**: For real-time communication between the server and workers.

### Database

- **PostgreSQL**: For storing user and transaction data securely.

### Environment Configuration

- **dotenv**: For managing environment variables securely.

### Deployment & Containerization

- **Docker**: For containerizing the application and running multiple services.
  - Redis, PostgreSQL, Main Server, Worker.
- **Docker Compose**: To orchestrate the multi-container environment.

---

## Features 🌟

- **User Management**: Create and manage user accounts, including balance management.
- **Transaction Processing**: Initiate and process payments with proper validations.
- **Queue Management**:
  - Add transactions to a Redis-backed queue for processing.
  - Monitor job statuses (pending, success, failed) through Bull Board.
- **Real-time Updates**: Workers update the server with transaction status using WebSockets.
- **Error Handling**:
  - Retry mechanism for failed payments.
  - Transaction rollback for database consistency.

---

## Project Setup 🛠️

### Prerequisites

Ensure you have the following installed:

- Node.js (v16 or higher)
- Docker and Docker Compose
- Redis CLI (optional for debugging Redis connection issues)

### Installation Steps 🔧

1. **Clone the repository** 📂:
   ```bash
   git clone <repository-url>
   cd payment-application
## Environment Configuration ⚙️

### Set up environment variables
1. Create a `.env` file in the root directory.
2. Add the following variables:
   ```env
   DATABASE_URL=postgresql://user:password@postgres:5432/payments
   REDIS_URL=redis://redis:6379
   
## Project Setup 🛠️

### Start Docker Services 🐳
Run the following command to build and start all services:
```bash
docker-compose up --build
```


##  Access the Application 🌐

- **Main Server**: [http://localhost:3000](http://localhost:3000)  
- **Bull Dashboard**: [http://localhost:3000/admin/queues](http://localhost:3000/admin/queues)


## Endpoints 🔗

### **Main Server Endpoints**
- **POST** `/create`: Create a new user.
- **POST** `/pay`: Make a payment between users.
- **GET** `/balance/:userId`: Fetch the balance for a specific user.

### **Worker Server Endpoints**
- **GET** `/status`: Get the health status of the worker server.
- **POST** `/retry/:jobId`: Retry a failed job using its Job ID.

---

## License 📜
This project is licensed under the [MIT License](LICENSE).

---

## Contributions 🤝
Contributions are welcome! Feel free to submit a pull request or raise an issue.

---

## Author 🧑‍💻
**Shubham Panse**


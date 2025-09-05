import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.confg";

let server: Server;

const { DB_URI, PORT } = envVars;

const startServer = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connented to mongodb");

    server = app.listen(PORT, () => {
      console.log(`Server is running at PORT: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await connectRedis();
  await startServer();
  await seedSuperAdmin();
})();

// signal termination or sigterm
process.on("SIGTERM", () => {
  console.log("Signal termination detected... server is shuting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// sigint
process.on("SIGINT", () => {
  console.log("sigint detected... server is shuting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// unhandeled rejection error
process.on("unhandledRejection", (error) => {
  console.log("unhandeled rejection error", error);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
// Promise.reject(new Error("Forget to handel this promise"));

// uncauth exception error
process.on("uncaughtException", (error) => {
  console.log("uncatch exption error", error);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
// throw new Error("I forget to catch this error localy");

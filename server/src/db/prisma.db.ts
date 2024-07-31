import { PrismaClient } from "@prisma/client";
import loggerWithNameSpace from "../utils/logger.utils";

const prisma  = new PrismaClient();
export async function connectDB() {
  try {
    const prisma  = new PrismaClient();
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    const logger = loggerWithNameSpace("Database Connection");
    logger.error(error);
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

export default prisma;

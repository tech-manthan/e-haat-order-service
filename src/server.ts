import config from "config";
import connectDB from "./utils/db";
import app from "./app";
import logger from "./utils/logger";

const startServer = async () => {
  const PORT = config.get("server.port") || 5503;

  try {
    await connectDB();

    app
      .listen(PORT, () => logger.info(`Listening on port ${PORT}`))
      .on("error", (err) => {
        logger.error("err", err.message);
        process.exit(1);
      });
  } catch (err) {
    logger.error("Error happened: ", (err as Error).message);
    process.exit(1);
  }
};

void startServer();

import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(
      `SalvageGraph API running on http://localhost:${env.PORT}`
    );
  });
};

startServer();
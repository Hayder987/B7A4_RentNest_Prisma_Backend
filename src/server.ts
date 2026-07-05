import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const port = config.port || 5000;

const main = async () => {
  try {
    await prisma.$connect();
    console.log(`Prisma DB connection SuccessFully`);

    app.listen(port, () => {
      console.log(`RentNest Server SuccessFully Run At PORT:${port}`);
    });

  } catch (error) {
    console.log("server Error Found:", error);
     await prisma.$disconnect();
     process.exit(1)
  }
};

main();

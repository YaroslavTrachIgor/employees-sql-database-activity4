/**
 * Seeds default manager and employee accounts for local development.
 * Run: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const managerHash = await bcrypt.hash("manager123", 10);
  const employeeHash = await bcrypt.hash("employee123", 10);

  await prisma.user.upsert({
    where: { userId: "manager1" },
    update: { passwordHash: managerHash, role: "MANAGER" },
    create: {
      userId: "manager1",
      passwordHash: managerHash,
      role: "MANAGER",
    },
  });

  await prisma.user.upsert({
    where: { userId: "employee1" },
    update: { passwordHash: employeeHash, role: "EMPLOYEE" },
    create: {
      userId: "employee1",
      passwordHash: employeeHash,
      role: "EMPLOYEE",
    },
  });

  console.log("Seeded users: manager1 / manager123, employee1 / employee123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

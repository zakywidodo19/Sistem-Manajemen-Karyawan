const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed Users
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@gmail.com",
      password: "Admin123456",
      role: "ADMIN",
    },
  });

  const hrUser = await prisma.user.upsert({
    where: { email: "hr@gmail.com" },
    update: {},
    create: {
      name: "HR Manager",
      email: "hr@gmail.com",
      password: "Hr123456",
      role: "HR",
    },
  });

  console.log("Users created:", { adminUser: adminUser.email, hrUser: hrUser.email });

  // Seed Sample Employees
  const sampleEmployees = [
    {
      name: "Budi Santoso",
      email: "budi@company.com",
      phone: "081234567890",
      department: "IT",
      position: "Fullstack Developer",
      salary: 12000000,
      status: "ACTIVE",
    },
    {
      name: "Siti Rahmawati",
      email: "siti@company.com",
      phone: "081298765432",
      department: "HRD",
      position: "HR Specialist",
      salary: 9000000,
      status: "ACTIVE",
    },
    {
      name: "Agus Pratama",
      email: "agus@company.com",
      phone: "085678901234",
      department: "Finance",
      position: "Finance Staff",
      salary: 8000000,
      status: "ACTIVE",
    },
  ];

  for (const emp of sampleEmployees) {
    await prisma.employee.upsert({
      where: { email: emp.email },
      update: {},
      create: emp,
    });
  }

  console.log("Sample employees created.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

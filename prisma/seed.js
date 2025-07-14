import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Seed Types first
  const expenseType = await prisma.type.create({
    data: {
      type: "Expense",
    },
  });

  const incomeType = await prisma.type.create({
    data: {
      type: "Income",
    },
  });

  console.log("Types seeded:", { expenseType, incomeType });

  // Seed Categories
  const categories = [
    // Expense categories
    { name: "Food", typeId: expenseType.id },
    { name: "Transportation", typeId: expenseType.id },
    { name: "Housing", typeId: expenseType.id },
    { name: "Entertainment", typeId: expenseType.id },
    { name: "Utilities", typeId: expenseType.id },
    { name: "Healthcare", typeId: expenseType.id },

    // Income categories
    { name: "Salary", typeId: incomeType.id },
    { name: "Freelance", typeId: incomeType.id },
    { name: "Investment", typeId: incomeType.id },
    { name: "Gift", typeId: incomeType.id },
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category.name,
        typeId: category.typeId,
      },
    });
  }

  console.log("Categories seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create sample persons
  const samplePersons = [
    {
      id: uuidv4(),
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@exemple.fr",
      birthDate: new Date("1985-05-15"),
      phone: "0612345678",
      qrCodeData: uuidv4(),
    },
    {
      id: uuidv4(),
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@exemple.fr",
      birthDate: new Date("1990-10-20"),
      phone: "0687654321",
      qrCodeData: uuidv4(),
    },
  ]

  for (const person of samplePersons) {
    await prisma.person.upsert({
      where: { id: person.id },
      update: {},
      create: person,
    })
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

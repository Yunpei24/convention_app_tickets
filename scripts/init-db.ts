import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Initializing database...")

  // Test the connection
  try {
    await prisma.$connect()
    console.log("✅ Database connection successful!")

    // Check if the table exists by trying to count records
    const count = await prisma.person.count()
    console.log(`📊 Current number of persons in database: ${count}`)

    console.log("🎉 Database is ready!")
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

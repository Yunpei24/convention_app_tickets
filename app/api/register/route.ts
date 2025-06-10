import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/db"
import { z } from "zod"

// Validation schema sans date de naissance
const personSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
})

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json()
    //console.log("Received data:", body)

    const validatedData = personSchema.parse(body)

    // Generate unique ID
    const id = uuidv4()

    // Create QR code data (just the UUID)
    const qrCodeData = id

    // Store person in database
    const person = await db.person.create({
      data: {
        id,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        qrCodeData,
      },
    })

    //console.log("Created person:", person)

    // Return person data and QR code
    return NextResponse.json({
      person,
      qrCode: qrCodeData,
    })
  } catch (error) {
    console.error("Error registering person:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to register person",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    // Get QR code data from query parameter
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    //console.log("Verifying QR code:", code)

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          message: "QR code manquant",
        },
        { status: 400 },
      )
    }

    // Find person by QR code data
    const person = await db.person.findFirst({
      where: {
        qrCodeData: code,
      },
    })

    if (!person) {
      return NextResponse.json(
        {
          success: false,
          message: "Personne non trouvée",
        },
        { status: 404 },
      )
    }

    // Return person data
    return NextResponse.json({
      success: true,
      message: "Personne trouvée",
      person,
    })
  } catch (error) {
    console.error("Error verifying QR code:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la vérification du QR code",
      },
      { status: 500 },
    )
  }
}

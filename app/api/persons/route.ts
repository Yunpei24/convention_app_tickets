import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Get all persons from database
    const persons = await db.person.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      persons,
      count: persons.length,
    })
  } catch (error) {
    console.error("Error fetching persons:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la récupération des personnes",
      },
      { status: 500 },
    )
  }
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, Users, RefreshCw, Download } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import QRCode from "react-qr-code"

interface Person {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  qrCodeData: string
  createdAt: string
}

export function PersonsList() {
  const [persons, setPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedQR, setExpandedQR] = useState<string | null>(null)

  // const fetchPersons = async () => {
  //   setLoading(true)
  //   setError(null)

  //   try {
  //     const response = await fetch("/api/persons")
  //     const data = await response.json()

  //     if (!response.ok) {
  //       throw new Error(data.message || "Erreur lors de la récupération des données")
  //     }

  //     setPersons(data.persons)
  //   } catch (error) {
  //     console.error("Error fetching persons:", error)
  //     setError(error instanceof Error ? error.message : "Une erreur est survenue")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchPersons = async () => {
    setLoading(true)
    setError(null)
  
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const response = await fetch(`${apiUrl}/api/persons`)
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la récupération des données")
      }
  
      setPersons(data.persons)
    } catch (error) {
      console.error("Error fetching persons:", error)
      setError(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPersons()
  }, [])

  const exportToCSV = () => {
    const headers = ["ID", "Prénom", "Nom", "Email", "Téléphone", "Date d'enregistrement"]
    const csvContent = [
      headers.join(","),
      ...persons.map((person) =>
        [
          person.id,
          person.firstName,
          person.lastName,
          person.email,
          person.phone,
          format(new Date(person.createdAt), "dd/MM/yyyy HH:mm", { locale: fr }),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `personnes_${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <p>Chargement des données...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-medium">
            {persons.length} personne{persons.length > 1 ? "s" : ""} enregistrée{persons.length > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchPersons} variant="outline" size="sm" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
          <Button onClick={exportToCSV} size="sm" className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {persons.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune personne enregistrée</h3>
          <p className="text-gray-500">Commencez par enregistrer une nouvelle personne.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {persons.map((person) => (
            <Card key={person.id} className="overflow-hidden border-2 hover:border-blue-300 transition-all">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent pb-4">
                <CardTitle className="text-lg text-blue-800">
                  {person.firstName} {person.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <p className="text-gray-900">{person.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Téléphone:</span>
                    <p className="text-gray-900">{person.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Enregistré le:</span>
                    <p className="text-gray-900">{format(new Date(person.createdAt), "PPP", { locale: fr })}</p>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <Button
                    onClick={() => setExpandedQR(expandedQR === person.id ? null : person.id)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {expandedQR === person.id ? "Masquer QR Code" : "Voir QR Code"}
                  </Button>

                  {expandedQR === person.id && (
                    <div className="mt-4 flex justify-center">
                      <div className="border-2 border-blue-200 p-3 bg-white rounded-lg">
                        <QRCode value={person.qrCodeData} size={150} level="H" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-400 pt-2 border-t">ID: {person.id}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

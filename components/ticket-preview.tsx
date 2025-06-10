"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { jsPDF } from "jspdf"
import QRCode from "react-qr-code"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Download, Printer, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface TicketPreviewProps {
  data: {
    person: {
      id: string
      firstName: string
      lastName: string
      email: string
      phone: string
      createdAt: string
    }
    qrCode: string
  }
}

export function TicketPreview({ data }: TicketPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = () => {
    setIsGenerating(true)

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Titre
      doc.setFontSize(24)
      doc.text("Ticket d'enregistrement", 105, 20, { align: "center" })

      // Informations personnelles
      doc.setFontSize(14)
      doc.text(`Nom: ${data.person.lastName}`, 20, 50)
      doc.text(`Prénom: ${data.person.firstName}`, 20, 60)
      doc.text(`Email: ${data.person.email}`, 20, 70)
      doc.text(`Téléphone: ${data.person.phone}`, 20, 80)
      doc.text(`Date d'enregistrement: ${format(new Date(data.person.createdAt), "PPP", { locale: fr })}`, 20, 90)

      // Ajout du QR code
      const qrCanvas = document.getElementById("qr-code") as HTMLCanvasElement
      if (qrCanvas) {
        const qrImage = qrCanvas.toDataURL("image/png")
        doc.addImage(qrImage, "PNG", 65, 110, 80, 80)

        // Identifiant sous le QR code
        doc.setFontSize(12)
        doc.text(`ID: ${data.person.id}`, 105, 200, { align: "center" })
      }

      // Pied de page
      doc.setFontSize(10)
      doc.text("Ce ticket est personnel et ne peut être transféré.", 105, 270, { align: "center" })

      // Téléchargement du PDF
      doc.save(`ticket_${data.person.lastName}_${data.person.firstName}.pdf`)
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const printTicket = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-check-circle"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <div>
          <p className="font-medium">Enregistrement réussi!</p>
          <p className="text-sm">Votre ticket est prêt. Vous pouvez le télécharger ou l'imprimer.</p>
        </div>
      </div>

      <Card
        className="p-6 max-w-md mx-auto print:shadow-none border-2 shadow-lg bg-gradient-to-b from-white to-blue-50"
        id="ticket-container"
      >
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-blue-800">Ticket d&apos;enregistrement</h2>

          <div className="space-y-2">
            <p>
              <span className="font-semibold">Nom:</span> {data.person.lastName}
            </p>
            <p>
              <span className="font-semibold">Prénom:</span> {data.person.firstName}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {data.person.email}
            </p>
            <p>
              <span className="font-semibold">Téléphone:</span> {data.person.phone}
            </p>
            <p>
              <span className="font-semibold">Date d&apos;enregistrement:</span>{" "}
              {format(new Date(data.person.createdAt), "PPP", { locale: fr })}
            </p>
          </div>

          <div className="flex justify-center py-4">
            <div id="qr-wrapper" className="border-2 border-blue-200 p-4 bg-white rounded-lg shadow-sm">
              <QRCode id="qr-code" value={data.qrCode} size={200} level="H" />
            </div>
          </div>

          <p className="text-sm text-gray-500">ID: {data.person.id}</p>
          <p className="text-xs text-gray-400 mt-6">Ce ticket est personnel et ne peut être transféré.</p>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
        <Button
          onClick={generatePDF}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
        >
          <Download size={16} />
          Télécharger PDF
        </Button>
        <Button onClick={printTicket} variant="outline" className="flex items-center gap-2 border-blue-300">
          <Printer size={16} />
          Imprimer
        </Button>
      </div>

      <div className="flex justify-center mt-4 print:hidden">
        <Link href="/">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
          >
            <ArrowLeft size={16} />
            Retour à l&apos;accueil
          </Button>
        </Link>
      </div>
    </div>
  )
}

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

  const generateQRCodeDataURL = async (text: string): Promise<string> => {
    return new Promise((resolve) => {
      // Créer un canvas temporaire pour générer le QR code
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const size = 300 // Taille plus grande pour une meilleure qualité

      canvas.width = size
      canvas.height = size

      // Fond blanc
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(0, 0, size, size)

      // Utiliser une bibliothèque QR code simple
      import("qrcode")
        .then((QRCodeLib) => {
          QRCodeLib.default.toCanvas(
            canvas,
            text,
            {
              width: size,
              margin: 2,
              color: {
                dark: "#000000",
                light: "#FFFFFF",
              },
            },
            (error) => {
              if (error) {
                console.error("Erreur QR code:", error)
                resolve("")
              } else {
                resolve(canvas.toDataURL("image/png"))
              }
            },
          )
        })
        .catch(() => {
          // Fallback: créer un QR code simple manuellement
          ctx.fillStyle = "#000000"
          ctx.font = "12px Arial"
          ctx.textAlign = "center"
          ctx.fillText("QR Code", size / 2, size / 2)
          resolve(canvas.toDataURL("image/png"))
        })
    })
  }

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Couleurs
      const primaryColor = [37, 99, 235] // Bleu
      const secondaryColor = [59, 130, 246] // Bleu clair
      const textColor = [31, 41, 55] // Gris foncé
      const lightGray = [243, 244, 246]

      // En-tête avec dégradé simulé
      doc.setFillColor(...primaryColor)
      doc.rect(0, 0, 210, 40, "F")

      doc.setFillColor(...secondaryColor)
      doc.rect(0, 30, 210, 10, "F")

      // Icône de ticket (dessinée vectoriellement)
      doc.setFillColor(255, 255, 255)
      doc.setDrawColor(255, 255, 255)
      doc.setLineWidth(2)

      // Dessiner une icône de ticket simple
      const iconX = 15
      const iconY = 15
      const iconSize = 20

      // Rectangle principal du ticket
      doc.roundedRect(iconX, iconY, iconSize, iconSize * 0.6, 2, 2, "FD")

      // Perforations sur le côté
      for (let i = 0; i < 3; i++) {
        const perfY = iconY + 3 + i * 4
        doc.circle(iconX + iconSize + 2, perfY, 1, "F")
      }

      // Lignes de texte simulées
      doc.setLineWidth(0.5)
      doc.line(iconX + 3, iconY + 4, iconX + iconSize - 3, iconY + 4)
      doc.line(iconX + 3, iconY + 7, iconX + iconSize - 6, iconY + 7)
      doc.line(iconX + 3, iconY + 10, iconX + iconSize - 4, iconY + 10)

      // Titre principal
      doc.setFontSize(28)
      doc.setFont("helvetica", "bold")
      doc.text("TICKET D'ENREGISTREMENT", 105, 25, { align: "center" })

      // Sous-titre
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text("Convention - Système QR", 105, 32, { align: "center" })

      // Réinitialiser la couleur du texte
      doc.setTextColor(...textColor)

      // Section informations personnelles
      let yPos = 60

      // Titre section
      doc.setFillColor(...lightGray)
      doc.rect(15, yPos - 5, 180, 8, "F")
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("INFORMATIONS PERSONNELLES", 20, yPos)

      yPos += 15
      doc.setTextColor(...textColor)
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")

      // Informations en deux colonnes
      const leftCol = 25
      const rightCol = 110
      const lineHeight = 8

      // Colonne gauche
      doc.setFont("helvetica", "bold")
      doc.text("Nom :", leftCol, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(data.person.lastName.toUpperCase(), leftCol + 20, yPos)

      doc.setFont("helvetica", "bold")
      doc.text("Prénom :", leftCol, yPos + lineHeight)
      doc.setFont("helvetica", "normal")
      doc.text(data.person.firstName, leftCol + 20, yPos + lineHeight)

      // Colonne droite
      doc.setFont("helvetica", "bold")
      doc.text("Email :", rightCol, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(data.person.email, rightCol + 20, yPos)

      doc.setFont("helvetica", "bold")
      doc.text("Téléphone :", rightCol, yPos + lineHeight)
      doc.setFont("helvetica", "normal")
      doc.text(data.person.phone, rightCol + 25, yPos + lineHeight)

      // Date d'enregistrement (sur toute la largeur)
      yPos += lineHeight * 2 + 5
      doc.setFont("helvetica", "bold")
      doc.text("Date d'enregistrement :", leftCol, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(
        format(new Date(data.person.createdAt), "EEEE dd MMMM yyyy 'à' HH:mm", { locale: fr }),
        leftCol + 50,
        yPos,
      )

      // Section QR Code
      yPos += 20

      // Titre section QR
      doc.setFillColor(...lightGray)
      doc.rect(15, yPos - 5, 180, 8, "F")
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("CODE QR D'IDENTIFICATION", 20, yPos)

      // Générer et ajouter le QR code
      try {
        const qrDataURL = await generateQRCodeDataURL(data.qrCode)
        if (qrDataURL) {
          // Cadre pour le QR code
          const qrX = 75
          const qrY = yPos + 10
          const qrSize = 60

          // Fond blanc pour le QR code
          doc.setFillColor(255, 255, 255)
          doc.rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, "F")

          // Bordure
          doc.setDrawColor(...primaryColor)
          doc.setLineWidth(1)
          doc.rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, "S")

          // QR Code
          doc.addImage(qrDataURL, "PNG", qrX, qrY, qrSize, qrSize)

          // Instructions sous le QR code
          doc.setTextColor(...textColor)
          doc.setFontSize(10)
          doc.setFont("helvetica", "italic")
          doc.text("Scannez ce code pour vérifier l'enregistrement", 105, qrY + qrSize + 15, { align: "center" })
        }
      } catch (error) {
        console.error("Erreur lors de la génération du QR code:", error)
        // Afficher un message d'erreur à la place
        doc.setTextColor(220, 38, 38)
        doc.setFontSize(12)
        doc.text("QR Code non disponible", 105, yPos + 40, { align: "center" })
      }

      // ID unique
      yPos += 90
      doc.setFillColor(...lightGray)
      doc.rect(15, yPos - 5, 180, 8, "F")
      doc.setTextColor(...primaryColor)
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text("ID UNIQUE :", 20, yPos)
      doc.setTextColor(...textColor)
      doc.setFont("helvetica", "normal")
      doc.text(data.person.id, 40, yPos)

      // Pied de page
      yPos = 270
      doc.setDrawColor(...primaryColor)
      doc.setLineWidth(0.5)
      doc.line(20, yPos, 190, yPos)

      doc.setTextColor(...primaryColor)
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text("IMPORTANT", 105, yPos + 8, { align: "center" })

      doc.setTextColor(...textColor)
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.text("Ce ticket est personnel et ne peut être transféré.", 105, yPos + 15, { align: "center" })
      doc.text("Conservez-le précieusement pour l'accès à l'événement.", 105, yPos + 22, { align: "center" })

      // Numéro de page et date de génération
      doc.setFontSize(8)
      doc.setTextColor(156, 163, 175)
      doc.text(`Généré le ${format(new Date(), "dd/MM/yyyy à HH:mm")}`, 20, 285)
      doc.text("Page 1/1", 190, 285, { align: "right" })

      // Téléchargement du PDF
      doc.save(`ticket_${data.person.lastName}_${data.person.firstName}_${format(new Date(), "yyyyMMdd")}.pdf`)
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
        className="p-8 max-w-lg mx-auto print:shadow-none border-2 shadow-xl bg-gradient-to-br from-white via-blue-50 to-indigo-100 relative overflow-hidden"
        id="ticket-container"
      >
        {/* Motif décoratif en arrière-plan */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200 to-transparent rounded-full translate-y-12 -translate-x-12 opacity-30"></div>

        <div className="relative z-10 text-center space-y-6">
          {/* En-tête avec icône */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white text-2xl">
              🎫
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-800">Ticket d&apos;Enregistrement</h2>
              <p className="text-sm text-blue-600">Convention - Système QR</p>
            </div>
          </div>

          {/* Informations personnelles dans une carte */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Informations Personnelles
            </h3>
            <div className="grid grid-cols-1 gap-3 text-left">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Nom:</span>
                <span className="font-semibold text-gray-900">{data.person.lastName.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Prénom:</span>
                <span className="font-semibold text-gray-900">{data.person.firstName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Email:</span>
                <span className="font-medium text-gray-900 text-sm break-all">{data.person.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Téléphone:</span>
                <span className="font-medium text-gray-900">{data.person.phone}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-medium text-gray-600">Enregistré le:</span>
                <span className="font-medium text-gray-900 text-sm">
                  {format(new Date(data.person.createdAt), "dd/MM/yyyy à HH:mm", { locale: fr })}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code avec design amélioré */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-blue-200 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4z"
                  clipRule="evenodd"
                />
              </svg>
              Code QR d&apos;Identification
            </h3>
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-xl border-2 border-blue-300 shadow-lg">
                <QRCode id="qr-code" value={data.qrCode} size={180} level="H" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Scannez ce code pour vérifier l&apos;enregistrement</p>
          </div>

          {/* ID et informations de sécurité */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">ID Unique:</p>
            <p className="text-sm font-mono text-gray-700 break-all">{data.person.id}</p>
          </div>

          <div className="text-center pt-4 border-t border-blue-200">
            <p className="text-xs text-blue-600 font-medium">⚠️ IMPORTANT</p>
            <p className="text-xs text-gray-500 mt-1">
              Ce ticket est personnel et ne peut être transféré.
              <br />
              Conservez-le précieusement pour l&apos;accès à l&apos;événement.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
        <Button
          onClick={generatePDF}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg"
        >
          <Download size={16} />
          {isGenerating ? "Génération..." : "Télécharger PDF"}
        </Button>
        <Button
          onClick={printTicket}
          variant="outline"
          className="flex items-center gap-2 border-blue-300 hover:bg-blue-50"
        >
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

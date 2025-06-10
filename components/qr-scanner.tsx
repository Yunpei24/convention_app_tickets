"use client"

import { useState, useEffect, useRef } from "react"
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, Camera, CameraOff } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function QRScanner() {
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<null | {
    success: boolean
    message: string
    person?: {
      id: string
      firstName: string
      lastName: string
      email: string
      phone: string
      createdAt: string
    }
  }>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannerContainerId = "qr-reader"
  const isCleaningUp = useRef(false)

  useEffect(() => {
    // Cleanup function to stop scanner when component unmounts
    return () => {
      cleanupScanner()
    }
  }, [])

  const cleanupScanner = async () => {
    if (isCleaningUp.current) return
    isCleaningUp.current = true

    try {
      if (scannerRef.current) {
        const state = scannerRef.current.getState()
        if (state === Html5QrcodeScannerState.SCANNING) {
          await scannerRef.current.stop()
        }
        await scannerRef.current.clear()
        scannerRef.current = null
      }
    } catch (error) {
      console.error("Error during cleanup:", error)
    } finally {
      isCleaningUp.current = false
    }
  }

  const startScanner = async () => {
    if (isCleaningUp.current) return

    setScanning(true)
    setScanResult(null)
    setError(null)

    try {
      // Clean up any existing scanner first
      await cleanupScanner()

      // Wait a bit for DOM to be ready
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Create new scanner instance
      scannerRef.current = new Html5Qrcode(scannerContainerId)

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      }

      await scannerRef.current.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
    } catch (error) {
      console.error("Error starting scanner:", error)
      setError("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.")
      setScanning(false)
      await cleanupScanner()
    }
  }

  const stopScanner = async () => {
    if (isCleaningUp.current) return

    try {
      if (scannerRef.current) {
        const state = scannerRef.current.getState()
        if (state === Html5QrcodeScannerState.SCANNING) {
          await scannerRef.current.stop()
        }
      }
    } catch (error) {
      console.error("Error stopping scanner:", error)
    } finally {
      setScanning(false)
    }
  }

  // const onScanSuccess = async (decodedText: string) => {
  //   if (isCleaningUp.current) return

  //   // Stop scanning after successful scan
  //   await stopScanner()
  //   setLoading(true)

  //   try {
  //     // Verify the QR code with the backend
  //     const response = await fetch(`/api/verify?code=${encodeURIComponent(decodedText)}`)
  //     const data = await response.json()

  //     setScanResult(data)
  //   } catch (error) {
  //     console.error("Error verifying QR code:", error)
  //     setScanResult({
  //       success: false,
  //       message: "Erreur lors de la vérification du QR code.",
  //     })
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const onScanSuccess = async (decodedText: string) => {
    if (isCleaningUp.current) return
  
    // Stop scanning after successful scan
    await stopScanner()
    setLoading(true)
  
    try {
      // Use the environment variable for the API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const response = await fetch(`${apiUrl}/api/verify?code=${encodeURIComponent(decodedText)}`)
      const data = await response.json()
  
      setScanResult(data)
    } catch (error) {
      console.error("Error verifying QR code:", error)
      setScanResult({
        success: false,
        message: "Erreur lors de la vérification du QR code.",
      })
    } finally {
      setLoading(false)
    }
  }

  const onScanFailure = (error: any) => {
    // Ignore common initialization errors
    if (
      error &&
      typeof error === "string" &&
      (error.includes("IndexSizeError") || error.includes("NotFoundError") || error.includes("No QR code found"))
    ) {
      return
    }
    // Only log unexpected errors
    console.log("QR code scanning failure:", error)
  }

  const resetScanner = () => {
    setScanResult(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-2 border-blue-200 shadow-md">
        <CardContent className="p-0">
          <div id={scannerContainerId} className="qr-reader-container min-h-[300px] relative">
            {!scanning && !scanResult && !loading && (
              <div className="flex flex-col items-center justify-center h-[300px] bg-blue-50">
                <Camera className="h-12 w-12 text-blue-500 mb-4" />
                <p className="text-center px-4">
                  Cliquez sur le bouton ci-dessous pour activer la caméra et scanner un QR code
                </p>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <Alert variant="destructive" className="max-w-[90%]">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p>Vérification du QR code...</p>
        </div>
      )}

      {scanResult && (
        <Card className="overflow-hidden border-2 shadow-lg border-blue-200">
          <CardContent className="p-6">
            {scanResult.success ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <h3 className="font-medium">Personne enregistrée</h3>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Nom complet</p>
                    <p className="font-medium">
                      {scanResult.person?.firstName} {scanResult.person?.lastName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium break-all">{scanResult.person?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{scanResult.person?.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date d'enregistrement</p>
                    <p className="font-medium">
                      {scanResult.person?.createdAt
                        ? format(new Date(scanResult.person.createdAt), "PPP", { locale: fr })
                        : "Non spécifiée"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{scanResult.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        {!scanning && !scanResult ? (
          <Button
            onClick={startScanner}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
          >
            <Camera size={16} />
            Activer la caméra
          </Button>
        ) : scanning ? (
          <Button onClick={stopScanner} variant="outline" className="flex items-center gap-2 border-blue-300">
            <CameraOff size={16} />
            Arrêter la caméra
          </Button>
        ) : (
          <Button
            onClick={resetScanner}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
          >
            <Camera size={16} />
            Scanner un autre QR code
          </Button>
        )}
      </div>
    </div>
  )
}

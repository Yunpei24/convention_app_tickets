import { QRScanner } from "@/components/qr-scanner"

export default function ScannerPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-blue-800">Scanner QR Code</h1>
          <p className="text-muted-foreground">
            Utilisez la caméra pour scanner un QR code et vérifier l&apos;enregistrement
          </p>
        </div>
        <QRScanner />
      </div>
    </div>
  )
}

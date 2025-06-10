import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Système d&apos;Enregistrement avec QR Code
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Enregistrez des personnes, générez des QR codes uniques et vérifiez les enregistrements en temps réel avec
          notre système intégré.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Card className="overflow-hidden border-2 hover:border-blue-500 transition-all hover:shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent pb-8">
            <CardTitle className="flex items-center gap-2 text-blue-700">
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
                className="lucide lucide-user-plus"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" x2="19" y1="8" y2="14" />
                <line x1="22" x2="16" y1="11" y2="11" />
              </svg>
              Enregistrement
            </CardTitle>
            <CardDescription>Enregistrez une nouvelle personne et générez un QR code unique</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground mb-6">
              Créez un nouvel enregistrement avec les informations personnelles et recevez un QR code unique pour
              l&apos;identification.
            </p>
            <Link href="/register" className="block">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900">
                Accéder au formulaire
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-2 hover:border-blue-500 transition-all hover:shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent pb-8">
            <CardTitle className="flex items-center gap-2 text-blue-700">
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
                className="lucide lucide-scan-face"
              >
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <path d="M9 9h.01" />
                <path d="M15 9h.01" />
              </svg>
              Scanner
            </CardTitle>
            <CardDescription>
              Scannez un QR code pour vérifier l&apos;enregistrement d&apos;une personne
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground mb-6">
              Utilisez la caméra de votre appareil pour scanner un QR code et vérifier instantanément les informations
              d&apos;enregistrement.
            </p>
            <Link href="/scanner" className="block">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900">
                Accéder au scanner
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-2 hover:border-blue-500 transition-all hover:shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent pb-8">
            <CardTitle className="flex items-center gap-2 text-blue-700">
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
                className="lucide lucide-users"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Liste des Personnes
            </CardTitle>
            <CardDescription>Consultez toutes les personnes enregistrées dans le système</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground mb-6">
              Visualisez la liste complète des personnes enregistrées, leurs QR codes et exportez les données.
            </p>
            <Link href="/persons" className="block">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900">
                Voir la liste
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

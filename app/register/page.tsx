import { RegistrationForm } from "@/components/registration-form"

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-blue-800">Enregistrement</h1>
          <p className="text-muted-foreground">
            Remplissez le formulaire ci-dessous pour enregistrer une nouvelle personne
          </p>
        </div>
        <RegistrationForm />
      </div>
    </div>
  )
}

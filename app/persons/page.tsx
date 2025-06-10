import { PersonsList } from "@/components/persons-list"

export default function PersonsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-blue-800">Liste des Personnes Enregistrées</h1>
          <p className="text-muted-foreground">Consultez toutes les personnes enregistrées dans le système</p>
        </div>
        <PersonsList />
      </div>
    </div>
  )
}

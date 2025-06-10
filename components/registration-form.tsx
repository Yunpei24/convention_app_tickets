"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { TicketPreview } from "./ticket-preview"

// Schéma sans date de naissance
const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  lastName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  phone: z.string().min(10, {
    message: "Veuillez entrer un numéro de téléphone valide.",
  }),
})

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registrationData, setRegistrationData] = useState<null | {
    person: any
    qrCode: string
  }>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  })

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   setIsSubmitting(true)
  //   setError(null)

  //   try {
  //     console.log("Sending data:", values)

  //     const response = await fetch("/api/register", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(values),
  //     })

  //     const data = await response.json()
  //     console.log("Response data:", data)

  //     if (!response.ok) {
  //       throw new Error(data.error || "Erreur lors de l'enregistrement")
  //     }

  //     setRegistrationData(data)
  //   } catch (error) {
  //     console.error("Erreur:", error)
  //     setError(error instanceof Error ? error.message : "Une erreur est survenue")
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)
  
    try {
      console.log("Sending data:", values)
  
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const response = await fetch(`${apiUrl}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
  
      const data = await response.json()
      console.log("Response data:", data)
  
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'enregistrement")
      }
  
      setRegistrationData(data)
    } catch (error) {
      console.error("Erreur:", error)
      setError(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (registrationData) {
    return <TicketPreview data={registrationData} />
  }

  return (
    <Card className="p-6 border-2 shadow-lg bg-gradient-to-b from-white to-blue-50">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <p className="font-medium">Erreur</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean" {...field} className="border-2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Dupont" {...field} className="border-2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="jean.dupont@exemple.fr" {...field} className="border-2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="0612345678" {...field} className="border-2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </form>
      </Form>
    </Card>
  )
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Intervenant } from "./columns";

interface EditIntervenantDialogProps {
  intervenant: Intervenant;
  children: React.ReactNode;
}

export function EditIntervenantDialog({
  intervenant,
  children,
}: EditIntervenantDialogProps) {
  const [open, setOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );
  const [firstName, setFirstName] = useState(intervenant.firstName);
  const [lastName, setLastName] = useState(intervenant.lastName);
  const [email, setEmail] = useState(intervenant.email);
  const [endDate, setEndDate] = useState<Date>(() => {
    if (!intervenant.endDate) {
      return new Date();
    }
    
    try {
      const date = new Date(intervenant.endDate);
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", intervenant.endDate);
        return new Date();
      }
      return date;
    } catch (error) {
      console.error("Error parsing date:", error);
      return new Date();
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    setPortalContainer(document.getElementById("portal-container"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/admin/intervenants/${intervenant.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            endDate: endDate.toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la modification");
      }

      toast({
        description: "Intervenant modifié avec succès",
      });
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Erreur lors de la modification" + error,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogPortal container={portalContainer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l&apos;intervenant</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate
                      ? format(endDate, "P", { locale: fr })
                      : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button type="submit" className="w-full">
              Enregistrer
            </Button>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import frLocale from "@fullcalendar/core/locales/fr";
import { useEffect, useState } from "react";
import { Availabilities, TimeSlot } from "@/types/availability";
import { getWeekNumber } from "@/lib/date";
import interactionPlugin from "@fullcalendar/interaction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getWeekStatuses } from "@/lib/workweek";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

function convertAvailabilityToEvents(
  availabilities: Availabilities,
  weekNumber?: number
) {
  const events: {
    title: string;
    start?: string;
    end?: string;
    startTime?: string;
    endTime?: string;
    daysOfWeek?: number[];
    backgroundColor: string;
    extendedProps: {
      isSpecific: boolean;
      days: string;
      startTime: string;
      endTime: string;
    };
  }[] = [];

  const weekKey = `S${weekNumber}`;
  const weekSpecificEvents = weekNumber && availabilities[weekKey];

  const translateDayToEnglish = (day: string) => {
    const translations: { [key: string]: string } = {
      lundi: "Monday",
      mardi: "Tuesday",
      mercredi: "Wednesday",
      jeudi: "Thursday",
      vendredi: "Friday",
    };
    return translations[day.toLowerCase().trim()];
  };

  // Ajouter les événements par défaut seulement s'il n'y a pas d'événements spécifiques pour la semaine
  if (!weekSpecificEvents && availabilities.default) {
    availabilities.default.forEach((slot: TimeSlot) => {
      const days = slot.days.split(/[,\s]+/).filter(Boolean);
      days.forEach((day: string) => {
        const englishDay = translateDayToEnglish(day.trim());
        if (englishDay) {
          const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            .indexOf(englishDay);
          
          events.push({
            title: "Disponible",
            startTime: slot.from,
            endTime: slot.to,
            daysOfWeek: [dayIndex],
            backgroundColor: "#10B981",
            extendedProps: {
              isSpecific: false,
              days: day.trim(),
              startTime: slot.from,
              endTime: slot.to
            }
          });
        }
      });
    });
  }

  // Ajouter les événements spécifiques de la semaine
  if (weekSpecificEvents) {
    weekSpecificEvents.forEach((slot: TimeSlot) => {
      const days = slot.days.split(/[,\s]+/).filter(Boolean);
      days.forEach((day: string) => {
        const englishDay = translateDayToEnglish(day.trim());
        if (englishDay) {
          const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            .indexOf(englishDay);
          
          events.push({
            title: "Disponible",
            startTime: slot.from,
            endTime: slot.to,
            daysOfWeek: [dayIndex],
            backgroundColor: "#10B981",
            extendedProps: {
              isSpecific: true,
              days: day.trim(),
              startTime: slot.from,
              endTime: slot.to
            }
          });
        }
      });
    });
  }

  return events;
}

export function AvailabilityClient({
  intervenantKey,
}: {
  intervenantKey: string;
}) {
  const [availabilities, setAvailabilities] = useState<Availabilities | null>(null);
  const [intervenant, setIntervenant] = useState<any>(null);
  const [currentWeek, setCurrentWeek] = useState(getWeekNumber(new Date()));
  const [monthViewDate, setMonthViewDate] = useState(new Date());
  const [weekViewDate, setWeekViewDate] = useState(new Date());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<any>(null);
  const [isSetDefaultDialogOpen, setIsSetDefaultDialogOpen] = useState(false);

  const updateData = async () => {
    try {
      const response = await fetch(`/api/availability/${intervenantKey}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }
      const data = await response.json();
      console.log("Données reçues:", data);
      setIntervenant(data);
      setAvailabilities(data.availabilities);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    updateData();
  }, [intervenantKey]);

  const handleSelect = async (selectInfo: any) => {
    const startTime = selectInfo.start.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = selectInfo.end.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dayName = selectInfo.start.toLocaleDateString("fr-FR", {
      weekday: "long",
    });

    try {
      const response = await fetch(`/api/availability/${intervenantKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weekNumber: currentWeek,
          timeSlot: {
            days: dayName,
            from: startTime,
            to: endTime,
          },
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      // Rafraîchir les données après la modification
      await updateData();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'enregistrement du créneau");
    }
  };

  const handleEventClick = async (clickInfo: any) => {
    const isDefaultEvent = !clickInfo.event.extendedProps.isSpecific;
    setEventToDelete({ ...clickInfo.event, isDefaultEvent });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    try {
      const endpoint = eventToDelete.isDefaultEvent ? 
        `/api/availability/${intervenantKey}/delete-default` : 
        `/api/availability/${intervenantKey}/delete`;

      const timeSlot = {
        days: eventToDelete._def.extendedProps.days,
        from: eventToDelete._def.extendedProps.startTime,
        to: eventToDelete._def.extendedProps.endTime,
      };

      console.log('TimeSlot to delete:', timeSlot);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weekNumber: currentWeek,
          timeSlot: timeSlot,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      await updateData();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const handleEventDrop = async (dropInfo: any) => {
    const event = dropInfo.event;
    const dayName = new Date(event.start).toLocaleDateString("fr-FR", { 
      weekday: "long" 
    });

    try {
      const response = await fetch(`/api/availability/${intervenantKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weekNumber: currentWeek,
          oldTimeSlot: {
            days: dayName,
            from: dropInfo.oldEvent.startStr.split('T')[1].slice(0, 5),
            to: dropInfo.oldEvent.endStr.split('T')[1].slice(0, 5),
          },
          newTimeSlot: {
            days: dayName,
            from: event.startStr.split('T')[1].slice(0, 5),
            to: event.endStr.split('T')[1].slice(0, 5),
          },
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la modification");

      await updateData();
    } catch (error) {
      console.error("Erreur:", error);
      dropInfo.revert();
    }
  };

  const handleEventResize = async (resizeInfo: any) => {
    const event = resizeInfo.event;
    const dayName = new Date(event.start).toLocaleDateString("fr-FR", { 
      weekday: "long" 
    });

    try {
      const response = await fetch(`/api/availability/${intervenantKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weekNumber: currentWeek,
          oldTimeSlot: {
            days: dayName,
            from: resizeInfo.oldEvent.startStr.split('T')[1].slice(0, 5),
            to: resizeInfo.oldEvent.endStr.split('T')[1].slice(0, 5),
          },
          newTimeSlot: {
            days: dayName,
            from: event.startStr.split('T')[1].slice(0, 5),
            to: event.endStr.split('T')[1].slice(0, 5),
          },
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la modification");

      await updateData();
    } catch (error) {
      console.error("Erreur:", error);
      resizeInfo.revert();
    }
  };

  const handleSetAsDefaultConfirm = async () => {
    try {
      const response = await fetch(`/api/availability/${intervenantKey}/set-default`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weekNumber: currentWeek,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la définition des disponibilités par défaut");

      const updatedData = await fetch(`/api/availability/${intervenantKey}`).then(r => r.json());
      setAvailabilities(updatedData.availabilities);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsSetDefaultDialogOpen(false);
    }
  };

  if (!availabilities || !intervenant) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">Chargement...</div>
      </div>
    );
  }

  const weekEvents = convertAvailabilityToEvents(availabilities, currentWeek);
  const monthEvents = convertAvailabilityToEvents(
    availabilities,
    getWeekNumber(monthViewDate)
  );

  const weekStatuses = intervenant?.workweek 
    ? getWeekStatuses(intervenant.workweek as any, availabilities)
    : [];

  const currentWeekStatus = weekStatuses.find(s => s.week === currentWeek);

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Disponibilités de {intervenant.firstName} {intervenant.lastName}
            </h1>
            {intervenant.lastModifiedDate && (
              <p className="text-sm text-muted-foreground">
                Dernière modification le{" "}
                {new Date(intervenant.lastModifiedDate).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
          <div className="grid grid-cols-[400px_1fr] gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                locale={frLocale}
                headerToolbar={{
                  left: "prev,next",
                  center: "title",
                  right: "",
                }}
                height="auto"
                selectable={true}
                select={(info) => {
                  setWeekViewDate(info.start);
                  setCurrentWeek(getWeekNumber(info.start));
                }}
                events={monthEvents}
                displayEventTime={false}
                initialDate={monthViewDate}
                datesSet={(dateInfo) => {
                  setMonthViewDate(dateInfo.start);
                }}
                dayCellClassNames={(arg) => {
                  // Vérifie si le jour a des événements
                  const hasEvents = monthEvents.some((event) => {
                    const dayIndex = event.daysOfWeek?.[0];
                    return dayIndex === arg.date.getDay();
                  });
                  return hasEvents ? "bg-yellow-100" : "";
                }}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Button 
                  onClick={() => setIsSetDefaultDialogOpen(true)}
                  className="mb-4"
                >
                  Définir comme disponibilités par défaut
                </Button>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <FullCalendar
                  plugins={[timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  locale={frLocale}
                  slotMinTime="07:00:00"
                  slotMaxTime="20:00:00"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "",
                  }}
                  weekNumbers={true}
                  events={weekEvents}
                  allDaySlot={false}
                  height="auto"
                  selectable={true}
                  selectMirror={true}
                  selectMinDistance={1}
                  selectConstraint={{
                    startTime: "07:00:00",
                    endTime: "20:00:00",
                  }}
                  select={handleSelect}
                  datesSet={(dateInfo) => {
                    setWeekViewDate(dateInfo.start);
                    setCurrentWeek(getWeekNumber(dateInfo.start));
                  }}
                  initialDate={weekViewDate}
                  eventContent={(eventInfo) => ({
                    html: `
                      <div class="flex items-center justify-between p-1">
                        <span>${eventInfo.timeText}</span>
                        <button class="delete-event text-gray-500 hover:text-red-500 p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    `,
                  })}
                  eventClick={handleEventClick}
                  editable={true}
                  eventDrop={handleEventDrop}
                  eventResize={handleEventResize}
                />
              </div>
            </div>
          </div>

          {/* Alertes pour la semaine courante */}
          {currentWeekStatus && (
            <div className="space-y-4">
              {currentWeekStatus.status === 'missing' && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Disponibilités manquantes</AlertTitle>
                  <AlertDescription>
                    Vous devez saisir {currentWeekStatus.hours}h de disponibilités pour la semaine {currentWeekStatus.week}
                  </AlertDescription>
                </Alert>
              )}
              {currentWeekStatus.status === 'insufficient' && (
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Disponibilités insuffisantes</AlertTitle>
                  <AlertDescription>
                    Il vous manque encore {currentWeekStatus.remainingHours}h de disponibilités à saisir pour la semaine {currentWeekStatus.week}
                  </AlertDescription>
                </Alert>
              )}
              {currentWeekStatus.status === 'ok' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Disponibilités suffisantes</AlertTitle>
                  <AlertDescription>
                    Vous avez saisi toutes vos heures pour la semaine {currentWeekStatus.week} ({currentWeekStatus.hours}h)
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Liste des semaines avec statut */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">État des disponibilités</h2>
            <div className="space-y-2">
              {weekStatuses.map(status => (
                <div key={status.week} className="flex items-center justify-between">
                  <span>Semaine {status.week}</span>
                  <div className="flex items-center gap-4">
                    <span>
                      {status.availableHours}h / {status.hours}h
                      {status.remainingHours > 0 && (
                        <span className="text-red-500 ml-2">
                          (encore {status.remainingHours}h à ajouter)
                        </span>
                      )}
                    </span>
                    {status.status === 'ok' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {status.status === 'insufficient' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    {status.status === 'missing' && <XCircle className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce créneau de disponibilité ?
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isSetDefaultDialogOpen} onOpenChange={setIsSetDefaultDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la modification</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous définir les disponibilités de cette semaine comme disponibilités par défaut ?
              Cela remplacera les disponibilités par défaut existantes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleSetAsDefaultConfirm}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

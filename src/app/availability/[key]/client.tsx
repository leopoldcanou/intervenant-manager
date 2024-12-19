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

  // Ajouter d'abord les événements par défaut
  if (availabilities.default) {
    availabilities.default.forEach((slot: TimeSlot) => {
      const days = slot.days.split(/[,\s]+/).filter(Boolean);
      days.forEach((day: string) => {
        const englishDay = translateDayToEnglish(day.trim());
        if (englishDay) {
          const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            .indexOf(englishDay);
          
          // N'ajouter l'événement par défaut que s'il n'y a pas d'événement spécifique pour ce jour
          if (!weekSpecificEvents || !weekSpecificEvents.some(specificSlot => 
            specificSlot.days.toLowerCase().includes(day.toLowerCase())
          )) {
            events.push({
              title: "Disponible",
              startTime: slot.from,
              endTime: slot.to,
              daysOfWeek: [dayIndex],
              backgroundColor: "#10B981",
            });
          }
        }
      });
    });
  }

  // Ajouter ensuite les événements spécifiques de la semaine
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
  const [availabilities, setAvailabilities] = useState<Availabilities | null>(
    null
  );
  const [currentWeek, setCurrentWeek] = useState(getWeekNumber(new Date()));
  const [monthViewDate, setMonthViewDate] = useState(new Date());
  const [weekViewDate, setWeekViewDate] = useState(new Date());

  useEffect(() => {
    async function fetchAvailabilities() {
      try {
        const response = await fetch(`/api/availability/${intervenantKey}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des disponibilités");
        }
        const data = await response.json();
        setAvailabilities(data.availabilities);
      } catch (error) {
        console.error("Erreur:", error);
      }
    }

    fetchAvailabilities();
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

      // Rafraîchir les disponibilités
      const updatedData = await fetch(
        `/api/availability/${intervenantKey}`
      ).then((r) => r.json());
      setAvailabilities(updatedData.availabilities);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'enregistrement du créneau");
    }
  };

  if (!availabilities) {
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

  return (
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
        />
      </div>
    </div>
  );
}

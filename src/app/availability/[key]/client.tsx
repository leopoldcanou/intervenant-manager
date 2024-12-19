"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import frLocale from "@fullcalendar/core/locales/fr";
import { useEffect, useState } from "react";
import { Availabilities, TimeSlot } from "@/types/availability";
import { getWeekNumber } from "@/lib/date";

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

  // Utiliser les disponibilités spécifiques de la semaine si elles existent
  const weekAvailabilities =
    weekNumber && availabilities[weekKey]
      ? availabilities[weekKey]
      : availabilities.default;

  if (!weekAvailabilities) {
    return events;
  }

  weekAvailabilities.forEach((slot: TimeSlot) => {
    const days = slot.days.split(/[,\s]+/).filter(Boolean); // Gère les espaces et les virgules
    days.forEach((day: string) => {
      const englishDay = translateDayToEnglish(day.trim());
      if (englishDay) {
        const dayIndex = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].indexOf(englishDay);

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
          plugins={[timeGridPlugin]}
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

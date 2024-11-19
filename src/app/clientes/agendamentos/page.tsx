'use client';

import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useCallback, useMemo, useState } from 'react';

// Set moment to Portuguese
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const messages = {
  allDay: 'Dia inteiro',
  previous: 'Anterior',
  next: 'Próximo',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  work_week: 'Semana de trabalho',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Não há eventos neste período.',
  showMore: (total: number) => `+ (${total}) eventos`,
};

// Expanded data for more realistic appointments
const generateRandomAppointments = () => {
  const firstNames = [
    'João',
    'Maria',
    'Pedro',
    'Ana',
    'Carlos',
    'Beatriz',
    'Lucas',
    'Julia',
    'Gabriel',
    'Laura',
    'Rafael',
    'Isabella',
    'Thiago',
    'Sofia',
    'Fernando',
    'Valentina',
    'Miguel',
    'Helena',
    'Arthur',
    'Alice',
  ];

  const lastNames = [
    'Silva',
    'Santos',
    'Oliveira',
    'Souza',
    'Rodrigues',
    'Ferreira',
    'Almeida',
    'Pereira',
    'Lima',
    'Gomes',
    'Costa',
    'Ribeiro',
    'Carvalho',
    'Martins',
    'Araújo',
    'Fernandes',
    'Vieira',
    'Barbosa',
    'Rocha',
    'Cardoso',
  ];

  const procedures = [
    { name: 'Limpeza', duration: 60 },
    { name: 'Extração', duration: 45 },
    { name: 'Canal', duration: 90 },
    { name: 'Restauração', duration: 60 },
    { name: 'Clareamento', duration: 120 },
    { name: 'Avaliação', duration: 30 },
    { name: 'Consulta de Retorno', duration: 30 },
    { name: 'Prótese', duration: 90 },
    { name: 'Implante', duration: 120 },
    { name: 'Aparelho Ortodôntico', duration: 60 },
  ];

  const appointments = [];
  const startDate = moment().subtract(3, 'months');
  const endDate = moment().add(2, 'months');
  const totalDays = endDate.diff(startDate, 'days');

  // Generate appointments for each day
  for (let day = 0; day < totalDays; day++) {
    const currentDate = moment(startDate).add(day, 'days');

    // Skip weekends
    if (currentDate.day() === 0 || currentDate.day() === 6) continue;

    // Generate 4-8 appointments per day
    const appointmentsPerDay = Math.floor(Math.random() * 5) + 4;

    // Track used time slots to avoid overlaps
    const usedSlots = new Set();

    for (let i = 0; i < appointmentsPerDay; i++) {
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const procedure =
        procedures[Math.floor(Math.random() * procedures.length)];

      // Generate appointment time between 8:00 and 18:00
      let startHour, startMinute;
      let attempts = 0;
      do {
        startHour = Math.floor(Math.random() * 9) + 8; // 8:00 - 17:00
        startMinute = [0, 30][Math.floor(Math.random() * 2)]; // 0 or 30
        attempts++;
        if (attempts > 20) break; // Prevent infinite loop
      } while (usedSlots.has(`${startHour}:${startMinute}`));

      if (attempts > 20) continue;

      usedSlots.add(`${startHour}:${startMinute}`);

      const start = moment(currentDate)
        .hour(startHour)
        .minute(startMinute)
        .second(0)
        .toDate();

      const end = moment(start).add(procedure.duration, 'minutes').toDate();

      // Random status for visual variety
      const status = Math.random() > 0.1 ? 'confirmed' : 'pending';

      appointments.push({
        title: `${procedure.name} - ${firstName} ${lastName}`,
        start,
        end,
        resource: {
          patient: `${firstName} ${lastName}`,
          procedure: procedure.name,
          status,
          duration: procedure.duration,
        },
      });
    }
  }

  return appointments.sort((a, b) => a.start.getTime() - b.start.getTime());
};

export default function Agendamentos() {
  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());

  // Generate events once and memoize them
  const events = useMemo(() => generateRandomAppointments(), []);

  // Custom event styling
  const eventStyleGetter = useCallback((event: any) => {
    const style: React.CSSProperties = {
      backgroundColor:
        event.resource?.status === 'confirmed' ? '#10b981' : '#f59e0b',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      display: 'block',
      overflow: 'hidden',
    };

    return {
      style,
    };
  }, []);

  // Custom slot styling
  const slotStyleGetter = useCallback(() => {
    return {
      style: {
        borderLeft: '1px solid #e5e7eb',
        backgroundColor: 'white',
      },
    };
  }, []);

  // Custom toolbar styles
  const components = {
    toolbar: (toolbarProps: any) => (
      <div className="rbc-toolbar mb-4">
        <span className="rbc-btn-group">
          <button type="button" onClick={() => toolbarProps.onNavigate('PREV')}>
            Anterior
          </button>
          <button
            type="button"
            onClick={() => toolbarProps.onNavigate('TODAY')}
          >
            Hoje
          </button>
          <button type="button" onClick={() => toolbarProps.onNavigate('NEXT')}>
            Próximo
          </button>
        </span>
        <span className="rbc-toolbar-label">{toolbarProps.label}</span>
        <span className="rbc-btn-group">
          <button
            type="button"
            className={view === 'week' ? 'rbc-active' : ''}
            onClick={() => toolbarProps.onView('week')}
          >
            Semana
          </button>
          <button
            type="button"
            className={view === 'day' ? 'rbc-active' : ''}
            onClick={() => toolbarProps.onView('day')}
          >
            Dia
          </button>
        </span>
      </div>
    ),
  };

  return (
    <div className="h-screen p-4">
      <Calendar
        localizer={localizer}
        events={events}
        messages={messages}
        view={view}
        date={date}
        onNavigate={(date) => setDate(date)}
        onView={(newView: View) => setView(newView)}
        views={['week', 'day']}
        step={30}
        timeslots={2}
        min={moment().hours(7).minutes(0).toDate()} // Start at 7:00 AM
        max={moment().hours(20).minutes(0).toDate()} // End at 8:00 PM
        eventPropGetter={eventStyleGetter}
        slotPropGetter={slotStyleGetter}
        components={components}
        className="bg-white shadow-lg rounded-lg"
        tooltipAccessor={(event) => {
          const { patient, procedure, duration } = event.resource;
          return `Paciente: ${patient}\nProcedimento: ${procedure}\nDuração: ${duration} minutos`;
        }}
      />
    </div>
  );
}

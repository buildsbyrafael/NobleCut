const availabilityRepository = require("./availability.repository");

const OPENING_MINUTES = 9 * 60;
const CLOSING_MINUTES = 21 * 60;
const SLOT_MINUTES = 30;
const BUSINESS_TIMEZONE = "America/Fortaleza";
const BUSINESS_OFFSET = "-03:00";

function pad(value) {
  return String(value).padStart(2, "0");
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${pad(hours)}:${pad(minutes)}`;
}

function buildDateTime(date, totalMinutes) {
  const time = minutesToTime(totalMinutes);

  return new Date(`${date}T${time}:00${BUSINESS_OFFSET}`);
}

function getLocalParts(date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  });

  const parts = formatter.formatToParts(date);

  const values = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  }

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute)
  };
}

function getLocalDateString(date) {
  const parts = getLocalParts(date);

  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

function getLocalMinutes(date) {
  const parts = getLocalParts(date);

  return parts.hour * 60 + parts.minute;
}

function isSunday(date) {
  const reference = new Date(`${date}T12:00:00${BUSINESS_OFFSET}`);

  return reference.getUTCDay() === 0;
}

function isValidStartMinute(startMinutes) {
  return (
    startMinutes >= OPENING_MINUTES &&
    startMinutes < CLOSING_MINUTES &&
    startMinutes % SLOT_MINUTES === 0
  );
}

function serviceFitsBusinessHours(startMinutes, durationMinutes) {
  return startMinutes + durationMinutes <= CLOSING_MINUTES;
}

function periodsOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function hasClientConflict(appointments, clientId, startAt, endAt) {
  const start = startAt.getTime();
  const end = endAt.getTime();

  return appointments.some((appointment) => {
    if (appointment.clienteId !== clientId) {
      return false;
    }

    return periodsOverlap(
      start,
      end,
      new Date(appointment.dataHoraInicio).getTime(),
      new Date(appointment.dataHoraFim).getTime()
    );
  });
}

function hasBarberConflict(appointments, barbeiroId, startAt, endAt) {
  const start = startAt.getTime();
  const end = endAt.getTime();

  return appointments.some((appointment) => {
    if (appointment.barbeiroId !== barbeiroId) {
      return false;
    }

    return periodsOverlap(
      start,
      end,
      new Date(appointment.dataHoraInicio).getTime(),
      new Date(appointment.dataHoraFim).getTime()
    );
  });
}

function serializeService(service) {
  return {
    id: service.id,
    nome: service.nome,
    descricao: service.descricao,
    duracaoMinutos: service.duracaoMinutos,
    preco: Number(service.preco)
  };
}

function createServicesMap(services) {
  return new Map(services.map((service) => [service.id, service]));
}

function createAssociationsMap(associations) {
  const map = new Map();

  for (const association of associations) {
    if (!map.has(association.barbeiroId)) {
      map.set(association.barbeiroId, []);
    }

    map.get(association.barbeiroId).push(association.servicoId);
  }

  return map;
}

function canScheduleCombination({
  clientId,
  barbeiroId,
  service,
  startAt,
  appointments
}) {
  const startMinutes = getLocalMinutes(startAt);

  if (!isValidStartMinute(startMinutes)) {
    return false;
  }

  if (!serviceFitsBusinessHours(startMinutes, service.duracaoMinutos)) {
    return false;
  }

  const endAt = new Date(
    startAt.getTime() + service.duracaoMinutos * 60 * 1000
  );

  if (hasClientConflict(appointments, clientId, startAt, endAt)) {
    return false;
  }

  if (hasBarberConflict(appointments, barbeiroId, startAt, endAt)) {
    return false;
  }

  return true;
}

async function getSlots(clientId, date) {
  const slots = [];

  for (
    let minutes = OPENING_MINUTES;
    minutes < CLOSING_MINUTES;
    minutes += SLOT_MINUTES
  ) {
    slots.push({
      time: minutesToTime(minutes),
      available: false
    });
  }

  if (isSunday(date)) {
    return slots;
  }

  const dayStart = buildDateTime(date, OPENING_MINUTES);
  const dayEnd = buildDateTime(date, CLOSING_MINUTES);

  const [
    barbers,
    associations,
    appointments
  ] = await Promise.all([
    availabilityRepository.findAllBarbers(),
    availabilityRepository.findAllBarberServices(),
    availabilityRepository.findScheduledAppointmentsBetween(
      dayStart,
      dayEnd
    )
  ]);

  if (barbers.length === 0 || associations.length === 0) {
    return slots;
  }

  const serviceIds = [
    ...new Set(associations.map((association) => association.servicoId))
  ];

  const services = await availabilityRepository.findServicesByIds(serviceIds);

  if (services.length === 0) {
    return slots;
  }

  const servicesMap = createServicesMap(services);
  const associationsMap = createAssociationsMap(associations);

  for (const slot of slots) {
    const [hour, minute] = slot.time.split(":").map(Number);
    const startMinutes = hour * 60 + minute;
    const startAt = buildDateTime(date, startMinutes);

    let available = false;

    for (const barber of barbers) {
      const barberServiceIds = associationsMap.get(barber.id) || [];

      for (const serviceId of barberServiceIds) {
        const service = servicesMap.get(serviceId);

        if (!service) {
          continue;
        }

        const valid = canScheduleCombination({
          clientId,
          barbeiroId: barber.id,
          service,
          startAt,
          appointments
        });

        if (valid) {
          available = true;
          break;
        }
      }

      if (available) {
        break;
      }
    }

    slot.available = available;
  }

  return slots;
}

async function getAvailableBarbers(clientId, startAtValue) {
  const startAt = new Date(startAtValue);

  const date = getLocalDateString(startAt);
  const startMinutes = getLocalMinutes(startAt);

  if (isSunday(date) || !isValidStartMinute(startMinutes)) {
    return [];
  }

  const dayStart = buildDateTime(date, OPENING_MINUTES);
  const dayEnd = buildDateTime(date, CLOSING_MINUTES);

  const [
    barbers,
    associations,
    appointments
  ] = await Promise.all([
    availabilityRepository.findAllBarbers(),
    availabilityRepository.findAllBarberServices(),
    availabilityRepository.findScheduledAppointmentsBetween(
      dayStart,
      dayEnd
    )
  ]);

  if (barbers.length === 0 || associations.length === 0) {
    return [];
  }

  const serviceIds = [
    ...new Set(associations.map((association) => association.servicoId))
  ];

  const services = await availabilityRepository.findServicesByIds(serviceIds);

  if (services.length === 0) {
    return [];
  }

  const servicesMap = createServicesMap(services);
  const associationsMap = createAssociationsMap(associations);

  const availableBarbers = [];

  for (const barber of barbers) {
    const barberServiceIds = associationsMap.get(barber.id) || [];

    const hasAvailableService = barberServiceIds.some((serviceId) => {
      const service = servicesMap.get(serviceId);

      if (!service) {
        return false;
      }

      return canScheduleCombination({
        clientId,
        barbeiroId: barber.id,
        service,
        startAt,
        appointments
      });
    });

    if (hasAvailableService) {
      availableBarbers.push(barber);
    }
  }

  if (availableBarbers.length === 0) {
    return [];
  }

  const userIds = [
    ...new Set(availableBarbers.map((barber) => barber.usuarioId))
  ];

  const users = await availabilityRepository.findUsersByIds(userIds);

  const usersMap = new Map(users.map((user) => [user.id, user]));

  return availableBarbers
    .map((barber) => {
      const user = usersMap.get(barber.usuarioId);

      if (!user) {
        return null;
      }

      return {
        id: barber.id,
        nome: user.nome,
        descricao: barber.descricao,
        fotoUrl: barber.fotoUrl
      };
    })
    .filter(Boolean);
}

async function getAvailableServices(clientId, barberId, startAtValue) {
  const barber = await availabilityRepository.findBarberById(barberId);

  if (!barber) {
    return null;
  }

  const startAt = new Date(startAtValue);

  const date = getLocalDateString(startAt);
  const startMinutes = getLocalMinutes(startAt);

  if (isSunday(date) || !isValidStartMinute(startMinutes)) {
    return [];
  }

  const associations =
    await availabilityRepository.findBarberServicesByBarberId(barberId);

  if (associations.length === 0) {
    return [];
  }

  const serviceIds = associations.map(
    (association) => association.servicoId
  );

  const services = await availabilityRepository.findServicesByIds(serviceIds);

  if (services.length === 0) {
    return [];
  }

  const dayStart = buildDateTime(date, OPENING_MINUTES);
  const dayEnd = buildDateTime(date, CLOSING_MINUTES);

  const appointments =
    await availabilityRepository.findScheduledAppointmentsBetween(
      dayStart,
      dayEnd
    );

  return services
    .filter((service) =>
      canScheduleCombination({
        clientId,
        barbeiroId: barberId,
        service,
        startAt,
        appointments
      })
    )
    .map(serializeService);
}

module.exports = {
  getSlots,
  getAvailableBarbers,
  getAvailableServices
};
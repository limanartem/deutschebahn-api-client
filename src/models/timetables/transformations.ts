import { planResponse, planDto } from '.';

export const convertPlanResponseToDto = (
  response: planResponse.PlanResponseInternal,
): planDto.PlanResponse => ({
  timetable: {
    stationName: response.timetable.station,
    stops: response.timetable.s?.map((stop) => ({
      id: stop.id,
      arrivalEvent: convertStopEvent(stop.ar),
      departureEvent: convertStopEvent(stop.dp),
      tripLabel: convertTripLabel(stop.tl),
    })),
  },
});

const convertStopEvent = (event: planResponse.StopEvent): planDto.StopEvent | undefined =>
  event
    ? {
        changedDistantEndpoint: event.cde,
        cancellationTime: event.clt,
        changedPlatform: event.cp,
        changedPath: event.cpth,
        status: event.cs,
        changedTime: event.ct,
        distantChange: event.dc,
        hidden: event.hi,
        line: event.l,
        messages: event.m,
        plannedDistantEndpoint: event.pde,
        plannedPlatform: event.pp,
        plannedPath: event.ppth,
        plannedStatus: event.ps,
        plannedTime: event.pt,
        transition: event.tra,
        wings: event.wings,
      }
    : undefined;

const convertTripLabel = (label: planResponse.TripLabel): planDto.TripLabel | undefined =>
  label
    ? {
        category: label.c,
        flags: label.f,
        number: label.n,
        owner: label.o,
        type: label.t,
      }
    : undefined;

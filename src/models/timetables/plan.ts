/**
 * Represents a timetable, consisting of a set of TimetableStops and a potential Disruption.
 */
export interface Timetable {
  /** EVA station number. */
  eva: number;
  /** List of messages associated with the timetable. */
  m: Message[];
  /** List of TimetableStop objects. */
  s: TimetableStop[];
  /** Station name. */
  station: string;
}

/**
 * Represents a message associated with an event, a stop, or a trip.
 */
interface Message {
  /** Code. */
  c: number;
  /** Category. */
  cat: string;
  /** Deleted. */
  del: number;
  /** List of distributor messages. */
  dm: DistributorMessage[];
  /** External category. */
  ec: string;
  /** External link associated with the message. */
  elnk: string;
  /** External text. */
  ext: string;
  /** Valid from timestamp. */
  from: string;
  /** Message ID. */
  id: string;
  /** Internal text. */
  int: string;
  /** Owner. */
  o: string;
  /** Priority. */
  pr: string;
  /** Message status. */
  t: string;
  /** Trip label. */
  tl: TripLabel[];
  /** Valid to timestamp. */
  to: string;
  /** Timestamp. */
  ts: string;
}

/**
 * Represents an additional message to a given station-based disruption by a specific distributor.
 */
interface DistributorMessage {
  /** Internal text. */
  int: string;
  /** Distributor name. */
  n: string;
  /** Distributor type. */
  t: 's' | 'r' | 'f' | 'x';
  /** Timestamp. */
  ts: string;
}

/**
 * Represents a compound data type that contains common data items that characterize a TripLabel.
 */
interface TripLabel {
  /** Trip category. */
  c: string;
  /** Filter flags. */
  f: string;
  /** Trip/train number. */
  n: string;
  /** Owner. */
  o: string;
  /** Trip type. */
  t: 'p' | 'e' | 'z' | 's' | 'h' | 'n';
}

/**
 * Represents a stop in a timetable.
 */
interface TimetableStop {
  /** Arrival event. */
  ar: StopEvent;
  /** List of connection elements. */
  conn: ConnectionElement[];
  /** Departure event. */
  dp: StopEvent;
  /** EVA station code of the stop. */
  eva: number;
  /** Historic delay element. */
  hd: HistoricDelayElement[];
  /** Historic platform change element. */
  hpc: HistoricPlatformChangeElement[];
  /** Unique identifier of the stop. */
  id: string;
  /** List of messages associated with the stop. */
  m: Message[];
  /** Reference to another trip. */
  ref: ReferenceTripRelationElement;
  /** Reference trip relation. */
  rtr: ReferenceTripRelationElement[];
  /** Trip label. */
  tl: TripLabel;
}

/**
 * Represents an event (arrival or departure) that is part of a stop.
 */
interface StopEvent {
  /** Changed distant endpoint. */
  cde: string;
  /** Cancellation time. */
  clt: string;
  /** Changed platform. */
  cp: string;
  /** Changed path. */
  cpth: string;
  /** Event status. */
  cs: 'p' | 'a' | 'c';
  /** Changed time. */
  ct: string;
  /** Distant change. */
  dc: number;
  /** Hidden flag. */
  hi: number;
  /** Line indicator. */
  l: string;
  /** List of messages associated with the event. */
  m: Message[];
  /** Planned distant endpoint. */
  pde: string;
  /** Planned platform. */
  pp: string;
  /** Planned path. */
  ppth: string;
  /** Planned status. */
  ps: 'p' | 'a' | 'c';
  /** Planned time. */
  pt: string;
  /** Transition. */
  tra: string;
  /** Wing. */
  wings: string;
}

/**
 * Represents information about a connected train at a particular stop.
 */
interface ConnectionElement {
  /** Connection status. */
  cs: 'w' | 'n' | 'a';
  /** EVA station number. */
  eva: number;
  /** Connection ID. */
  id: string;
  /** Reference to the stop. */
  ref: TimetableStop;
  /** Stop. */
  s: TimetableStop;
  /** Timestamp. */
  ts: string;
}

/**
 * Represents the history of all delay-messages for a stop.
 */
interface HistoricDelayElement {
  /** Arrival event. */
  ar: string;
  /** Detailed description of delay cause. */
  cod: string;
  /** Departure event. */
  dp: string;
  /** Delay source. */
  src: 'L' | 'NA' | 'NM' | 'V' | 'IA' | 'IM' | 'A';
  /** Timestamp. */
  ts: string;
}

/**
 * Represents the history of all platform changes for a stop.
 */
interface HistoricPlatformChangeElement {
  /** Arrival platform. */
  ar: string;
  /** Detailed cause of track change. */
  cot: string;
  /** Departure platform. */
  dp: string;
  /** Timestamp. */
  ts: string;
}

/**
 * Represents how a reference trip is related to a stop.
 */
interface ReferenceTripRelationElement {
  /** Reference trip. */
  rt: ReferenceTrip;
  /** Relation to the stop. */
  rts: 'b' | 'e' | 'c' | 's' | 'a';
}

/**
 * Represents a reference trip, which refers only to its referenced regular trip.
 */
interface ReferenceTrip {
  /** Cancellation flag. */
  c: boolean;
  /** Correspondent stop of the regular trip. */
  ea: TripStop;
  /** Unique identifier of the reference trip. */
  id: string;
  /** Characteristics of the reference trip. */
  rtl: TripLabel;
  /** Stop data of the regular trip. */
  sd: TripStop;
}

/**
 * Represents a stop of a regular or reference trip.
 */
interface TripStop {
  /** EVA number of the stop. */
  eva: number;
  /** Index of the stop. */
  i: number;
  /** Name of the stop. */
  n: string;
  /** Planned time of the stop. */
  pt: string;
}

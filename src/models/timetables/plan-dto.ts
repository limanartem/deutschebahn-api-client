export interface PlanResponse {
  timetable?: Timetable;
}

/**
 * Represents a timetable, consisting of a set of TimetableStops and a potential Disruption.
 */
export interface Timetable {
  /** EVA station number. */
  stationNumber?: number;
  /** List of messages associated with the timetable. */
  messages?: Message[];
  /** List of TimetableStop objects. */
  stops?: TimetableStop[];
  /** Station name. */
  stationName?: string;
}

/**
 * Represents a message associated with an event, a stop, or a trip.
 */
export interface Message {
  /** Code. */
  code?: number;
  /** Category. */
  category?: string;
  /** Deleted. */
  deleted?: number;
  /** List of distributor messages. */
  distributorMessages?: DistributorMessage[];
  /** External category. */
  externalCategory?: string;
  /** External link associated with the message. */
  externalLink?: string;
  /** External text. */
  externalText?: string;
  /** Valid from timestamp. */
  validFrom?: string;
  /** Message ID. */
  id?: string;
  /** Internal text. */
  internalText?: string;
  /** Owner. */
  owner?: string;
  /** Priority. */
  priority?: string;
  /** Message status. */
  status?: string;
  /** Trip label. */
  tripLabel?: TripLabel[];
  /** Valid to timestamp. */
  validTo?: string;
  /** Timestamp. */
  timestamp?: string;
}

/**
 * Represents an additional message to a given station-based disruption by a specific distributor.
 */
export interface DistributorMessage {
  /** Internal text. */
  internalText?: string;
  /** Distributor name. */
  name?: string;
  /** Distributor type. */
  type?: 's' | 'r' | 'f' | 'x';
  /** Timestamp. */
  timestamp?: string;
}

/**
 * Represents a compound data type that contains common data items that characterize a TripLabel.
 */
export interface TripLabel {
  /** Trip category. */
  category?: string;
  /** Filter flags. */
  flags?: string;
  /** Trip/train number. */
  number?: string;
  /** Owner. */
  owner?: string;
  /** Trip type. */
  type?: 'p' | 'e' | 'z' | 's' | 'h' | 'n';
}

/**
 * Represents a stop in a timetable.
 */
export interface TimetableStop {
  /** Arrival event. */
  arrivalEvent?: StopEvent;
  /** List of connection elements. */
  connections?: ConnectionElement[];
  /** Departure event. */
  departureEvent?: StopEvent;
  /** EVA station code of the stop. */
  evaStationCode?: number;
  /** Historic delay element. */
  historicDelays?: HistoricDelayElement[];
  /** Historic platform change element. */
  historicPlatformChanges?: HistoricPlatformChangeElement[];
  /** Unique identifier of the stop. */
  id?: string;
  /** List of messages associated with the stop. */
  messages?: Message[];
  /** Reference to another trip. */
  referenceTripRelation?: ReferenceTripRelationElement;
  /** Reference trip relation. */
  referenceTripRelations?: ReferenceTripRelationElement[];
  /** Trip label. */
  tripLabel?: TripLabel;
}

/**
 * Represents an event (arrival or departure) that is part of a stop.
 */
export interface StopEvent {
  /** Changed distant endpoint. */
  changedDistantEndpoint?: string;
  /** Cancellation time. */
  cancellationTime?: string;
  /** Changed platform. */
  changedPlatform?: string;
  /** Changed path. */
  changedPath?: string;
  /** Event status. */
  status?: 'p' | 'a' | 'c';
  /** Changed time. */
  changedTime?: string;
  /** Distant change. */
  distantChange?: number;
  /** Hidden flag. */
  hidden?: number;
  /** Line indicator. */
  line?: string;
  /** List of messages associated with the event. */
  messages?: Message[];
  /** Planned distant endpoint. */
  plannedDistantEndpoint?: string;
  /** Planned platform. */
  plannedPlatform?: string;
  /** Planned path. */
  plannedPath?: string;
  /** Planned status. */
  plannedStatus?: 'p' | 'a' | 'c';
  /** Planned time. */
  plannedTime?: string;
  /** Transition. */
  transition?: string;
  /** Wing. */
  wings?: string;
}

/**
 * Represents information about a connected train at a particular stop.
 */
export interface ConnectionElement {
  /** Connection status. */
  status?: 'w' | 'n' | 'a';
  /** EVA station number. */
  evaStationNumber?: number;
  /** Connection ID. */
  id?: string;
  /** Reference to the stop. */
  referenceStop?: TimetableStop;
  /** Stop. */
  stop?: TimetableStop;
  /** Timestamp. */
  timestamp?: string;
}

/**
 * Represents the history of all delay-messages for a stop.
 */
export interface HistoricDelayElement {
  /** Arrival event. */
  arrivalEvent?: string;
  /** Detailed description of delay cause. */
  delayCauseDescription?: string;
  /** Departure event. */
  departureEvent?: string;
  /** Delay source. */
  delaySource?: 'L' | 'NA' | 'NM' | 'V' | 'IA' | 'IM' | 'A';
  /** Timestamp. */
  timestamp?: string;
}

/**
 * Represents the history of all platform changes for a stop.
 */
export interface HistoricPlatformChangeElement {
  /** Arrival platform. */
  arrivalPlatform?: string;
  /** Detailed cause of track change. */
  trackChangeCause?: string;
  /** Departure platform. */
  departurePlatform?: string;
  /** Timestamp. */
  timestamp?: string;
}

/**
 * Represents how a reference trip is related to a stop.
 */
export interface ReferenceTripRelationElement {
  /** Reference trip. */
  referenceTrip?: ReferenceTrip;
  /** Relation to the stop. */
  relation?: 'b' | 'e' | 'c' | 's' | 'a';
}

/**
 * Represents a reference trip, which refers only to its referenced regular trip.
 */
export interface ReferenceTrip {
  /** Cancellation flag. */
  cancellationFlag?: boolean;
  /** Correspondent stop of the regular trip. */
  correspondentStop?: TripStop;
  /** Unique identifier of the reference trip. */
  id?: string;
  /** Characteristics of the reference trip. */
  tripLabel?: TripLabel;
  /** Stop data of the regular trip. */
  stopData?: TripStop;
}

/**
 * Represents a stop of a regular or reference trip.
 */
export interface TripStop {
  /** EVA number of the stop. */
  evaNumber?: number;
  /** Index of the stop. */
  index?: number;
  /** Name of the stop. */
  name?: string;
  /** Planned time of the stop. */
  plannedTime?: string;
}

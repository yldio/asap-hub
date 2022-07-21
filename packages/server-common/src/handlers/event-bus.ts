export type SquidexEntityEvent =
  | 'Created'
  | 'Published'
  | 'Updated'
  | 'Unpublished'
  | 'Deleted';

export type LabEvent = `Labs${SquidexEntityEvent}`;
export type UserEvent = `Users${SquidexEntityEvent}`;

export type UserPayload = {
  type: UserEvent;
  payload: {
    $type: 'EnrichedContentEvent';
    type: SquidexEntityEvent;
    id: string;
    created: string;
    lastModified: string;
    version: number;
    data: { [x: string]: { iv: unknown } | null };
    dataOld?: { [x: string]: { iv: unknown } | null };
  };
};

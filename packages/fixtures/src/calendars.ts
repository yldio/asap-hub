import { ListCalendarResponse, CalendarResponse } from '@asap-hub/model';

const calendarResponses: CalendarResponse[] = [
  {
    id: '14@group.calendar.google.com',
    color: '#29527A',
    name: 'Tech 4c - iPSCs - iNeurons & iGlia',
  },
  {
    id: '2@group.calendar.google.com',
    color: '#528800',
    name: 'Tech 4b - iPSCs - Different Cell Types',
  },
  {
    id: '3@group.calendar.google.com',
    color: '#2952A3',
    name: 'Tech 4a - iPSCs - 3D & Co-cultures',
  },
  {
    id: '4@group.calendar.google.com',
    color: '#7A367A',
    name: 'Tech 3 - Structural Biology',
  },
  {
    id: '5@group.calendar.google.com',
    color: '#5A6986',
    name: 'Tech 2c - PD Modeling - Drosophila & NHP Models',
  },
  {
    id: '68g@group.calendar.google.com',
    color: '#5B123B',
    name: 'Tech 2b - PD Modeling - PD Genetic Rodent Models',
  },
  {
    id: '7@group.calendar.google.com',
    color: '#875509',
    name: 'Tech 2a: PD Modeling - SNCA Models',
  },
  {
    id: '8group.calendar.google.com',
    color: '#125A12',
    name: 'Tech 1 - Sequencing/omics',
  },
  {
    id: '9group.calendar.google.com',
    color: '#1B887A',
    name: 'Sci 7 - Inflammation & Immune Regulation',
  },
  {
    id: '10@group.calendar.google.com',
    color: '#856508',
    name: 'Sci 6 - Gut/brain, Microbiome & Clinical Biomarkers',
  },
  {
    id: '11@group.calendar.google.com',
    color: '#853104',
    name: 'Sci 5 - PINK1/Parkin & Other Genes/Pathways',
  },
  {
    id: '12@group.calendar.google.com',
    color: '#BE6D00',
    name: 'Sci 4 - LRRK2 & GBA',
  },
  {
    id: '13@group.calendar.google.com',
    color: '#691426',
    name: 'Sci 3 - SNCA',
  },
  {
    id: '14o@group.calendar.google.com',
    color: '#711616',
    name: 'Sci 2 - Aging & Progression',
  },
  {
    id: '15@group.calendar.google.com',
    color: '#5C1158',
    name: 'Sci 1 - GWAS Functional Validation',
  },
  {
    id: '16@asap.science',
    color: '#B1365F',
    name: 'ASAP Hub',
  },
];

export const createCalendarResponse = (itemIndex = 0): CalendarResponse => {
  if (itemIndex > calendarResponses.length) {
    throw new Error(`Exceeds fixture data limit ${calendarResponses.length}`);
  }
  return calendarResponses[itemIndex];
};

export const createListCalendarResponse = (
  items: number = calendarResponses.length,
): ListCalendarResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createCalendarResponse(itemIndex),
  ),
});

export default createListCalendarResponse;

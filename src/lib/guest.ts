export type GuestSpot = {
  city: string;
  country: string;
  window: string;
  status: "open" | "past";
  /** ISO-like sortable date YYYY-MM-DD pointing to start of window; null if unknown. */
  date: string | null;
};

// Status is "open" for the four current cities; "past" for everything else.
// Sorted from newest to oldest within the past list.
export const GUEST_SPOTS: GuestSpot[] = [
  // open / current
  { city: "Hamburg", country: "Germany", window: "Sep 14 — Sep 21", status: "open", date: null },
  { city: "Amsterdam", country: "Netherlands", window: "Oct 02 — Oct 09", status: "open", date: null },
  { city: "İzmir", country: "Türkiye", window: "Year-round residency", status: "open", date: null },
  { city: "Munich", country: "Germany", window: "Nov 18 — Nov 24", status: "open", date: null },

  // past — 2024
  { city: "Stockholm", country: "Sweden", window: "20 – 25 May 2024", status: "past", date: "2024-05-20" },
  { city: "Munich", country: "Germany", window: "16 – 18 May 2024", status: "past", date: "2024-05-16" },
  { city: "Amsterdam", country: "Netherlands", window: "07 – 11 May 2024", status: "past", date: "2024-05-07" },
  { city: "Hamburg", country: "Germany", window: "19 – 21 March 2024", status: "past", date: "2024-03-19" },
  { city: "Besançon", country: "France", window: "16 – 17 March 2024", status: "past", date: "2024-03-16" },
  { city: "Berlin", country: "Germany", window: "20 – 24 February 2024", status: "past", date: "2024-02-20" },
  { city: "Lille", country: "France", window: "16 – 18 February 2024", status: "past", date: "2024-02-16" },
  { city: "Paris", country: "France", window: "12 – 15 February 2024", status: "past", date: "2024-02-12" },
  { city: "Hong Kong", country: "Hong Kong", window: "26 – 30 January 2024", status: "past", date: "2024-01-26" },
  { city: "Singapore", country: "Singapore", window: "19 – 24 January 2024", status: "past", date: "2024-01-19" },
  { city: "Philippines", country: "Philippines", window: "12 – 17 January 2024", status: "past", date: "2024-01-12" },

  // past — 2023
  { city: "Brussels", country: "Belgium", window: "10 – 12 November 2023", status: "past", date: "2023-11-10" },
  { city: "Essen", country: "Germany", window: "13 – 15 November 2023", status: "past", date: "2023-11-13" },
  { city: "Zurich", country: "Switzerland", window: "10 – 20 October 2023", status: "past", date: "2023-10-10" },
  { city: "Köln", country: "Germany", window: "06 – 08 October 2023", status: "past", date: "2023-10-06" },
  { city: "Mechelen", country: "Belgium", window: "25 – 27 August 2023", status: "past", date: "2023-08-25" },
  { city: "Barcelona", country: "Spain", window: "19 – 23 June 2023", status: "past", date: "2023-06-19" },
  { city: "Epinal", country: "France", window: "16 – 18 June 2023", status: "past", date: "2023-06-16" },
  { city: "Dortmund", country: "Germany", window: "02 – 04 June 2023", status: "past", date: "2023-06-02" },
  { city: "Denmark", country: "Denmark", window: "18 – 21 May 2023", status: "past", date: "2023-05-18" },
  { city: "Cyprus", country: "Cyprus", window: "02 – 05 May 2023", status: "past", date: "2023-05-02" },
  { city: "Rouen", country: "France", window: "14 – 16 April 2023", status: "past", date: "2023-04-14" },

  // year unspecified
  { city: "Lugano", country: "Switzerland", window: "15 – 19 October", status: "past", date: null },
  { city: "Bali", country: "Indonesia", window: "23 – 30 September", status: "past", date: null },
  { city: "Lisbon", country: "Portugal", window: "12 – 16 May", status: "past", date: null },
  { city: "Berlin", country: "Germany", window: "15 – 19 April", status: "past", date: null },
  { city: "Vienna", country: "Austria", window: "10 – 13 February", status: "past", date: null },
];

export const OPEN_SPOTS = GUEST_SPOTS.filter((s) => s.status === "open");
export const PAST_SPOTS = GUEST_SPOTS.filter((s) => s.status === "past");

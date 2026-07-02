export type Country = { code: string; dial: string; name: string; flag: string };

// Common destinations + Europe-heavy list. Order is rough popularity for this studio's audience.
export const COUNTRIES: Country[] = [
  { code: "DE", dial: "49", name: "Germany", flag: "🇩🇪" },
  { code: "TR", dial: "90", name: "Türkiye", flag: "🇹🇷" },
  { code: "NL", dial: "31", name: "Netherlands", flag: "🇳🇱" },
  { code: "AT", dial: "43", name: "Austria", flag: "🇦🇹" },
  { code: "CH", dial: "41", name: "Switzerland", flag: "🇨🇭" },
  { code: "GB", dial: "44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "FR", dial: "33", name: "France", flag: "🇫🇷" },
  { code: "IT", dial: "39", name: "Italy", flag: "🇮🇹" },
  { code: "ES", dial: "34", name: "Spain", flag: "🇪🇸" },
  { code: "BE", dial: "32", name: "Belgium", flag: "🇧🇪" },
  { code: "PT", dial: "351", name: "Portugal", flag: "🇵🇹" },
  { code: "DK", dial: "45", name: "Denmark", flag: "🇩🇰" },
  { code: "SE", dial: "46", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", dial: "47", name: "Norway", flag: "🇳🇴" },
  { code: "FI", dial: "358", name: "Finland", flag: "🇫🇮" },
  { code: "IE", dial: "353", name: "Ireland", flag: "🇮🇪" },
  { code: "PL", dial: "48", name: "Poland", flag: "🇵🇱" },
  { code: "CZ", dial: "420", name: "Czechia", flag: "🇨🇿" },
  { code: "GR", dial: "30", name: "Greece", flag: "🇬🇷" },
  { code: "HU", dial: "36", name: "Hungary", flag: "🇭🇺" },
  { code: "RO", dial: "40", name: "Romania", flag: "🇷🇴" },
  { code: "BG", dial: "359", name: "Bulgaria", flag: "🇧🇬" },
  { code: "HR", dial: "385", name: "Croatia", flag: "🇭🇷" },
  { code: "SK", dial: "421", name: "Slovakia", flag: "🇸🇰" },
  { code: "SI", dial: "386", name: "Slovenia", flag: "🇸🇮" },
  { code: "EE", dial: "372", name: "Estonia", flag: "🇪🇪" },
  { code: "LV", dial: "371", name: "Latvia", flag: "🇱🇻" },
  { code: "LT", dial: "370", name: "Lithuania", flag: "🇱🇹" },
  { code: "LU", dial: "352", name: "Luxembourg", flag: "🇱🇺" },
  { code: "US", dial: "1", name: "United States", flag: "🇺🇸" },
  { code: "CA", dial: "1", name: "Canada", flag: "🇨🇦" },
  { code: "MX", dial: "52", name: "Mexico", flag: "🇲🇽" },
  { code: "BR", dial: "55", name: "Brazil", flag: "🇧🇷" },
  { code: "AR", dial: "54", name: "Argentina", flag: "🇦🇷" },
  { code: "AU", dial: "61", name: "Australia", flag: "🇦🇺" },
  { code: "NZ", dial: "64", name: "New Zealand", flag: "🇳🇿" },
  { code: "JP", dial: "81", name: "Japan", flag: "🇯🇵" },
  { code: "KR", dial: "82", name: "South Korea", flag: "🇰🇷" },
  { code: "CN", dial: "86", name: "China", flag: "🇨🇳" },
  { code: "HK", dial: "852", name: "Hong Kong", flag: "🇭🇰" },
  { code: "SG", dial: "65", name: "Singapore", flag: "🇸🇬" },
  { code: "IN", dial: "91", name: "India", flag: "🇮🇳" },
  { code: "AE", dial: "971", name: "UAE", flag: "🇦🇪" },
  { code: "SA", dial: "966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "IL", dial: "972", name: "Israel", flag: "🇮🇱" },
  { code: "EG", dial: "20", name: "Egypt", flag: "🇪🇬" },
  { code: "ZA", dial: "27", name: "South Africa", flag: "🇿🇦" },
  { code: "RU", dial: "7", name: "Russia", flag: "🇷🇺" },
  { code: "UA", dial: "380", name: "Ukraine", flag: "🇺🇦" },
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // Germany
export const UNKNOWN_FLAG = "🏳️";

export function findCountryByDial(dial: string): Country | undefined {
  return COUNTRIES.find((c) => c.dial === dial);
}

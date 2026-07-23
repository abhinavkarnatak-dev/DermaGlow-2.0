/**
 * Single source of truth for all intake-form options.
 * Update these lists to change what the form offers - nothing else needs to change.
 */

export type Option = { value: string; label: string };

export const SKIN_TYPES: Option[] = [
  { value: "normal", label: "Normal" },
  { value: "oily", label: "Oily" },
  { value: "dry", label: "Dry" },
  { value: "combination", label: "Combination" },
  { value: "sensitive", label: "Sensitive" },
  { value: "acne-prone", label: "Acne-Prone" },
];

export const SKIN_CONCERNS: Option[] = [
  { value: "acne", label: "Acne" },
  { value: "pigmentation", label: "Pigmentation" },
  { value: "wrinkles", label: "Fine Lines & Wrinkles" },
  { value: "redness", label: "Redness" },
  { value: "dark-circles", label: "Dark Circles" },
  { value: "uneven-tone", label: "Uneven Tone" },
  { value: "dullness", label: "Dullness" },
  { value: "large-pores", label: "Large Pores" },
];

export const GENDERS: Option[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

/**
 * Countries drive region-aware product recommendations (brands and pricing that
 * actually exist where the user lives). India is listed first as the primary market.
 */
export const COUNTRIES: Option[] = [
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "SG", label: "Singapore" },
  { value: "MY", label: "Malaysia" },
  { value: "PH", label: "Philippines" },
  { value: "ID", label: "Indonesia" },
  { value: "TH", label: "Thailand" },
  { value: "VN", label: "Vietnam" },
  { value: "JP", label: "Japan" },
  { value: "KR", label: "South Korea" },
  { value: "CN", label: "China" },
  { value: "HK", label: "Hong Kong" },
  { value: "PK", label: "Pakistan" },
  { value: "BD", label: "Bangladesh" },
  { value: "LK", label: "Sri Lanka" },
  { value: "NP", label: "Nepal" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "QA", label: "Qatar" },
  { value: "KW", label: "Kuwait" },
  { value: "ZA", label: "South Africa" },
  { value: "NG", label: "Nigeria" },
  { value: "KE", label: "Kenya" },
  { value: "EG", label: "Egypt" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "ES", label: "Spain" },
  { value: "IT", label: "Italy" },
  { value: "NL", label: "Netherlands" },
  { value: "SE", label: "Sweden" },
  { value: "PL", label: "Poland" },
  { value: "TR", label: "Turkey" },
  { value: "BR", label: "Brazil" },
  { value: "MX", label: "Mexico" },
  { value: "AR", label: "Argentina" },
  { value: "NZ", label: "New Zealand" },
  { value: "OTHER", label: "Other / Not listed" },
];

// Input validation bounds, kept here so form + schema stay in sync.
export const LIMITS = {
  nameMin: 2,
  nameMax: 60,
  ageMin: 13,
  ageMax: 100,
  goalsMax: 500,
  maxConcerns: 8,
  imageMaxBytes: 10 * 1024 * 1024, // 10 MB pre-compression guard
} as const;

const byValue = (list: Option[]) => new Set(list.map((o) => o.value));

export const SKIN_TYPE_VALUES = byValue(SKIN_TYPES);
export const SKIN_CONCERN_VALUES = byValue(SKIN_CONCERNS);
export const GENDER_VALUES = byValue(GENDERS);
export const COUNTRY_VALUES = byValue(COUNTRIES);

export function labelFor(list: Option[], value: string): string {
  return list.find((o) => o.value === value)?.label ?? value;
}

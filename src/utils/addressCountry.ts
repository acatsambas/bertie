import {
  getAllCountries,
  getCountryByCode,
  getPostalLabel,
} from 'postal-code-checker';

export const DEFAULT_COUNTRY_CODE = 'GB';

const normalizeCountryKey = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const countriesByCode = new Map(
  getAllCountries().map(country => [country.countryCode, country]),
);

const countriesByNormalizedName = new Map<string, string>();
for (const country of getAllCountries()) {
  countriesByNormalizedName.set(
    normalizeCountryKey(country.countryName),
    country.countryCode,
  );
}

/** Aliases for legacy free-text values users may already have saved. */
const LEGACY_NAME_ALIASES: Record<string, string> = {
  uk: 'GB',
  'u k': 'GB',
  'united kingdom': 'GB',
  'great britain': 'GB',
  britain: 'GB',
  england: 'GB',
  scotland: 'GB',
  wales: 'GB',
  'northern ireland': 'GB',
  usa: 'US',
  'u s': 'US',
  'u s a': 'US',
  'united states of america': 'US',
  'united states': 'US',
  america: 'US',
  holland: 'NL',
  'the netherlands': 'NL',
  netherlands: 'NL',
  'czech republic': 'CZ',
  czechia: 'CZ',
  'czech rep': 'CZ',
  uae: 'AE',
  'united arab emirates': 'AE',
  'south korea': 'KR',
  'republic of korea': 'KR',
  korea: 'KR',
  'ivory coast': 'CI',
  'cote d ivoire': 'CI',
  'republic of ireland': 'IE',
  eire: 'IE',
};

export const hasPostalSystem = (countryCode: string): boolean => {
  const country = getCountryByCode(countryCode);
  return (country?.postalCodePatterns?.length ?? 0) > 0;
};

export const getCountryDisplayName = (
  countryCode: string | undefined | null,
): string | undefined => {
  if (!countryCode) return undefined;
  const normalized = countryCode.trim().toUpperCase();
  return (
    countriesByCode.get(normalized)?.countryName ??
    getCountryByCode(normalized)?.countryName
  );
};

/**
 * Resolve a stored country value (ISO alpha-2 or legacy free-text name)
 * to an ISO 3166-1 alpha-2 code. Returns undefined when unrecognized.
 */
export const resolveCountryCode = (
  value: string | undefined | null,
): string | undefined => {
  if (!value?.trim()) return undefined;

  const trimmed = value.trim();
  const upper = trimmed.toUpperCase();

  if (upper.length === 2 && countriesByCode.has(upper)) {
    return upper;
  }

  if (upper.length === 3) {
    const byAlpha3 = getCountryByCode(upper);
    if (byAlpha3?.countryCode) return byAlpha3.countryCode;
  }

  const key = normalizeCountryKey(trimmed);
  return LEGACY_NAME_ALIASES[key] ?? countriesByNormalizedName.get(key);
};

export const getPostalFieldLabel = (countryCode: string): string => {
  const label = getPostalLabel(countryCode) || 'postal code';
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const getPostalExample = (countryCode: string): string | undefined => {
  const examples = getCountryByCode(countryCode)?.examplePostalCodes;
  return examples?.[0];
};

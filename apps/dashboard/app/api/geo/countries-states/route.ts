import { NextResponse } from 'next/server';
import fallbackData from '@/lib/countries-states.json';

export interface GeoState {
  name: string;
  code: string;
}

export interface GeoCountry {
  name: string;
  iso2: string;
  iso3: string;
  states: GeoState[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryParam = searchParams.get('country')?.trim().toLowerCase();

  let countries: GeoCountry[] = fallbackData as GeoCountry[];

  // Attempt live upstream refresh with short timeout, falling back smoothly to local dataset
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
      signal: controller.signal,
      next: { revalidate: 86400 }, // Cache for 24 hours
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json?.data) && json.data.length > 0) {
        const upstreamCountries = json.data.map((c: any) => ({
          name: c.name,
          iso2: c.iso2,
          iso3: c.iso3,
          states: (c.states || []).map((s: any) =>
            typeof s === 'string'
              ? { name: s, code: '' }
              : { name: s.name, code: s.state_code || '' }
          ),
        }));

        // Merge, ensuring enriched local counties (e.g. UK 114 counties) are preserved
        countries = (fallbackData as GeoCountry[]).map((f: GeoCountry) => {
          const up = upstreamCountries.find((u: any) => u.iso2 === f.iso2 || u.name === f.name);
          if (up && up.states.length > f.states.length) {
            return { ...f, states: up.states };
          }
          return f;
        });
      }
    }
  } catch {
    // Gracefully use local dataset
  }

  // If specific country requested
  if (countryParam) {
    const matched = countries.find(
      (c) =>
        c.name.toLowerCase() === countryParam ||
        c.iso2.toLowerCase() === countryParam ||
        c.iso3.toLowerCase() === countryParam
    );

    if (matched) {
      return NextResponse.json({
        ok: true,
        country: matched.name,
        iso2: matched.iso2,
        iso3: matched.iso3,
        states: matched.states,
      });
    }

    return NextResponse.json(
      { ok: false, error: 'Country not found', states: [] },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    total: countries.length,
    countries,
  });
}

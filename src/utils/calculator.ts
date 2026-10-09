import { LeasingInputs, LeasingCalculationResult, RatingDetail, PresetOffer } from '../types/leasing';

export const RATING_CONFIG: Record<string, RatingDetail> = {
  top: {
    category: 'top',
    label: 'Top-Angebot',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    gradient: 'from-emerald-500 to-teal-400',
    description: 'Extrem seltenes Schnäppchen. Oft stark subventioniert durch Hersteller oder Sonderaktionen.',
    rangeText: '< 0,50',
  },
  very_good: {
    category: 'very_good',
    label: 'Sehr gut',
    badgeBg: 'bg-green-500/15',
    badgeText: 'text-green-400',
    badgeBorder: 'border-green-500/30',
    textColor: 'text-green-400',
    gradient: 'from-green-500 to-emerald-400',
    description: 'Sehr attraktive Konditionen. Deutlich unter dem Marktdurchschnitt.',
    rangeText: '0,50 – 0,70',
  },
  good: {
    category: 'good',
    label: 'Gut',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-400',
    badgeBorder: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    gradient: 'from-cyan-500 to-blue-400',
    description: 'Faires und marktgerechtes Angebot für ein Neufahrzeug mit solidem Preis-Leistungs-Verhältnis.',
    rangeText: '0,70 – 0,90',
  },
  average: {
    category: 'average',
    label: 'Durchschnittlich',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-500/30',
    textColor: 'text-amber-400',
    gradient: 'from-amber-500 to-orange-400',
    description: 'Typischer Listenpreis-Leasingfaktor ohne nennenswerte Rabatte oder Förderungen.',
    rangeText: '0,90 – 1,10',
  },
  expensive: {
    category: 'expensive',
    label: 'Teuer',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-400',
    badgeBorder: 'border-rose-500/30',
    textColor: 'text-rose-400',
    gradient: 'from-rose-500 to-red-500',
    description: 'Kostspieliges Angebot. Überlege Alternativen zu verhandeln oder andere Modelle zu prüfen.',
    rangeText: '> 1,10',
  },
};

export function getRating(leasingFactor: number): RatingDetail {
  if (leasingFactor < 0.5) return RATING_CONFIG.top;
  if (leasingFactor <= 0.7) return RATING_CONFIG.very_good;
  if (leasingFactor <= 0.9) return RATING_CONFIG.good;
  if (leasingFactor <= 1.1) return RATING_CONFIG.average;
  return RATING_CONFIG.expensive;
}

export function calculateLeasing(inputs: LeasingInputs): LeasingCalculationResult {
  const {
    bruttolistenpreis = 0,
    monatlicheRate = 0,
    laufzeit = 36,
    anzahlung = 0,
    ueberfuehrungskosten = 0,
    mwstSatz = 19,
    includeUeberfuehrungInFactor = false,
  } = inputs;

  // Validation checks
  if (laufzeit <= 0) {
    return createEmptyResult('Die Vertragslaufzeit muss mindestens 1 Monat betragen.');
  }
  if (bruttolistenpreis <= 0) {
    return createEmptyResult('Der Bruttolistenpreis (UVP) muss größer als 0 € sein.');
  }
  if (monatlicheRate < 0 || anzahlung < 0 || ueberfuehrungskosten < 0 || mwstSatz < 0) {
    return createEmptyResult('Eingabewerte dürfen nicht negativ sein.');
  }

  // A) Effektive monatliche Rate (Brutto)
  const additionalOneOff = anzahlung + (includeUeberfuehrungInFactor ? ueberfuehrungskosten : 0);
  const effektiveRateBrutto = monatlicheRate + (additionalOneOff / laufzeit);

  // B) Brutto-Leasingfaktor
  const bruttoLeasingfaktor = (effektiveRateBrutto / bruttolistenpreis) * 100;

  // C) Netto-Leasingfaktor & Nettowerte
  const taxFactor = 1 + (mwstSatz / 100);
  const safeTaxFactor = taxFactor > 0 ? taxFactor : 1;

  const nettoBruttolistenpreis = bruttolistenpreis / safeTaxFactor;
  const nettoEffektiveRate = effektiveRateBrutto / safeTaxFactor;
  const nettoMonatlicheRate = monatlicheRate / safeTaxFactor;
  const nettoAnzahlung = anzahlung / safeTaxFactor;
  const nettoUeberfuehrungskosten = ueberfuehrungskosten / safeTaxFactor;
  
  // Note: Mathematically (nettoEffektiveRate / nettoBruttolistenpreis) * 100 is identical to gross factor if tax applies to both
  const nettoLeasingfaktor = (nettoEffektiveRate / nettoBruttolistenpreis) * 100;

  // Gesamtkosten über die Vertragslaufzeit
  const gesamtkostenBrutto = (monatlicheRate * laufzeit) + anzahlung + ueberfuehrungskosten;
  const gesamtkostenNetto = gesamtkostenBrutto / safeTaxFactor;
  const gesamtMwSt = gesamtkostenBrutto - gesamtkostenNetto;

  // Breakdown values
  const anzahlungProMonat = anzahlung / laufzeit;
  const ueberfuehrungProMonat = ueberfuehrungskosten / laufzeit;
  const gesamtkostenFaktor = (gesamtkostenBrutto / bruttolistenpreis) * 100;
  const kostenPro1000Uvp = (effektiveRateBrutto / bruttolistenpreis) * 1000;

  return {
    effektiveRateBrutto,
    bruttoLeasingfaktor,
    nettoBruttolistenpreis,
    nettoEffektiveRate,
    nettoMonatlicheRate,
    nettoAnzahlung,
    nettoUeberfuehrungskosten,
    nettoLeasingfaktor,
    gesamtkostenBrutto,
    gesamtkostenNetto,
    gesamtMwSt,
    anzahlungProMonat,
    ueberfuehrungProMonat,
    gesamtkostenFaktor,
    kostenPro1000Uvp,
    rating: getRating(bruttoLeasingfaktor),
    isValid: true,
  };
}

function createEmptyResult(errorMessage: string): LeasingCalculationResult {
  return {
    effektiveRateBrutto: 0,
    bruttoLeasingfaktor: 0,
    nettoBruttolistenpreis: 0,
    nettoEffektiveRate: 0,
    nettoMonatlicheRate: 0,
    nettoAnzahlung: 0,
    nettoUeberfuehrungskosten: 0,
    nettoLeasingfaktor: 0,
    gesamtkostenBrutto: 0,
    gesamtkostenNetto: 0,
    gesamtMwSt: 0,
    anzahlungProMonat: 0,
    ueberfuehrungProMonat: 0,
    gesamtkostenFaktor: 0,
    kostenPro1000Uvp: 0,
    rating: RATING_CONFIG.average,
    isValid: false,
    errorMessage,
  };
}

// Formatters for German currency and percentages
export function formatCurrency(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0,00 €';
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0,00';
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatFactor(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '0,00';
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Preset offers for fast testing and user delight
export const PRESET_OFFERS: PresetOffer[] = [
  {
    id: 'golf-aktionsdeal',
    title: 'Kompaktklasse Aktionsdeal',
    subtitle: 'z. B. VW Golf / Audi A3 Style',
    category: 'Verbrenner / Hybrid',
    data: {
      fahrzeugName: 'VW Golf 1.5 eTSI Style',
      bruttolistenpreis: 36500,
      monatlicheRate: 249,
      laufzeit: 36,
      anzahlung: 0,
      ueberfuehrungskosten: 990,
      mwstSatz: 19,
      includeUeberfuehrungInFactor: false,
      fahrleistungKm: 10000,
    },
  },
  {
    id: 'e-auto-subvention',
    title: 'Elektro-Limousine Sonderaktion',
    subtitle: 'z. B. BMW i4 eDrive40',
    category: 'Elektro',
    data: {
      fahrzeugName: 'BMW i4 eDrive40 M Sport',
      bruttolistenpreis: 62400,
      monatlicheRate: 389,
      laufzeit: 36,
      anzahlung: 0,
      ueberfuehrungskosten: 1100,
      mwstSatz: 19,
      includeUeberfuehrungInFactor: false,
      fahrleistungKm: 10000,
    },
  },
  {
    id: 'premium-suv',
    title: 'Business SUV Premium',
    subtitle: 'z. B. Mercedes-Benz GLC 300',
    category: 'Premium SUV',
    data: {
      fahrzeugName: 'Mercedes-Benz GLC 300 4MATIC',
      bruttolistenpreis: 74900,
      monatlicheRate: 649,
      laufzeit: 48,
      anzahlung: 2500,
      ueberfuehrungskosten: 1250,
      mwstSatz: 19,
      includeUeberfuehrungInFactor: true,
      fahrleistungKm: 15000,
    },
  },
  {
    id: 'kleinwagen-city',
    title: 'City-Kleinwagen Top-Deal',
    subtitle: 'z. B. Opel Corsa / Cupra Born',
    category: 'Kleinwagen',
    data: {
      fahrzeugName: 'Cupra Born 58 kWh',
      bruttolistenpreis: 39900,
      monatlicheRate: 179,
      laufzeit: 24,
      anzahlung: 0,
      ueberfuehrungskosten: 890,
      mwstSatz: 19,
      includeUeberfuehrungInFactor: false,
      fahrleistungKm: 10000,
    },
  },
];

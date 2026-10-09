export interface LeasingInputs {
  fahrzeugName: string;
  bruttolistenpreis: number; // UVP in €
  monatlicheRate: number; // Brutto in €
  laufzeit: number; // Monate (z. B. 24, 36, 48)
  anzahlung: number; // Sonderzahlung Brutto in €
  ueberfuehrungskosten: number; // Bereitstellung/Zulassung in €
  mwstSatz: number; // in % (z. B. 19)
  includeUeberfuehrungInFactor: boolean; // Toggle
  fahrleistungKm: number; // z. B. 10.000 km/Jahr
}

export type RatingCategory = 'top' | 'very_good' | 'good' | 'average' | 'expensive';

export interface RatingDetail {
  category: RatingCategory;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  textColor: string;
  gradient: string;
  description: string;
  rangeText: string;
}

export interface LeasingCalculationResult {
  effektiveRateBrutto: number;
  bruttoLeasingfaktor: number;
  
  nettoBruttolistenpreis: number;
  nettoEffektiveRate: number;
  nettoMonatlicheRate: number;
  nettoAnzahlung: number;
  nettoUeberfuehrungskosten: number;
  nettoLeasingfaktor: number;
  
  gesamtkostenBrutto: number;
  gesamtkostenNetto: number;
  gesamtMwSt: number;
  
  anzahlungProMonat: number;
  ueberfuehrungProMonat: number;
  gesamtkostenFaktor: number; // Gesamtkosten / Listenpreis * 100
  kostenPro1000Uvp: number; // Effektive Rate / (UVP / 1000)
  
  rating: RatingDetail;
  isValid: boolean;
  errorMessage?: string;
}

export interface PresetOffer {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  data: LeasingInputs;
}

export interface SavedOffer {
  id: string;
  name: string;
  savedAt: string;
  inputs: LeasingInputs;
  result: LeasingCalculationResult;
}

import React, { useState } from 'react';
import { LeasingInputs } from '../types/leasing';
import { PRESET_OFFERS } from '../utils/calculator';
import {
  Car,
  Euro,
  Calendar,
  Layers,
  Truck,
  Percent,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';

interface InputFormProps {
  inputs: LeasingInputs;
  onChange: (inputs: LeasingInputs) => void;
  onApplyPreset: (presetId: string) => void;
}

export const InputForm: React.FC<InputFormProps> = ({
  inputs,
  onChange,
  onApplyPreset,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleNumberChange = (field: keyof LeasingInputs, rawValue: string) => {
    // Clean raw string, allow decimal comma or period
    const sanitized = rawValue.replace(',', '.');
    const num = parseFloat(sanitized);
    onChange({
      ...inputs,
      [field]: isNaN(num) ? 0 : Math.max(0, num),
    });
  };

  const handleLaufzeitSelect = (months: number) => {
    onChange({
      ...inputs,
      laufzeit: months,
    });
  };

  const commonLaufzeiten = [12, 24, 36, 48, 60];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-4 sm:p-5 shadow-sm dark:shadow-xl transition-all duration-200">
      {/* Header & Preset quick bar */}
      <div className="flex flex-col gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Leasing-Parameter
            </span>
          </div>

          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onApplyPreset(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="appearance-none rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 pr-7 text-xs font-medium text-cyan-700 dark:text-cyan-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-cyan-800 dark:hover:text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer transition-colors"
            >
              <option value="" disabled>
                ⚡ Schnellvorlage laden...
              </option>
              {PRESET_OFFERS.map((preset) => (
                <option key={preset.id} value={preset.id} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                  {preset.title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>

        {/* Vehicle Name input */}
        <div className="relative">
          <label htmlFor="fahrzeugName" className="sr-only">
            Fahrzeugbezeichnung
          </label>
          <div className="relative flex items-center">
            <Car className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              id="fahrzeugName"
              type="text"
              value={inputs.fahrzeugName}
              onChange={(e) => onChange({ ...inputs, fahrzeugName: e.target.value })}
              placeholder="Fahrzeugmodell (z. B. VW Golf 1.5 eTSI Style)"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-950 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="mt-4 space-y-4">
        {/* Field 1: Bruttolistenpreis (UVP) */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label htmlFor="bruttolistenpreis" className="font-semibold text-slate-800 dark:text-slate-200">
              Bruttolistenpreis (UVP)
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">inkl. MwSt.</span>
          </div>
          <div className="relative flex items-center">
            <input
              id="bruttolistenpreis"
              type="number"
              step="500"
              min="1000"
              value={inputs.bruttolistenpreis === 0 ? '' : inputs.bruttolistenpreis}
              onChange={(e) => handleNumberChange('bruttolistenpreis', e.target.value)}
              placeholder="z. B. 45.000"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-base sm:text-lg font-mono tabular-nums text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:bg-white dark:focus:bg-slate-950 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
            <div className="pointer-events-none absolute right-3 flex items-center gap-1 font-mono text-xs font-semibold text-slate-400 dark:text-slate-400">
              <Euro className="h-3.5 w-3.5" />
            </div>
          </div>
          {/* Quick price adjustment buttons */}
          <div className="mt-1.5 flex flex-wrap gap-1">
            {[25000, 35000, 45000, 60000, 75000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => onChange({ ...inputs, bruttolistenpreis: val })}
                className={`rounded-md px-2 py-0.5 text-[11px] font-mono transition-colors ${
                  inputs.bruttolistenpreis === val
                    ? 'bg-cyan-50 text-cyan-800 border border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30 font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 dark:bg-slate-950/60 dark:text-slate-400 dark:hover:text-slate-200 dark:border-slate-800/60'
                }`}
              >
                {(val / 1000).toFixed(0)}k €
              </button>
            ))}
          </div>
        </div>

        {/* Field 2: Monatliche Leasingrate (Brutto) */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label htmlFor="monatlicheRate" className="font-semibold text-slate-800 dark:text-slate-200">
              Monatliche Leasingrate (Brutto)
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">monatlich in €</span>
          </div>
          <div className="relative flex items-center">
            <input
              id="monatlicheRate"
              type="number"
              step="10"
              min="0"
              value={inputs.monatlicheRate === 0 ? '' : inputs.monatlicheRate}
              onChange={(e) => handleNumberChange('monatlicheRate', e.target.value)}
              placeholder="z. B. 349"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-base sm:text-lg font-mono tabular-nums text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:bg-white dark:focus:bg-slate-950 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
            <div className="pointer-events-none absolute right-3 font-mono text-xs font-semibold text-slate-400 dark:text-slate-400">
              € / Mt.
            </div>
          </div>
        </div>

        {/* Field 3: Vertragslaufzeit in Monaten */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400" />
              <span>Vertragslaufzeit</span>
            </label>
            <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-medium">
              {inputs.laufzeit} Monate ({Math.round(inputs.laufzeit / 12)} Jahre)
            </span>
          </div>

          {/* Quick select buttons */}
          <div className="grid grid-cols-5 gap-1.5">
            {commonLaufzeiten.map((months) => {
              const active = inputs.laufzeit === months;
              return (
                <button
                  key={months}
                  type="button"
                  onClick={() => handleLaufzeitSelect(months)}
                  className={`min-h-[44px] rounded-xl text-xs font-semibold font-mono transition-all flex flex-col items-center justify-center ${
                    active
                      ? 'bg-cyan-50 text-cyan-800 border border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/40 shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 dark:bg-slate-950/80 dark:text-slate-400 dark:hover:text-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span>{months}</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-normal">Mon.</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Field 4: Einmalige Anzahlung / Sonderzahlung */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label htmlFor="anzahlung" className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400" />
              <span>Einmalige Anzahlung / Sonderzahlung</span>
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {inputs.anzahlung > 0 ? `+${(inputs.anzahlung / inputs.laufzeit).toFixed(1)} €/Mt.` : 'Standard: 0 €'}
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              id="anzahlung"
              type="number"
              step="500"
              min="0"
              value={inputs.anzahlung === 0 ? '' : inputs.anzahlung}
              onChange={(e) => handleNumberChange('anzahlung', e.target.value)}
              placeholder="0 (keine Anzahlung)"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-base font-mono tabular-nums text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:bg-white dark:focus:bg-slate-950 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
            <div className="pointer-events-none absolute right-3 font-mono text-xs font-semibold text-slate-400">
              €
            </div>
          </div>
        </div>

        {/* Field 5: Überführungskosten / Bereitstellung */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label htmlFor="ueberfuehrungskosten" className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400" />
              <span>Überführungskosten / Zulassung</span>
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Werk-/Händlergebühr</span>
          </div>
          <div className="relative flex items-center">
            <input
              id="ueberfuehrungskosten"
              type="number"
              step="50"
              min="0"
              value={inputs.ueberfuehrungskosten === 0 ? '' : inputs.ueberfuehrungskosten}
              onChange={(e) => handleNumberChange('ueberfuehrungskosten', e.target.value)}
              placeholder="z. B. 990 (Standard: 0)"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-base font-mono tabular-nums text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:bg-white dark:focus:bg-slate-950 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
            <div className="pointer-events-none absolute right-3 font-mono text-xs font-semibold text-slate-400">
              €
            </div>
          </div>
        </div>

        {/* Field 6: Switch / Toggle - Überführungskosten in den Leasingfaktor einrechnen? */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 p-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <label htmlFor="includeUeberfuehrung" className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer block">
              Überführungskosten in Leasingfaktor einrechnen?
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              Standard: Nein. Wenn aktiv, wird der Gesamtkostenfaktor (Gesamtleasingfaktor) ermittelt.
            </p>
          </div>

          <button
            id="includeUeberfuehrung"
            type="button"
            role="switch"
            aria-checked={inputs.includeUeberfuehrungInFactor}
            onClick={() =>
              onChange({
                ...inputs,
                includeUeberfuehrungInFactor: !inputs.includeUeberfuehrungInFactor,
              })
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 ${
              inputs.includeUeberfuehrungInFactor ? 'bg-cyan-600 dark:bg-cyan-500' : 'bg-slate-300 dark:bg-slate-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                inputs.includeUeberfuehrungInFactor ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Collapsible section for VAT and km/year */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <Percent className="h-3.5 w-3.5" />
            <span>
              {showAdvanced ? 'Erweiterte Steuer-Optionen schließen' : 'MwSt-Satz & Fahrleistung anpassen'}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 transform transition-transform ${
                showAdvanced ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showAdvanced && (
            <div className="mt-3 space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 p-3.5 transition-all">
              {/* MwSt-Satz */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <label htmlFor="mwstSatz" className="font-medium text-slate-700 dark:text-slate-300">
                    Mehrwertsteuersatz (MwSt.)
                  </label>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">{inputs.mwstSatz} %</span>
                </div>
                <div className="flex items-center gap-2">
                  {[19, 7, 0].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => onChange({ ...inputs, mwstSatz: rate })}
                      className={`min-h-[38px] px-3 rounded-lg text-xs font-mono font-medium transition-colors ${
                        inputs.mwstSatz === rate
                          ? 'bg-cyan-50 text-cyan-800 border border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
                      }`}
                    >
                      {rate} %
                    </button>
                  ))}
                  <div className="relative flex-1">
                    <input
                      id="mwstSatz"
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={inputs.mwstSatz}
                      onChange={(e) => handleNumberChange('mwstSatz', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      placeholder="Individuell"
                    />
                  </div>
                </div>
              </div>

              {/* Fahrleistung */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <label className="font-medium text-slate-700 dark:text-slate-300">
                    Jährliche Fahrleistung (km/Jahr)
                  </label>
                  <span className="font-mono text-slate-500 dark:text-slate-400">
                    {inputs.fahrleistungKm.toLocaleString('de-DE')} km
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[10000, 15000, 20000, 25000].map((km) => (
                    <button
                      key={km}
                      type="button"
                      onClick={() => onChange({ ...inputs, fahrleistungKm: km })}
                      className={`min-h-[36px] rounded-lg text-[11px] font-mono transition-colors ${
                        inputs.fahrleistungKm === km
                          ? 'bg-cyan-50 text-cyan-800 border border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30 font-semibold'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
                      }`}
                    >
                      {km / 1000}k km
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

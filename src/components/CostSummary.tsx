import React from 'react';
import { LeasingInputs, LeasingCalculationResult } from '../types/leasing';
import { formatCurrency, formatNumber } from '../utils/calculator';
import { Receipt } from 'lucide-react';

interface CostSummaryProps {
  inputs: LeasingInputs;
  result: LeasingCalculationResult;
  onOpenFormulas: () => void;
}

export const CostSummary: React.FC<CostSummaryProps> = ({
  inputs,
  result,
}) => {
  if (!result.isValid) return null;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-4 sm:p-5 shadow-sm dark:shadow-xl transition-all duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Kosten-Zusammenfassung & Details
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-500 font-mono">
          Laufzeit: {inputs.laufzeit} Monate
        </span>
      </div>

      {/* Primary Highlights: Gesamtkosten */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/70 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Gesamtkosten (Brutto)</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">alle Zahlungen</span>
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {formatCurrency(result.gesamtkostenBrutto)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Anteil am Listenpreis:</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
              {formatNumber(result.gesamtkostenFaktor, 1)} % des UVP
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/70 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cyan-700 dark:text-cyan-400 font-medium">Gesamtkosten (Netto)</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Gewerbe</span>
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-cyan-700 dark:text-cyan-300 tabular-nums">
            {formatCurrency(result.gesamtkostenNetto)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Enthaltene MwSt. ({inputs.mwstSatz}%):</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
              {formatCurrency(result.gesamtMwSt)}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed tabular items */}
      <div className="mt-4 space-y-2 text-xs">
        {/* Effective rate row */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-950/40 p-2.5 border border-slate-200/80 dark:border-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-800 dark:text-slate-300">Effektive monatliche Rate (Brutto)</span>
            {inputs.includeUeberfuehrungInFactor && (
              <span className="rounded bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/50 px-1.5 py-0.2 text-[10px] font-medium">
                inkl. Überführung
              </span>
            )}
          </div>
          <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
            {formatCurrency(result.effektiveRateBrutto)} / Mt.
          </span>
        </div>

        {/* Net effective rate */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-950/40 p-2.5 border border-slate-200/80 dark:border-slate-800/40">
          <span className="font-medium text-slate-800 dark:text-slate-300">Effektive monatliche Rate (Netto)</span>
          <span className="font-mono font-semibold text-cyan-700 dark:text-cyan-300">
            {formatCurrency(result.nettoEffektiveRate)} / Mt.
          </span>
        </div>

        {/* Regular installment */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-950/40 p-2.5 border border-slate-200/80 dark:border-slate-800/40">
          <span className="text-slate-500 dark:text-slate-400">Nominale Monatsrate (ohne Einmalzahlung)</span>
          <span className="font-mono text-slate-700 dark:text-slate-300">
            {formatCurrency(inputs.monatlicheRate)}
          </span>
        </div>

        {/* Net list price */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-950/40 p-2.5 border border-slate-200/80 dark:border-slate-800/40">
          <span className="text-slate-500 dark:text-slate-400">Netto-Bruttolistenpreis (UVP Netto)</span>
          <span className="font-mono text-slate-700 dark:text-slate-300">
            {formatCurrency(result.nettoBruttolistenpreis)}
          </span>
        </div>

        {/* One-off breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <div className="rounded-lg bg-slate-50/80 dark:bg-slate-950/50 p-2 border border-slate-200/80 dark:border-slate-800/60">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Anzahlung auf Monate verteilt:</div>
            <div className="font-mono text-slate-800 dark:text-slate-200 mt-0.5 font-medium">
              {formatCurrency(result.anzahlungProMonat)} / Monat
            </div>
          </div>
          <div className="rounded-lg bg-slate-50/80 dark:bg-slate-950/50 p-2 border border-slate-200/80 dark:border-slate-800/60">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Überführung auf Monate verteilt:</div>
            <div className="font-mono text-slate-800 dark:text-slate-200 mt-0.5 font-medium">
              {formatCurrency(result.ueberfuehrungProMonat)} / Monat
            </div>
          </div>
        </div>

        {/* Cost per 1000 EUR UVP */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50/50 dark:bg-slate-950/30 p-2 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800/30">
          <span>Kosten pro 1.000 € Listenpreis:</span>
          <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
            {formatCurrency(result.kostenPro1000Uvp)} / Monat
          </span>
        </div>
      </div>
    </div>
  );
};

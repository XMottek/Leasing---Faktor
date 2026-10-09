import React from 'react';
import { LeasingCalculationResult } from '../types/leasing';
import { formatCurrency, formatFactor, RATING_CONFIG } from '../utils/calculator';
import { Sparkles, HelpCircle, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ResultGaugeProps {
  result: LeasingCalculationResult;
  onOpenFormulas: () => void;
}

export const ResultGauge: React.FC<ResultGaugeProps> = ({ result, onOpenFormulas }) => {
  const {
    bruttoLeasingfaktor,
    nettoLeasingfaktor,
    effektiveRateBrutto,
    nettoEffektiveRate,
    rating,
    isValid,
    errorMessage,
  } = result;

  // Calculate position percentage on visual gauge (from 0.30 to 1.30 factor)
  // 0.30 -> 0%, 1.30 -> 100%
  const minFactor = 0.3;
  const maxFactor = 1.3;
  const clampedFactor = Math.min(Math.max(bruttoLeasingfaktor, minFactor), maxFactor);
  const gaugePercent = ((clampedFactor - minFactor) / (maxFactor - minFactor)) * 100;

  const getRatingIcon = (cat: string) => {
    switch (cat) {
      case 'top':
      case 'very_good':
        return <CheckCircle2 className="h-4 w-4 shrink-0" />;
      case 'good':
        return <Sparkles className="h-4 w-4 shrink-0" />;
      case 'average':
        return <AlertTriangle className="h-4 w-4 shrink-0" />;
      case 'expensive':
      default:
        return <XCircle className="h-4 w-4 shrink-0" />;
    }
  };

  if (!isValid) {
    return (
      <div className="rounded-2xl border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 p-5 text-rose-800 dark:text-rose-300">
        <div className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-5 w-5 text-rose-500 dark:text-rose-400" />
          <span>Eingabe prüfen</span>
        </div>
        <p className="mt-2 text-sm text-rose-700/80 dark:text-rose-200/80">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-4 sm:p-5 shadow-sm dark:shadow-xl transition-all duration-200">
      {/* Header bar of Results */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Bewertung & Kennzahlen
        </span>
        <button
          type="button"
          onClick={onOpenFormulas}
          className="flex items-center gap-1 text-xs text-cyan-700 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Formeln & Logik</span>
        </button>
      </div>

      {/* Main KPI: Brutto & Netto Leasingfaktor */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Brutto Leasingfaktor Card */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/70 p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Brutto-Leasingfaktor
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">inkl. MwSt.</span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white tracking-tight">
              {formatFactor(bruttoLeasingfaktor)}
            </span>
            <span className="text-lg font-semibold text-slate-400 dark:text-slate-400 font-mono">
              LF
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/60">
            <span>Effektive Bruttorate:</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              {formatCurrency(effektiveRateBrutto)} / Mt.
            </span>
          </div>
        </div>

        {/* Netto Leasingfaktor Card */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/70 p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Netto-Leasingfaktor
            </span>
            <span className="text-[11px] text-cyan-700 dark:text-cyan-400 font-medium">Gewerbe</span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-cyan-700 dark:text-cyan-300 tracking-tight">
              {formatFactor(nettoLeasingfaktor)}
            </span>
            <span className="text-lg font-semibold text-slate-400 dark:text-slate-400 font-mono">
              LF
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/60">
            <span>Effektive Nettorate:</span>
            <span className="font-mono font-semibold text-cyan-700 dark:text-cyan-200">
              {formatCurrency(nettoEffektiveRate)} / Mt.
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Rating Badge & Description */}
      <div
        className={`mt-4 rounded-xl border ${rating.badgeBorder} ${rating.badgeBg} p-3.5 transition-all`}
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className={`${rating.textColor}`}>
              {getRatingIcon(rating.category)}
            </div>
            <span className={`text-base font-bold tracking-tight ${rating.textColor}`}>
              {rating.label}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              (Bereich {rating.rangeText})
            </span>
          </div>
          <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
            Faktor {formatFactor(bruttoLeasingfaktor)}
          </span>
        </div>
        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {rating.description}
        </p>
      </div>

      {/* Visual Color Scale & Needle Indicator */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Bewertungs-Skala</span>
          <span className="font-mono">{formatFactor(bruttoLeasingfaktor)}</span>
        </div>

        {/* Gauge bar */}
        <div className="relative h-3 w-full rounded-full bg-slate-200 dark:bg-slate-950 p-0.5 border border-slate-300 dark:border-slate-800 overflow-visible">
          {/* Segmented gradient background */}
          <div className="h-full w-full rounded-full flex overflow-hidden">
            {/* < 0.5: Top (20% width roughly: 0.3 to 0.5 = 0.2 / 1.0 = 20%) */}
            <div className="h-full w-[20%] bg-emerald-500" title="< 0.5: Top-Angebot" />
            {/* 0.5 - 0.7: Sehr gut (20%) */}
            <div className="h-full w-[20%] bg-green-400" title="0.5 - 0.7: Sehr gut" />
            {/* 0.7 - 0.9: Gut (20%) */}
            <div className="h-full w-[20%] bg-cyan-400" title="0.7 - 0.9: Gut" />
            {/* 0.9 - 1.1: Durchschnittlich (20%) */}
            <div className="h-full w-[20%] bg-amber-400" title="0.9 - 1.1: Durchschnittlich" />
            {/* > 1.1: Teuer (20%) */}
            <div className="h-full w-[20%] bg-rose-500" title="> 1.1: Teuer" />
          </div>

          {/* Marker Needle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none"
            style={{ left: `${gaugePercent}%` }}
          >
            <div className="h-6 w-3.5 rounded-sm bg-white shadow-md border-2 border-slate-700 dark:border-slate-900 flex items-center justify-center">
              <div className="h-2.5 w-0.5 bg-slate-900 rounded-full" />
            </div>
          </div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">&lt; 0,5</span>
          <span className="text-green-600 dark:text-green-400">0,6</span>
          <span className="text-cyan-600 dark:text-cyan-400">0,8</span>
          <span className="text-amber-600 dark:text-amber-400">1,0</span>
          <span className="text-rose-600 dark:text-rose-400 font-semibold">&gt; 1,1</span>
        </div>
      </div>

      {/* Quick classification legend list */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-1.5 text-center text-[10px]">
        {Object.values(RATING_CONFIG).map((cfg) => {
          const isActive = cfg.category === rating.category;
          return (
            <div
              key={cfg.category}
              className={`rounded-lg py-1 px-1.5 border transition-all ${
                isActive
                  ? `${cfg.badgeBorder} ${cfg.badgeBg} ${cfg.textColor} font-semibold ring-1 ring-cyan-400/30`
                  : 'border-slate-200 dark:border-slate-800/40 bg-slate-50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="truncate">{cfg.label}</div>
              <div className="font-mono text-[9px] opacity-80">{cfg.rangeText}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

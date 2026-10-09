import React from 'react';
import { X, Calculator } from 'lucide-react';
import { RATING_CONFIG } from '../utils/calculator';

interface FormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Berechnungsformeln & Leasing-Logik
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {/* Formula 1 */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 p-3.5 space-y-2">
            <div className="font-semibold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
              <span>1. Effektive monatliche Rate (Brutto)</span>
            </div>
            <div className="rounded-lg bg-white dark:bg-slate-900 p-2.5 font-mono text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800/80">
              Bruttorate + ((Anzahlung + Überführungskosten [falls aktiv]) / Laufzeit)
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verteilt die einmalige Sonderzahlung und ggf. Bereitstellungskosten gleichmäßig auf alle Vertragsmonate.
            </p>
          </div>

          {/* Formula 2 */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 p-3.5 space-y-2">
            <div className="font-semibold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
              <span>2. Brutto-Leasingfaktor</span>
            </div>
            <div className="rounded-lg bg-white dark:bg-slate-900 p-2.5 font-mono text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800/80">
              (Effektive monatliche Rate (Brutto) / Bruttolistenpreis (UVP)) * 100
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gibt an, wie viel Prozent des Listenpreises monatlich für das Fahrzeug aufgewendet werden. Je niedriger, desto besser!
            </p>
          </div>

          {/* Formula 3 */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 p-3.5 space-y-2">
            <div className="font-semibold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
              <span>3. Netto-Leasingfaktor & Nettowerte (Gewerbeleasing)</span>
            </div>
            <div className="space-y-1 rounded-lg bg-white dark:bg-slate-900 p-2.5 font-mono text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800/80">
              <div>Netto-Listenpreis = Bruttolistenpreis / (1 + MwSt / 100)</div>
              <div>Netto-Effektiverate = Effektive Rate / (1 + MwSt / 100)</div>
              <div>Netto-Leasingfaktor = (Netto-Effektiverate / Netto-Listenpreis) * 100</div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Für vorsteuerabzugsberechtigte Unternehmen und Selbstständige ist die Nettobetrachtung maßgeblich.
            </p>
          </div>

          {/* Rating Matrix */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 p-3.5 space-y-2">
            <div className="font-semibold text-slate-900 dark:text-white">
              Offizielle Leasingfaktor-Bewertungsmatrix
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {Object.values(RATING_CONFIG).map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-lg bg-white dark:bg-slate-900 px-3 py-2 text-xs border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${item.textColor}`}>{item.label}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] hidden sm:inline">({item.description})</span>
                  </div>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white shrink-0">
                    {item.rangeText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl bg-slate-900 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Verstanden & Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { LeasingInputs, LeasingCalculationResult, SavedOffer } from '../types/leasing';
import { formatCurrency, formatFactor } from '../utils/calculator';
import { BookmarkPlus, ArrowRightLeft, Trash2, Cloud, ShieldCheck } from 'lucide-react';

interface OfferComparisonProps {
  currentInputs: LeasingInputs;
  currentResult: LeasingCalculationResult;
  savedOffers: SavedOffer[];
  onSaveCurrent: () => void;
  onLoadOffer: (offer: SavedOffer) => void;
  onDeleteOffer: (id: string) => void;
  isAuthenticated?: boolean;
}

export const OfferComparison: React.FC<OfferComparisonProps> = ({
  currentInputs,
  currentResult,
  savedOffers,
  onSaveCurrent,
  onLoadOffer,
  onDeleteOffer,
  isAuthenticated = false,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-4 sm:p-5 shadow-sm dark:shadow-xl transition-all duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Angebots-Vergleich & Merkliste ({savedOffers.length})
          </span>
          {isAuthenticated ? (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] px-2 py-0.5 font-medium border border-emerald-200 dark:border-emerald-800/60">
              <Cloud className="h-3 w-3" />
              <span>Cloud-Sync</span>
            </span>
          ) : (
            <span className="text-[10px] text-slate-400">Lokal</span>
          )}
        </div>

        <button
          type="button"
          onClick={onSaveCurrent}
          className="flex items-center gap-1.5 rounded-lg border border-cyan-300 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-800 hover:bg-cyan-100 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:hover:bg-cyan-500/20 transition-colors cursor-pointer"
        >
          <BookmarkPlus className="h-3.5 w-3.5" />
          <span>Als Vergleich speichern</span>
        </button>
      </div>

      {savedOffers.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-500">
          <p>Noch keine Vergleichsangebote gespeichert.</p>
          <p className="mt-1 text-[11px] text-slate-400">
            Klicke auf "Als Vergleich speichern", um verschiedene Autohaus-Angebote direkt gegenüberzustellen.
          </p>
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-2 pr-3 font-medium">Modell</th>
                <th className="py-2 px-2 font-medium text-right">UVP</th>
                <th className="py-2 px-2 font-medium text-right">Eff. Rate</th>
                <th className="py-2 px-2 font-medium text-right">Faktor</th>
                <th className="py-2 px-2 font-medium text-right">Gesamtkosten</th>
                <th className="py-2 pl-2 font-medium text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {/* Current active offer row */}
              <tr className="bg-cyan-50/80 text-cyan-900 dark:bg-cyan-950/20 dark:text-cyan-200 font-medium">
                <td className="py-2.5 pr-3 font-semibold truncate max-w-[140px]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-500 dark:bg-cyan-400 shrink-0" />
                    <span className="truncate">{currentInputs.fahrzeugName || 'Aktuelle Berechnung'}</span>
                  </div>
                </td>
                <td className="py-2.5 px-2 font-mono text-right tabular-nums">
                  {formatCurrency(currentInputs.bruttolistenpreis, 0)}
                </td>
                <td className="py-2.5 px-2 font-mono text-right tabular-nums font-semibold">
                  {formatCurrency(currentResult.effektiveRateBrutto, 0)}
                </td>
                <td className="py-2.5 px-2 font-mono text-right tabular-nums font-bold">
                  {formatFactor(currentResult.bruttoLeasingfaktor)}
                </td>
                <td className="py-2.5 px-2 font-mono text-right tabular-nums">
                  {formatCurrency(currentResult.gesamtkostenBrutto, 0)}
                </td>
                <td className="py-2.5 pl-2 text-right">
                  <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-semibold">Aktiv</span>
                </td>
              </tr>

              {/* Saved offers */}
              {savedOffers.map((offer) => {
                return (
                  <tr key={offer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-700 dark:text-slate-300">
                    <td className="py-2.5 pr-3 font-medium truncate max-w-[140px]">
                      {offer.name}
                    </td>
                    <td className="py-2.5 px-2 font-mono text-right tabular-nums text-slate-500 dark:text-slate-400">
                      {formatCurrency(offer.inputs.bruttolistenpreis, 0)}
                    </td>
                    <td className="py-2.5 px-2 font-mono text-right tabular-nums">
                      {formatCurrency(offer.result.effektiveRateBrutto, 0)}
                    </td>
                    <td className="py-2.5 px-2 font-mono text-right tabular-nums font-semibold text-slate-900 dark:text-white">
                      {formatFactor(offer.result.bruttoLeasingfaktor)}
                    </td>
                    <td className="py-2.5 px-2 font-mono text-right tabular-nums text-slate-500 dark:text-slate-400">
                      {formatCurrency(offer.result.gesamtkostenBrutto, 0)}
                    </td>
                    <td className="py-2.5 pl-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onLoadOffer(offer)}
                          className="rounded px-1.5 py-0.5 text-[10px] font-medium text-cyan-700 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Angebot laden"
                        >
                          Laden
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteOffer(offer.id)}
                          className="rounded p-1 text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 transition-colors"
                          title="Löschen"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

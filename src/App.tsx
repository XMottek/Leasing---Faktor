/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { LeasingInputs, SavedOffer } from './types/leasing';
import {
  calculateLeasing,
  formatCurrency,
  formatFactor,
  PRESET_OFFERS,
} from './utils/calculator';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultGauge } from './components/ResultGauge';
import { CostSummary } from './components/CostSummary';
import { OfferComparison } from './components/OfferComparison';
import { FormulaModal } from './components/FormulaModal';
import {
  ShieldCheck,
  Info,
} from 'lucide-react';
import {
  auth,
  onAuthStateChanged,
  User,
  signInWithGoogle,
  logOut,
  saveOfferToFirestore,
  deleteOfferFromFirestore,
  subscribeToUserOffers,
  testFirestoreConnection,
} from './services/firebase';

const INITIAL_INPUTS: LeasingInputs = {
  fahrzeugName: 'VW Golf 1.5 eTSI Style',
  bruttolistenpreis: 36500,
  monatlicheRate: 249,
  laufzeit: 36,
  anzahlung: 0,
  ueberfuehrungskosten: 990,
  mwstSatz: 19,
  includeUeberfuehrungInFactor: false,
  fahrleistungKm: 10000,
};

const STORAGE_KEY_SAVED_OFFERS = 'leasing_saved_offers_v1';
const STORAGE_KEY_THEME = 'leasing_theme_preference';

export default function App() {
  const [inputs, setInputs] = useState<LeasingInputs>(INITIAL_INPUTS);
  const [deviceMode, setDeviceMode] = useState<'auto' | 'outer' | 'inner'>('auto');
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Theme State (Light/Dark mode)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_THEME);
      if (stored === 'light' || stored === 'dark') return stored;
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    } catch {
      // ignore
    }
    return 'dark';
  });

  // Sync theme with HTML document element class
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {
      // ignore
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [savedOffers, setSavedOffers] = useState<SavedOffer[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SAVED_OFFERS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  // Test Firestore Connection on boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync when user is authenticated
  useEffect(() => {
    if (!user) {
      // Restore from localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY_SAVED_OFFERS);
        if (stored) setSavedOffers(JSON.parse(stored));
      } catch {
        // ignore
      }
      return;
    }

    const unsubscribe = subscribeToUserOffers(user.uid, (firestoreOffers) => {
      if (firestoreOffers.length > 0) {
        setSavedOffers(firestoreOffers);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Persist locally if not signed in
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(STORAGE_KEY_SAVED_OFFERS, JSON.stringify(savedOffers));
      } catch {
        // ignore
      }
    }
  }, [savedOffers, user]);

  // Dynamic real-time calculation
  const result = useMemo(() => calculateLeasing(inputs), [inputs]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign-in failed', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Sign-out failed', error);
    }
  };

  const handleReset = () => {
    setInputs({
      fahrzeugName: '',
      bruttolistenpreis: 40000,
      monatlicheRate: 300,
      laufzeit: 36,
      anzahlung: 0,
      ueberfuehrungskosten: 0,
      mwstSatz: 19,
      includeUeberfuehrungInFactor: false,
      fahrleistungKm: 10000,
    });
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = PRESET_OFFERS.find((p) => p.id === presetId);
    if (preset) {
      setInputs({ ...preset.data });
    }
  };

  const handleSaveCurrentOffer = async () => {
    const newOffer: SavedOffer = {
      id: Date.now().toString(),
      name: inputs.fahrzeugName || `Angebot ${savedOffers.length + 1}`,
      savedAt: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      inputs: { ...inputs },
      result: { ...result },
    };

    if (user) {
      await saveOfferToFirestore(user.uid, newOffer);
    } else {
      setSavedOffers([newOffer, ...savedOffers.slice(0, 9)]);
    }
  };

  const handleLoadOffer = (offer: SavedOffer) => {
    setInputs({ ...offer.inputs });
  };

  const handleDeleteOffer = async (id: string) => {
    if (user) {
      await deleteOfferFromFirestore(user.uid, id);
    } else {
      setSavedOffers(savedOffers.filter((o) => o.id !== id));
    }
  };

  const handleShare = () => {
    const summaryText = `🚗 Leasingfaktor-Analyse für: ${inputs.fahrzeugName || 'Fahrzeug'}
• Brutto-Leasingfaktor: ${formatFactor(result.bruttoLeasingfaktor)} (${result.rating.label})
• Netto-Leasingfaktor: ${formatFactor(result.nettoLeasingfaktor)}
• Listenpreis (UVP): ${formatCurrency(inputs.bruttolistenpreis)}
• Monatliche Rate: ${formatCurrency(inputs.monatlicheRate)} (${inputs.laufzeit} Monate)
• Effektive Monatsrate: ${formatCurrency(result.effektiveRateBrutto)}
• Einmalige Anzahlung: ${formatCurrency(inputs.anzahlung)}
• Überführungskosten: ${formatCurrency(inputs.ueberfuehrungskosten)} (In Faktor: ${inputs.includeUeberfuehrungInFactor ? 'Ja' : 'Nein'})
• Gesamtkosten (Brutto): ${formatCurrency(result.gesamtkostenBrutto)}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Determine wrapper container width based on device preview mode
  const getContainerClass = () => {
    switch (deviceMode) {
      case 'outer':
        // Google Pixel 9 Pro Fold closed (outer screen ~412px)
        return 'max-w-[420px] mx-auto border-x border-slate-300 dark:border-slate-800 shadow-2xl rounded-3xl my-2 bg-white dark:bg-slate-950 overflow-hidden';
      case 'inner':
        // Google Pixel 9 Pro Fold opened (inner screen ~840px near 1:1)
        return 'max-w-[860px] mx-auto border border-slate-300 dark:border-slate-800 shadow-2xl rounded-3xl my-2 bg-white dark:bg-slate-950 overflow-hidden';
      case 'auto':
      default:
        return 'w-full max-w-7xl mx-auto';
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Top Bar Contract with Theme Toggle and Auth */}
      <Header
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
        onReset={handleReset}
        onShare={handleShare}
        copied={copied}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 transition-all">
        <div className={getContainerClass()}>
          {/* Foldable Preview Banner info if in simulated mode */}
          {deviceMode !== 'auto' && (
            <div className="bg-cyan-100 dark:bg-cyan-950/40 border-b border-cyan-200 dark:border-cyan-800/40 px-3 py-1.5 flex items-center justify-between text-[11px] text-cyan-900 dark:text-cyan-300">
              <span>
                Simulierter Modus:{' '}
                {deviceMode === 'outer'
                  ? 'Pixel 9 Pro Fold Außendisplay (412px)'
                  : 'Pixel 9 Pro Fold Innendisplay (840px)'}
              </span>
              <button
                type="button"
                onClick={() => setDeviceMode('auto')}
                className="underline hover:text-cyan-700 dark:hover:text-white cursor-pointer"
              >
                Zurück zu Auto
              </button>
            </div>
          )}

          {/* Subtitle / Intro Header on larger screens */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Leasingfaktor & Gesamtkosten
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Transparente Bewertung von Privat- & Gewerbeleasingangeboten in Echtzeit.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Echtzeitberechnung
                </span>
                <span>·</span>
                <span className="font-mono text-cyan-700 dark:text-cyan-400 font-medium">
                  {inputs.mwstSatz}% MwSt.
                </span>
              </div>
            </div>
          </div>

          {/*
            RESPONSIVE & FOLDABLE 2-COLUMN GRID:
            - On narrow viewports (< 720px / closed fold screen ~400px): Single-column stacked (Input Form on top, Results below).
            - On square viewports (720px–900px / opened fold screen ~840px) and wide desktop: Side-by-Side 2 columns!
              Left: Input Form with all adjustments.
              Right: Prominent Results, Visual Gauge, and Cost Summary.
          */}
          <div className={`grid gap-4 sm:gap-6 ${
            deviceMode === 'outer'
              ? 'grid-cols-1'
              : 'grid-cols-1 min-[720px]:grid-cols-2 lg:grid-cols-12'
          }`}>
            {/* LEFT COLUMN: Input Form */}
            <div className={`min-w-0 ${
              deviceMode === 'outer'
                ? 'w-full'
                : 'min-[720px]:col-span-1 lg:col-span-6 space-y-4'
            }`}>
              <InputForm
                inputs={inputs}
                onChange={setInputs}
                onApplyPreset={handleApplyPreset}
              />

              {/* Quick Info Tip for Foldable / Mobile Users */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-3 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5 shadow-xs">
                <Info className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-200">Faustregel für Kfz-Leasing:</strong> Ein
                  Faktor unter <strong>0,7</strong> gilt als sehr gut. Ein Faktor unter{' '}
                  <strong>0,5</strong> ist meist ein herstellergestütztes Ausnahmeschnäppchen.
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Results, Visual Gauge & Detailed Breakdown */}
            <div className={`min-w-0 space-y-4 ${
              deviceMode === 'outer'
                ? 'w-full mt-4'
                : 'min-[720px]:col-span-1 lg:col-span-6'
            }`}>
              {/* Prominent Gauge & Rating */}
              <ResultGauge
                result={result}
                onOpenFormulas={() => setShowFormulaModal(true)}
              />

              {/* Overview & Cost Summary */}
              <CostSummary
                inputs={inputs}
                result={result}
                onOpenFormulas={() => setShowFormulaModal(true)}
              />

              {/* Offer Comparison & Bookmark list with Cloud Sync */}
              <OfferComparison
                currentInputs={inputs}
                currentResult={result}
                savedOffers={savedOffers}
                onSaveCurrent={handleSaveCurrentOffer}
                onLoadOffer={handleLoadOffer}
                onDeleteOffer={handleDeleteOffer}
                isAuthenticated={!!user}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-950 px-4 py-4 text-center text-xs text-slate-500 transition-colors">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Leasingfaktor Rechner · Berechnungslogik gemäß deutschem Kfz-Marktstandard
          </span>
          <button
            type="button"
            onClick={() => setShowFormulaModal(true)}
            className="text-cyan-700 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Formel-Erklärung aufrufen
          </button>
        </div>
      </footer>

      {/* Formula & Logic Modal */}
      <FormulaModal
        isOpen={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
      />
    </div>
  );
}

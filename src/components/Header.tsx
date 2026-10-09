import React from 'react';
import { Smartphone, Monitor, Car, Share2, Check, RefreshCw, Sun, Moon, LogIn, LogOut } from 'lucide-react';
import { User } from '../services/firebase';

interface HeaderProps {
  deviceMode: 'auto' | 'outer' | 'inner';
  onDeviceModeChange: (mode: 'auto' | 'outer' | 'inner') => void;
  onReset: () => void;
  onShare: () => void;
  copied: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  deviceMode,
  onDeviceModeChange,
  onReset,
  onShare,
  copied,
  theme,
  onToggleTheme,
  user,
  onSignIn,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/85 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3 transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 text-white">
            <Car className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
              Leasingfaktor Rechner
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate hidden xs:block">
              Kfz & PKW Bewertungs-Tool
            </p>
          </div>
        </div>

        {/* Zone 2: Foldable & Screen View Selector (Functional interactive tabs) */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/90 p-1 text-xs">
          <button
            type="button"
            onClick={() => onDeviceModeChange('auto')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
              deviceMode === 'auto'
                ? 'bg-white text-cyan-700 shadow-xs border border-slate-200/80 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Auto-Modus: Passt sich dem Bildschirm nahtlos an"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Auto</span>
          </button>
          <button
            type="button"
            onClick={() => onDeviceModeChange('outer')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
              deviceMode === 'outer'
                ? 'bg-white text-cyan-700 shadow-xs border border-slate-200/80 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Pixel 9 Fold Außen: Schmaler Viewport (~412px)"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Außendisplay</span>
            <span className="text-[10px] text-slate-400 hidden xs:inline">412px</span>
          </button>
          <button
            type="button"
            onClick={() => onDeviceModeChange('inner')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
              deviceMode === 'inner'
                ? 'bg-white text-cyan-700 shadow-xs border border-slate-200/80 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Pixel 9 Fold Innen: Quadratischer Viewport (~840px 1:1)"
          >
            <Smartphone className="h-3.5 w-3.5 rotate-90" />
            <span className="hidden md:inline">Innendisplay</span>
            <span className="text-[10px] text-slate-400 hidden xs:inline">840px</span>
          </button>
        </div>

        {/* Zone 3: Primary Actions (Theme Toggle, Auth, Reset, Share) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Theme Toggle (Light / Dark mode) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-xs hover:border-slate-300 hover:text-amber-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-amber-300 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Zu hellem Design wechseln (Light Mode)' : 'Zu dunklem Design wechseln (Dark Mode)'}
            aria-label={theme === 'dark' ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-300" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {/* Firebase Authentication Button */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <div
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-800 dark:bg-slate-900/80"
                title={`Angemeldet als ${user.email}`}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="h-5 w-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-cyan-600 text-[10px] font-bold text-white flex items-center justify-center">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[80px] sm:max-w-[120px] truncate hidden xs:inline">
                  {user.displayName || user.email}
                </span>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-0.5 ml-0.5 cursor-pointer"
                  title="Abmelden"
                  aria-label="Abmelden"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-cyan-400 transition-colors cursor-pointer"
              title="Mit Google anmelden für Cloud-Speicherung"
            >
              <LogIn className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span className="hidden sm:inline">Anmelden</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-xs hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Standardwerte wiederherstellen"
            aria-label="Zurücksetzen"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onShare}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-3 text-xs font-semibold text-white shadow-sm shadow-cyan-500/20 hover:from-cyan-500 hover:to-blue-500 transition-all active:scale-[0.98] cursor-pointer"
            title="Berechnungsergebnis kopieren"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-300" />
                <span className="hidden xs:inline">Kopiert!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Kopieren</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

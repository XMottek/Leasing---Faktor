import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  collection,
  onSnapshot,
  deleteDoc,
  query,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { SavedOffer } from '../types/leasing';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// CRITICAL: Must use firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore error reporting specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test initial connection to Firestore
export async function testFirestoreConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears offline.');
    }
  }
}

// User sign in with Google Popup
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Sync profile to /users/{uid}
    if (result.user) {
      const userRef = doc(db, 'users', result.user.uid);
      const userDoc = {
        userId: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || '',
        createdAt: new Date().toISOString(),
      };
      try {
        await setDoc(userRef, userDoc, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${result.user.uid}`);
      }
    }
    return result.user;
  } catch (error) {
    console.error('Google Sign-in error:', error);
    throw error;
  }
}

// Sign out
export async function logOut(): Promise<void> {
  await signOut(auth);
}

// Save an offer to Firestore under users/{uid}/offers/{offerId}
export async function saveOfferToFirestore(userId: string, offer: SavedOffer): Promise<void> {
  const offerPath = `users/${userId}/offers/${offer.id}`;
  const payload = {
    id: offer.id,
    userId,
    name: offer.name,
    fahrzeugName: offer.inputs.fahrzeugName || offer.name,
    bruttolistenpreis: offer.inputs.bruttolistenpreis,
    monatlicheRate: offer.inputs.monatlicheRate,
    laufzeit: offer.inputs.laufzeit,
    anzahlung: offer.inputs.anzahlung,
    ueberfuehrungskosten: offer.inputs.ueberfuehrungskosten,
    mwstSatz: offer.inputs.mwstSatz,
    includeUeberfuehrungInFactor: offer.inputs.includeUeberfuehrungInFactor,
    fahrleistungKm: offer.inputs.fahrleistungKm,
    effektiveRateBrutto: offer.result.effektiveRateBrutto,
    bruttoLeasingfaktor: offer.result.bruttoLeasingfaktor,
    nettoLeasingfaktor: offer.result.nettoLeasingfaktor,
    gesamtkostenBrutto: offer.result.gesamtkostenBrutto,
    ratingLabel: offer.result.rating.label,
    savedAt: offer.savedAt,
  };

  try {
    await setDoc(doc(db, 'users', userId, 'offers', offer.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, offerPath);
  }
}

// Delete offer from Firestore
export async function deleteOfferFromFirestore(userId: string, offerId: string): Promise<void> {
  const offerPath = `users/${userId}/offers/${offerId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'offers', offerId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, offerPath);
  }
}

// Subscribe to real-time offers for a user
export function subscribeToUserOffers(
  userId: string,
  onOffersUpdate: (offers: SavedOffer[]) => void
) {
  const colPath = `users/${userId}/offers`;
  const q = query(collection(db, 'users', userId, 'offers'));

  return onSnapshot(
    q,
    (snapshot) => {
      const offers: SavedOffer[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: d.id || docSnap.id,
          name: d.name || 'Angebot',
          savedAt: d.savedAt || '',
          inputs: {
            fahrzeugName: d.fahrzeugName || '',
            bruttolistenpreis: d.bruttolistenpreis || 0,
            monatlicheRate: d.monatlicheRate || 0,
            laufzeit: d.laufzeit || 36,
            anzahlung: d.anzahlung || 0,
            ueberfuehrungskosten: d.ueberfuehrungskosten || 0,
            mwstSatz: d.mwstSatz || 19,
            includeUeberfuehrungInFactor: d.includeUeberfuehrungInFactor || false,
            fahrleistungKm: d.fahrleistungKm || 10000,
          },
          result: {
            effektiveRateBrutto: d.effektiveRateBrutto || 0,
            bruttoLeasingfaktor: d.bruttoLeasingfaktor || 0,
            nettoLeasingfaktor: d.nettoLeasingfaktor || 0,
            gesamtkostenBrutto: d.gesamtkostenBrutto || 0,
            nettoBruttolistenpreis: 0,
            nettoEffektiveRate: 0,
            nettoMonatlicheRate: 0,
            nettoAnzahlung: 0,
            nettoUeberfuehrungskosten: 0,
            gesamtkostenNetto: 0,
            gesamtMwSt: 0,
            anzahlungProMonat: 0,
            ueberfuehrungProMonat: 0,
            gesamtkostenFaktor: 0,
            kostenPro1000Uvp: 0,
            rating: {
              category: 'good',
              label: d.ratingLabel || 'Gut',
              badgeBg: 'bg-cyan-500/15',
              badgeText: 'text-cyan-400',
              badgeBorder: 'border-cyan-500/30',
              textColor: 'text-cyan-400',
              gradient: 'from-cyan-500 to-blue-400',
              description: '',
              rangeText: '',
            },
            isValid: true,
          },
        };
      });
      onOffersUpdate(offers);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, colPath);
    }
  );
}

export { onAuthStateChanged };
export type { User };

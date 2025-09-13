import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Colony } from '../types';
import { initialColony } from '../constants/gameData';

export const getPlayerColony = async (uid: string): Promise<Colony | null> => {
    if (!db) {
        console.warn("Firestore is not available for getPlayerColony.");
        return null;
    }
    try {
        const colonyRef = doc(db, 'colonies', uid);
        const docSnap = await getDoc(colonyRef);
        if (docSnap.exists()) {
            return docSnap.data() as Colony;
        }
        return null;
    } catch (error) {
        console.error("Error fetching player colony:", error);
        return null;
    }
};

export const createPlayerColony = async (uid: string, email: string): Promise<Colony> => {
    const newColony: Colony = {
        ...initialColony,
        id: uid,
        name: `${email.split('@')[0]}'s Bastion`,
    };
    if (!db) {
         console.warn("Firestore is not available for createPlayerColony. Returning mock colony.");
         return newColony;
    }
    const colonyRef = doc(db, 'colonies', uid);
    await setDoc(colonyRef, newColony);
    return newColony;
};

export const updatePlayerColony = async (uid: string, colonyData: Colony): Promise<void> => {
    if (!db) {
         console.warn("Firestore is not available for updatePlayerColony.");
         return;
    }
    try {
        const colonyRef = doc(db, 'colonies', uid);
        await setDoc(colonyRef, colonyData);
    } catch (error) {
        console.error("Error updating player colony:", error);
    }
};
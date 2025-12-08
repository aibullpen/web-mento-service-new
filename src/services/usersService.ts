import { db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, increment, serverTimestamp, collection, getDocs, onSnapshot } from 'firebase/firestore';
import type { User } from 'firebase/auth';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    status: 'pending' | 'approved' | 'rejected';
    role: 'user' | 'admin';
    lastLogin: any;
    firstLogin: any;
    loginCount: number;
}

const ADMIN_EMAILS = [
    'ai.bullpen@gmail.com',
    'kcorn1@gmail.com',
    'kcorn2@gmail.com',
    'kcorn3@gmail.com',
    'kcorn4@gmail.com',
    'kcorn5@gmail.com',
    'kcorn6@gmail.com',
    'kcorn7@gmail.com',
    'kcorn8@gmail.com',
    'kcorn9@gmail.com',
    'kcorn10@gmail.com'
];

export const syncUser = async (user: User) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    const isAdmin = user.email && ADMIN_EMAILS.includes(user.email);
    const defaultStatus = isAdmin ? 'approved' : 'pending';
    const defaultRole = isAdmin ? 'admin' : 'user';

    if (userSnap.exists()) {
        await updateDoc(userRef, {
            lastLogin: serverTimestamp(),
            loginCount: increment(1),
            photoURL: user.photoURL,
            displayName: user.displayName,
            // Ensure admins always have admin role/status if they are in the list (optional, enables recovery)
            ...(isAdmin ? { role: 'admin', status: 'approved' } : {})
        });
    } else {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            status: defaultStatus,
            role: defaultRole,
            firstLogin: serverTimestamp(),
            lastLogin: serverTimestamp(),
            loginCount: 1,
        });
    }
};

export const listenToUserProfile = (uid: string, callback: (profile: UserProfile | null) => void) => {
    return onSnapshot(doc(db, 'users', uid), (doc) => {
        if (doc.exists()) {
            callback(doc.data() as UserProfile);
        } else {
            callback(null);
        }
    });
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => doc.data() as UserProfile);
};

export const updateUserStatus = async (uid: string, status: 'pending' | 'approved' | 'rejected') => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { status });
};

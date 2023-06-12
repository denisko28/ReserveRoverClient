import { useEffect, useState } from 'react';
import { ConfirmationResult, RecaptchaVerifier, User, sendEmailVerification, signInWithEmailAndPassword, signInWithPhoneNumber, signOut, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, storage } from '../services/firebase-config';
import { clearUserInfo, getManagersPlaceInfo, setUserRole } from '../redux/slices/userInfoSlice';
import axiosInstance from '../services/axios-config';
import { useAppDispatch } from './redux-hooks';

export enum UserRoles {
    User = "User",
    Manager = "Manager",
    Moderator = "Moderator",
    Admin = "Admin"
}

declare global {
    interface Window { recaptchaVerifier: RecaptchaVerifier; confirmationResult: ConfirmationResult; }
}

export default function useAuth() {
    const dispatch = useAppDispatch();
    const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        auth.onAuthStateChanged(firebaseUser => {
            setCurrentUser(firebaseUser);
            setIsLoading(false);
        });
    }, [])

    const restorePassword = async (email: string) => {
        setIsLoading(true);
        try {
            const result: any = await sendPasswordResetEmail(auth, email);
            return result;
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
        return null;
    }

    const sendVerifEmail = async () => {
        if (!currentUser)
            return;

        setIsLoading(true);
        try {
            const result: any = await sendEmailVerification(currentUser);
            return result;
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
        return null;
    }

    const registerManager = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            debugger;
            const result: any = await axiosInstance.post("/identity/registerManager", {
                email,
                password
            });
            
            setCurrentUser(null);
            return result;
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
        return null;
    }

    const signInWithEmailAndPasswordRequest = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const idTokenResult = await result.user.getIdTokenResult();
            const userRole = idTokenResult.claims['role'];
            dispatch(setUserRole(userRole));

            debugger;
            if(userRole === "Manager") {
                dispatch(getManagersPlaceInfo(result.user.uid));
            }

            return result;
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
        return null;
    }

    const signInWithPhoneNumberRequest = async (phoneNumber: string) => {
        setIsLoading(true);
        try {
            setUpRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            window.confirmationResult = confirmationResult;
            return confirmationResult;
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
        return null;
    }

    const otpConfirmation = async (optCode: string) => {
        setIsLoading(true);
        try {
            const optConfirm = window.confirmationResult;
            const result = await optConfirm.confirm(optCode);
            dispatch(setUserRole(UserRoles.User))
            return result;
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
        return null;
    }

    const setUpRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
                size: 'invisible',
                callback: () => {
                    console.log("Captcha Resolved");
                }
            }, auth);
        }
    }

    const setUserName = async (displayName: string) => {
        setIsLoading(true);
        try {
            if (!auth.currentUser)
                return;

            await updateProfile(auth.currentUser, { displayName });
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    const setUserPhoto = async (userPhoto: File) => {
        setIsLoading(true);
        try {
            if (!auth.currentUser)
                return "";

            const fileRef = ref(storage, auth.currentUser.uid + ".png");
            await uploadBytes(fileRef, userPhoto);
            const photoURL = await getDownloadURL(fileRef);

            await updateProfile(auth.currentUser, { photoURL });
            return photoURL;
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
        return "";
    }

    const signOutRequest = async () => {
        setIsLoading(true);
        try {
            await signOut(auth);
            dispatch(clearUserInfo());
            setCurrentUser(null);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        currentUser, isLoading, restorePassword, sendVerifEmail, registerManager, signInWithEmailAndPasswordRequest, otpConfirmation,
        signInWithPhoneNumberRequest, setUserName, setUserPhoto, signOutRequest
    };
}
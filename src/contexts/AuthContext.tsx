import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string;
}

type AuthcontextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const Authcontext = createContext({} as AuthcontextType);

export function AuthContextProvider(props: AuthContextProviderProps) {


    const [user, setUser] = useState<User>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const { displayName, photoURL, uid } = user

                if (!displayName || !photoURL) {
                    throw new Error('Missing information from Google Account.');
                }
                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })
            }
        })
        return () => {
            unsubscribe();
        }

    }, [])


    async function signInWithGoogle() {
        const provinder = new firebase.auth.GoogleAuthProvider();

        const result = await auth.signInWithPopup(provinder);



        if (result.user) {
            const { displayName, photoURL, uid } = result.user

            if (!displayName || !photoURL) {
                throw new Error('Missing information from Google Account');
            }
            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    }



    return (

        <Authcontext.Provider value={{ user, signInWithGoogle }}>
            {props.children}

        </Authcontext.Provider>
    );
}
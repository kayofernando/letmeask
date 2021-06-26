import { useContext } from 'react';
import { Authcontext } from '../contexts/AuthContext';

export function useAuth() {
    const value = useContext(Authcontext)

    return value

}


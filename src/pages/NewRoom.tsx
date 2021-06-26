import { Link, useHistory } from 'react-router-dom';
import { FormEvent } from 'react';

import illustrationImg from '../images/illustration.svg';
import logoImg from '../images/logo.svg';
//import googleIconImg from '../images/google-icon.svg';

import { Button } from '../components/Buttons';

import '../styles/auth.scss';
//import { useContext } from 'react';
//import { Authcontext } from '../contexts/AuthContext';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { database } from '../services/firebase';
//import userEvent from '@testing-library/user-event';


export function NewRoom() {
    const { user } = useAuth()

    const history = useHistory()

    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if (newRoom.trim() === '') {
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,


        })

        history.push(`/rooms/${firebaseRoom.key}`)

    }


    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire suas duvidas a duvida da sua audiencia em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar Sala
                        </Button>

                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/"> clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>

    )
}
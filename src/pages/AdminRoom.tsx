import { useHistory, useParams } from 'react-router-dom'
import logoImg from '../images/logo.svg';
import deleteImg from '../images/delete.svg';
import checkImg from '../images/check.svg';
import answerImg from '../images/answer.svg';

import { Button } from '../components/Buttons';
import { RoomCode } from '../components/RoomCode';

import '../styles/room.scss';
import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { useEffect } from 'react';

import { Question } from '../components/Question/Teste';
import { useRoom } from '../hooks/useRoom';

//import { type } from 'os';







type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const { user } = useAuth();

    const history = useHistory();
    const params = useParams<RoomParams>();

    const [newQuestion, setNewQuestion] = useState('');
    const roomId = params.id;

    const { title, questions } = useRoom(roomId)

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })
        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem Certeza que você deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })

    }

    async function handleHighLightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        })

    }



    async function handleSendQuestion(event: FormEvent) {

        event.preventDefault();

        if (newQuestion.trim() === '') {
            return;
        }


        if (!user) {
            throw new Error('You must be Logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,

            },
            isHighlighted: false,
            isAnswered: false
        };
        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion('');

    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>

                </div>

            </header>

            <main>
                <div className="room-title">
                    <h1> Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}


                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}

                                        >

                                            <img src={checkImg} alt="Marcar pergunta como respondida" />

                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighLightQuestion(question.id)}

                                        >

                                            <img src={answerImg} alt="Dar destaque à pergunta" />

                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}

                                >

                                    <img src={deleteImg} alt="Remover pergunta" />

                                </button>
                            </Question>
                        )
                    })}
                </div>




            </main>
        </div>
    );
}
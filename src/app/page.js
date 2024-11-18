"use client"

import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const teamHealthData = {
    '2024-05': [
        { aspect: 'Colaboración', score: 7.2 },
        { aspect: 'Comunicación', score: 7.0 },
        { aspect: 'Adaptabilidad', score: 7.5 },
        { aspect: 'Cumplimiento de objetivos', score: 7.8 },
        { aspect: 'Ambiente de trabajo', score: 8.0 },
    ],
    '2024-06': [
        { aspect: 'Colaboración', score: 7.5 },
        { aspect: 'Comunicación', score: 7.3 },
        { aspect: 'Adaptabilidad', score: 7.8 },
        { aspect: 'Cumplimiento de objetivos', score: 8.0 },
        { aspect: 'Ambiente de trabajo', score: 8.2 },
    ],
    '2024-07': [
        { aspect: 'Colaboración', score: 7.6 },
        { aspect: 'Comunicación', score: 7.5 },
        { aspect: 'Adaptabilidad', score: 8.0 },
        { aspect: 'Cumplimiento de objetivos', score: 7.9 },
        { aspect: 'Ambiente de trabajo', score: 8.1 },
    ],
    '2024-08': [
        { aspect: 'Colaboración', score: 7.8 },
        { aspect: 'Comunicación', score: 8.0 },
        { aspect: 'Adaptabilidad', score: 8.5 },
        { aspect: 'Cumplimiento de objetivos', score: 8.2 },
        { aspect: 'Ambiente de trabajo', score: 8.5 },
    ],
    '2024-09': [
        { aspect: 'Colaboración', score: 8.2 },
        { aspect: 'Comunicación', score: 8.5 },
        { aspect: 'Adaptabilidad', score: 8.7 },
        { aspect: 'Cumplimiento de objetivos', score: 8.4 },
        { aspect: 'Ambiente de trabajo', score: 8.7 },
    ]
}

const questions = [
    {
        question: "¿Cómo es la colaboración en el equipo?",
        positive: "El equipo se multiplica, compartiendo perspectivas, contexto e innovaciones con otros equipos y otras partes de la organización.",
        negative: "El trabajo se realiza individualmente. Hay poca o ninguna colaboración dentro del equipo o con otros equipos.",
        aspect: "Colaboración"
    },
    {
        question: "¿Cómo es la comunicación dentro del equipo?",
        positive: "La comunicación es abierta, transparente y constructiva.",
        negative: "La comunicación es cerrada, y hay poca transparencia entre los miembros del equipo.",
        aspect: "Comunicación"
    },
    {
        question: "¿Cómo se adapta el equipo a los cambios?",
        positive: "El equipo es flexible y busca formas de ajustarse rápidamente a los cambios o nuevos desafíos.",
        negative: "El equipo es rígido y tiene dificultades para adaptarse a cambios o situaciones imprevistas.",
        aspect: "Adaptabilidad"
    },
    {
        question: "¿Cómo es el cumplimiento de los objetivos del sprint?",
        positive: "El equipo cumple consistentemente con los objetivos planteados, alcanzando las metas definidas.",
        negative: "El equipo no es consistente en cumplir con los objetivos del sprint, dejando tareas pendientes o mal ejecutadas.",
        aspect: "Cumplimiento de objetivos"
    },
    {
        question: "¿Cómo describirías el ambiente de trabajo en el equipo?",
        positive: "El equipo tiene un ambiente positivo donde todos se sienten valorados, motivados y apoyados.",
        negative: "El ambiente es negativo, y los miembros solo se centran en cumplir tareas sin interés en el equipo.",
        aspect: "Ambiente de trabajo"
    },
];


export default function AgileHealthBarometer() {
    const [currentScreen, setCurrentScreen] = useState('main')
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedMonth1, setSelectedMonth1] = useState('2024-09')
    const [selectedMonth2, setSelectedMonth2] = useState('2024-08')
    const [userResponses, setUserResponses] = useState([null, null, null, null, null])
    const [evaluationCompleted, setEvaluationCompleted] = useState(false)

    const handleEvaluationSubmission = () => {
        if (userResponses.every(response => response !== null)) {
            const currentDate = new Date();
            const yearMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;

            const evaluationResults = userResponses.map(response => ({
                aspect: response.aspect,
                score: response.response === 'positive' ? 10 : 0
            }));

            if (teamHealthData[yearMonth]) {
                teamHealthData[yearMonth] = teamHealthData[yearMonth].map(item => {
                    const result = evaluationResults.find(res => res.aspect === item.aspect);
                    return result ? { ...item, score: result.score } : item;
                });
            } else {
                teamHealthData[yearMonth] = evaluationResults;
            }

            setEvaluationCompleted(true);
            setCurrentScreen('results');
        } else {
            Swal.fire({
                title: "Encuesta no completada",
                text: "Por favor, responde todas las preguntas antes de continuar.",
                icon: "warning"
            });
        }
    };

    const renderMainScreen = () => (
        <div className="bg-white rounded-lg shadow-md mb-8 p-6">
            <div className="mb-4">
                <h2 className="text-2xl font-bold">Equipo Ágil Alpha - Evaluación de Septiembre</h2>
                <p className="text-gray-600">Resumen de la salud del equipo</p>
            </div>
            <div className="h-[300px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamHealthData['2024-09']}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="aspect" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <h3 className="text-xl font-semibold mb-2">Resumen de la Evaluación Actual</h3>
                <p>Puntuación promedio: 8.5</p>
                <p>Puntos fuertes: Adaptabilidad, Ambiente de trabajo</p>
                <p>Áreas de mejora: Colaboración, Cumplimiento de objetivos</p>
            </div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                    setCurrentScreen('evaluation')
                    setCurrentQuestion(0)
                    setUserResponses([])
                    setEvaluationCompleted(false)
                }}
            >
                Iniciar Nueva Evaluación
            </button>
        </div>
    )



    const renderEvaluationScreen = () => (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Evaluación de Salud del Equipo</h2>
            {questions.map((question, index) => (
                <div key={index} className="border-b pb-4 mb-4">
                    <p className="text-gray-600 mb-4 text-lg font-semibold">
                        {index + 1}. {question.question}
                    </p>
                    <div className="flex justify-between space-x-4">
                        <button
                            className={`text-left ${userResponses[index]?.response === 'negative'
                                ? 'border-4 border-red-600 bg-red-100'
                                : 'border border-gray-300 bg-gray-100 hover:bg-gray-200'
                                } text-gray-700 font-medium py-4 px-6 rounded-lg text-lg w-full shadow-md transition-all`}
                            onClick={() =>
                                setUserResponses((prev) => {
                                    const newResponses = [...prev];
                                    if (newResponses[index]?.response === 'negative') {
                                        newResponses[index] = null;
                                    } else {
                                        newResponses[index] = { ...question, response: 'negative' };
                                    }
                                    return newResponses;
                                })
                            }
                        >
                            {question.negative}
                        </button>
                        <button
                            className={`text-left ${userResponses[index]?.response === 'positive'
                                ? 'border-4 border-green-600 bg-green-100'
                                : 'border border-gray-300 bg-gray-100 hover:bg-gray-200'
                                } text-gray-700 font-medium py-4 px-6 rounded-lg text-lg w-full shadow-md transition-all`}
                            onClick={() =>
                                setUserResponses((prev) => {
                                    const newResponses = [...prev];
                                    if (newResponses[index]?.response === 'positive') {
                                        newResponses[index] = null;
                                    } else {
                                        newResponses[index] = { ...question, response: 'positive' };
                                    }
                                    return newResponses;
                                })
                            }
                        >
                            {question.positive}
                        </button>
                    </div>
                </div>
            ))}
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 w-auto ml-auto block"
                onClick={handleEvaluationSubmission}
            >
                Enviar Evaluación
            </button>
        </div>
    );


    const renderComparisonScreen = () => {
        const combinedData = teamHealthData[selectedMonth1].map((item, index) => ({
            aspect: item.aspect,
            [selectedMonth1]: item.score,
            [selectedMonth2]: teamHealthData[selectedMonth2][index].score
        }))

        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Comparación de Evaluaciones</h2>
                <div className="flex justify-between mb-4">
                    <select
                        className="block w-5/12 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        value={selectedMonth1}
                        onChange={(e) => setSelectedMonth1(e.target.value)}
                    >
                        {Object.keys(teamHealthData).map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                    <select
                        className="block w-5/12 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        value={selectedMonth2}
                        onChange={(e) => setSelectedMonth2(e.target.value)}
                    >
                        {Object.keys(teamHealthData).map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
                <div className="h-[400px] mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={combinedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="aspect" />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey={selectedMonth1} fill="#8884d8" />
                            <Bar dataKey={selectedMonth2} fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-lg font-semibold mb-2">Análisis de tendencias:</p>
                <p>
                    Comparando {selectedMonth1} con {selectedMonth2}, se observa
                    {combinedData.every(item => item[selectedMonth1] >= item[selectedMonth2])
                        ? " una mejora en todos los aspectos."
                        : " cambios variados en los diferentes aspectos."}
                    {" "}Los cambios más notables son en{" "}
                    {combinedData.reduce((max, item) =>
                        Math.abs(item[selectedMonth1] - item[selectedMonth2]) > Math.abs(max[selectedMonth1] - max[selectedMonth2]) ? item : max
                    ).aspect.toLowerCase()}.
                </p>
            </div>
        )
    }

    const renderResultsScreen = () => {
        const calculateScore = (response) => response === 'positive' ? 10 : 0
        const userScores = userResponses.map(response => ({
            aspect: response?.aspect,
            score: calculateScore(response?.response)
        }))

        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-2">Resultados de la Evaluación</h2>
                <p className="text-gray-600 mb-4">Resumen de tu evaluación reciente</p>
                {evaluationCompleted ? (
                    <>
                        <div className="h-[300px] mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={userScores}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="aspect" />
                                    <YAxis domain={[0, 10]} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="score" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4 mb-6">
                            <h3 className="text-xl font-semibold mb-2">Análisis de Resultados</h3>
                            <p>
                                Basado en tus respuestas, los aspectos más fuertes del equipo son:{' '}
                                {userScores.filter(item => item.score === 10).map(item => item.aspect).join(', ')}.
                            </p>
                            <p>
                                Las áreas que necesitan mejora son:{' '}
                                {userScores.filter(item => item.score === 0).map(item => item.aspect).join(', ')}.
                            </p>
                        </div>
                    </>
                ) : (
                    <p>No hay resultados disponibles. Por favor, completa una evaluación primero.</p>
                )}
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        setCurrentScreen('evaluation')
                        setCurrentQuestion(0)
                        setUserResponses([])
                        setEvaluationCompleted(false)
                    }}
                >
                    Iniciar Nueva Evaluación
                </button>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <nav className="flex">
                    <button
                        className={`mr-1 py-2 px-4 rounded-t ${currentScreen === 'main' ? 'bg-white' : 'bg-gray-200'}`}
                        onClick={() => setCurrentScreen('main')}
                    >
                        Principal
                    </button>
                    <button
                        className={`mr-1 py-2 px-4 rounded-t ${currentScreen === 'evaluation' ? 'bg-white' : 'bg-gray-200'}`}
                        onClick={() => setCurrentScreen('evaluation')}
                    >
                        Evaluación
                    </button>
                    <button
                        className={`mr-1 py-2 px-4 rounded-t ${currentScreen === 'comparison' ? 'bg-white' : 'bg-gray-200'}`}
                        onClick={() => setCurrentScreen('comparison')}
                    >
                        Comparación
                    </button>
                    <button
                        className={`py-2 px-4 rounded-t ${currentScreen === 'results' ? 'bg-white' : 'bg-gray-200'}`}
                        onClick={() => setCurrentScreen('results')}
                    >
                        Resultados
                    </button>
                </nav>
            </div>
            {currentScreen === 'main' && renderMainScreen()}
            {currentScreen === 'evaluation' && renderEvaluationScreen()}
            {currentScreen === 'comparison' && renderComparisonScreen()}
            {currentScreen === 'results' && renderResultsScreen()}
        </div>
    )
}
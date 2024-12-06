import React, { useState, useEffect } from 'react'
import { fetchQuizData, Question } from '../api/quizApi'

interface QuizCardProps {
    category: string
    difficulty: string
}

const QuizCard: React.FC<QuizCardProps> = ({ category, difficulty }) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [selectedAnswers, setSelectedAnswers] = useState<
        Record<number, string>
    >({})
    const [feedback, setFeedback] = useState<string[]>([])
    const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const quizData = await fetchQuizData(10, category, difficulty)

                // Blanda svaren när quizet startar
                const shuffledData = quizData.map((question) => {
                    const allAnswers = [
                        ...question.incorrect_answers,
                        question.correct_answer
                    ]
                    // Blanda svaren
                    for (let i = allAnswers.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1))
                        ;[allAnswers[i], allAnswers[j]] = [
                            allAnswers[j],
                            allAnswers[i]
                        ]
                    }
                    return { ...question, allAnswers } // Lägg till de blandade svaren
                })

                setShuffledQuestions(shuffledData) // Sätt de blandade frågorna
            } catch (error) {
                console.error('Error loading questions', error)
            } finally {
                setLoading(false)
            }
        }

        loadQuestions()
    }, [category, difficulty])

    const handleAnswerChange = (
        questionIndex: number,
        selectedAnswer: string
    ) => {
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionIndex]: selectedAnswer
        }))

        if (
            selectedAnswer === shuffledQuestions[questionIndex].correct_answer
        ) {
            setFeedback((prevFeedback) => {
                const newFeedback = [...prevFeedback]
                newFeedback[questionIndex] = 'Ditt svar är rätt!'
                return newFeedback
            })
        } else {
            setFeedback((prevFeedback) => {
                const newFeedback = [...prevFeedback]
                newFeedback[questionIndex] = 'Ditt svar är fel!'
                return newFeedback
            })
        }
    }

    if (loading) return <div className="text-center text-xl">Loading...</div>

    return (
        <div className="max-w-3xl mx-auto p-4">
            {shuffledQuestions.map((question, index) => (
                <div key={index} className="mb-6 p-4 border-b">
                    <p className="font-semibold mb-2">{question.question}</p>

                    <div className="space-y-2">
                        {question.allAnswers.map(
                            (answer: string, idx: number) => (
                                <label
                                    key={idx}
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5"
                                        checked={
                                            selectedAnswers[index] === answer
                                        }
                                        onChange={() =>
                                            handleAnswerChange(index, answer)
                                        }
                                    />
                                    <span>{answer}</span>
                                </label>
                            )
                        )}
                    </div>

                    {/* Show feedback */}
                    {selectedAnswers[index] && (
                        <p
                            className={`mt-2 text-sm ${
                                selectedAnswers[index] ===
                                question.correct_answer
                                    ? 'text-green-500'
                                    : 'text-red-500'
                            }`}
                        >
                            {feedback[index]}
                        </p>
                    )}
                </div>
            ))}
        </div>
    )
}

export default QuizCard

import React, { useState, useEffect } from 'react';
import { fetchQuizData, Question } from '../api/quizApi';
import Summary from '../components/Summary';

interface QuizCardProps {
    category: string;
    difficulty: string;
}

const QuizCard: React.FC<QuizCardProps> = ({ category, difficulty }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<number, { selected: string; correct: boolean }>>({});

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const quizData = await fetchQuizData(10, category, difficulty);
                setQuestions(
                    quizData.map((question) => ({
                        ...question,
                        allAnswers: shuffleArray([...question.incorrect_answers, question.correct_answer]),
                    }))
                );
            } catch (err) {
                console.error('Error loading questions', err);
                setError('Kunde inte ladda frågorna. Försök igen senare.');
            } finally {
                setLoading(false);
            }
        };

        loadQuestions();
    }, [category, difficulty]);

    const handleAnswerChange = (questionIndex: number, selectedAnswer: string) => {
        const correct = selectedAnswer === questions[questionIndex].correct_answer;
        setAnswers((prev) => ({
            ...prev,
            [questionIndex]: { selected: selectedAnswer, correct },
        }));
    };

    // Beräkna antal rätt
    const correctAnswersCount = Object.values(answers).filter((answer) => answer.correct).length;

    // Kontrollera om alla frågor är besvarade
    const allAnswered = Object.keys(answers).length === questions.length;

    if (loading) return <div className="text-center text-xl">Loading...</div>;
    if (error) return <div className="text-center text-xl text-red-500">{error}</div>;

    return (
        <div className="max-w-3xl mx-auto p-4">
            {!allAnswered ? (
                questions.map((question, index) => (
                    <div key={index} className="mb-6 p-4 border-b">
                        <p className="font-semibold mb-2">{question.question}</p>
                        <div className="space-y-2">
                            {question.allAnswers.map((answer, idx) => (
                                <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`question-${index}`}
                                        className="w-5 h-5"
                                        checked={answers[index]?.selected === answer}
                                        onChange={() => handleAnswerChange(index, answer)}
                                    />
                                    <span>{answer}</span>
                                </label>
                            ))}
                        </div>
                        {answers[index]?.selected && (
                            <p
                                className={`mt-2 text-sm ${
                                    answers[index]?.correct ? 'text-green-500' : 'text-red-500'
                                }`}
                            >
                                {answers[index]?.correct ? 'Ditt svar är rätt!' : 'Ditt svar är fel!'}
                            </p>
                        )}
                    </div>
                ))
            ) : (
                // Summeringsdelen som en separat komponent
                <Summary
                    correctAnswersCount={correctAnswersCount}
                    totalQuestions={questions.length}
                    onRetry={() => window.location.reload()} // Skicka retry-funktionen här
                />
            )}
        </div>
    );
};

const shuffleArray = (array: string[]): string[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export default QuizCard;

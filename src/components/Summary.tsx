import React from 'react'

interface SummaryProps {
    correctAnswersCount: number
    totalQuestions: number
    onRetry: () => void
}

const Summary: React.FC<SummaryProps> = ({
    correctAnswersCount,
    totalQuestions,
    onRetry
}) => {
    return (
        <div className="text-center mt-8" data-testid="summary">
            <h2 className="text-2xl font-bold" data-testid="summary-title">
                Sammanfattning
            </h2>
            <p className="text-lg mt-4" data-testid="summary-text">
                Du fick{' '}
                <span className="font-bold" data-testid="correct-count">
                    {correctAnswersCount}
                </span>{' '}
                av{' '}
                <span className="font-bold" data-testid="total-count">
                    {totalQuestions}
                </span>{' '}
                rätt!
            </p>
            <button
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={onRetry}
                data-testid="retry-button"
            >
                Försök igen
            </button>
        </div>
    )
}

export default Summary

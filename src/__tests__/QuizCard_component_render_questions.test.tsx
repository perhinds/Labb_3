import { render, screen, waitFor } from '@testing-library/react';
import QuizCard from '../components/QuizCard';
import { fetchQuizData } from '../api/quizApi';
import '@testing-library/jest-dom';

// Mocka API-anropet
jest.mock('../api/quizApi', () => ({
    fetchQuizData: jest.fn(),
}));

const mockQuestions = [
    {
        question: 'Vad är huvudstaden i Sverige?',
        correct_answer: 'Stockholm',
        incorrect_answers: ['Göteborg', 'Malmö', 'Uppsala'],
        allAnswers: ['Göteborg', 'Malmö', 'Uppsala', 'Stockholm'],
    },
    {
        question: 'Vilket år landade Apollo 11 på månen?',
        correct_answer: '1969',
        incorrect_answers: ['1970', '1968', '1971'],
        allAnswers: ['1970', '1968', '1971', '1969'],
    },
];

describe('QuizCard', () => {
    beforeEach(() => {
        (fetchQuizData as jest.Mock).mockResolvedValue(mockQuestions);
    });

    test('renderar och visar frågorna korrekt', async () => {
        render(<QuizCard category="9" difficulty="easy" />);

        // Kontrollera att laddningstext visas först
        expect(screen.getByText(/loading.../i)).toBeInTheDocument();

        // Vänta tills frågorna laddas
        await waitFor(() => {
            expect(screen.getByText(/Vad är huvudstaden i Sverige\?/i)).toBeInTheDocument();
            expect(screen.getByText(/Vilket år landade Apollo 11 på månen\?/i)).toBeInTheDocument();
        });
    });
});

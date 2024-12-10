import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuizCard from '../components/QuizCard';
import { fetchQuizData } from '../api/quizApi';
import '@testing-library/jest-dom';

jest.mock('../api/quizApi', () => ({
    fetchQuizData: jest.fn(),
}));

// Mocka mat-relaterade frågor
const mockQuestions = [
    {
        question: "Vad är huvudingredienserna i en traditionell pizza Margherita?",
        correct_answer: "Tomat, mozzarella, basilika",
        incorrect_answers: ["Kyckling, ost, grönsaker", "Tomat, kyckling, oliver", "Bacon, ägg, ost"],
    },
    {
        question: "Vilken grönsak används för att göra guacamole?",
        correct_answer: "Avokado",
        incorrect_answers: ["Tomat", "Morot", "Potatis"],
    }
];

describe('QuizCard', () => {
    beforeEach(() => {
        (fetchQuizData as jest.Mock).mockResolvedValue(mockQuestions);
    });

    test('visar summering när alla frågor är besvarade', async () => {
        render(<QuizCard category="22" difficulty="easy" />);

        // Vänta på att frågorna renderas
        await waitFor(() => {
            expect(screen.getByText(/Vad är huvudingredienserna i en traditionell pizza Margherita\?/i)).toBeInTheDocument();
        });

        // Svara på den första frågan
        const firstAnswer = screen.getByLabelText(/Tomat, mozzarella, basilika/i); // Rätt svar för första frågan
        fireEvent.click(firstAnswer);

        // Svara på den andra frågan
        const secondAnswer = screen.getByLabelText(/Avokado/i); // Rätt svar för andra frågan
        fireEvent.click(secondAnswer);

        // Vänta på att summeringen ska dyka upp
        await waitFor(() => {
            // Kontrollera att summeringens text dyker upp
            expect(screen.getByTestId('summary')).toBeInTheDocument();
            expect(screen.getByTestId('summary-title')).toHaveTextContent('Sammanfattning');
            expect(screen.getByTestId('summary-text')).toHaveTextContent('Du fick 2 av 2 rätt!');
        });
    });

    test('kallar onRetry när Försök igen-knappen klickas', async () => {
        const mockRetry = jest.fn();
        render(<QuizCard category="22" difficulty="easy" />);

        // Vänta på att frågorna renderas
        await waitFor(() => {
            expect(screen.getByText(/Vad är huvudingredienserna i en traditionell pizza Margherita\?/i)).toBeInTheDocument();
        });

        // Svara på frågorna
        const firstAnswer = screen.getByLabelText(/Tomat, mozzarella, basilika/i);
        fireEvent.click(firstAnswer);

        const secondAnswer = screen.getByLabelText(/Avokado/i);
        fireEvent.click(secondAnswer);

        // Vänta på att summeringen ska dyka upp
        await waitFor(() => {
            expect(screen.getByTestId('retry-button')).toBeInTheDocument();
        });

        // Klicka på retry-knappen
        fireEvent.click(screen.getByTestId('retry-button'));

        // Kontrollera att retry-funktionen anropades
        expect(mockRetry).toHaveBeenCalledTimes(1);
    });
});

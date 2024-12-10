import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import QuizCard from '../components/QuizCard';
import { fetchQuizData } from '../api/quizApi';

jest.mock('../api/quizApi', () => ({
  fetchQuizData: jest.fn(),
}));

const mockQuestions = [
  {
    category: "Geography",
    type: "multiple",
    difficulty: "easy",
    question: "Vad är huvudstaden i Sverige?",
    correct_answer: "Stockholm",
    incorrect_answers: ["Göteborg", "Malmö", "Uppsala"],
    answers: ["Stockholm", "Göteborg", "Malmö", "Uppsala"]
  }
];

describe('QuizCard', () => {
  beforeEach(() => {
    (fetchQuizData as jest.Mock).mockResolvedValue(mockQuestions);
  });

  test('användaren kan välja ett svar', async () => {
    const user = userEvent.setup();
    render(<QuizCard category="22" difficulty="easy" />);

    await waitFor(() => {
      expect(screen.getByText(/Vad är huvudstaden i Sverige\?/i)).toBeInTheDocument();
    });

    const firstAnswer = screen.getByLabelText(/Göteborg/i);
    await user.click(firstAnswer);

    expect(firstAnswer).toBeChecked();
  });
});

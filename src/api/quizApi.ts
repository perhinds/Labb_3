// api/quizApi.ts
import axios from 'axios';

const BASE_URL = 'https://opentdb.com';

export interface Question {
  allAnswers: string[]; 
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

let token: string; // Token lagras här

// Funktion för att hämta en ny token
const fetchToken = async (): Promise<string> => {
  try {
    const response = await axios.get(`${BASE_URL}/api_token.php`, {
      params: {
        command: 'request',
      },
    });

    if (response.data.response_code === 0) {
      token = response.data.token; // Spara token
      return token;
    } else {
      throw new Error('Failed to fetch token');
    }
  } catch (error) {
    console.error('Error fetching token', error);
    throw new Error('Unable to fetch token');
  }
};

// Funktion för att hämta quizdata
export const fetchQuizData = async (
  amount: number,
  category: string,
  difficulty: string
): Promise<Question[]> => {
  try {
    // Hämta en ny token om det inte finns någon
    if (!token) {
      token = await fetchToken();
    }

    // Kontrollera att token är en string (för att lösa TypeScript-felet)
    const currentToken = token || (await fetchToken());

    const response = await axios.get(`${BASE_URL}/api.php`, {
      params: {
        amount,
        category,
        difficulty,
        type: 'multiple',
        token: currentToken,
      },
    });

    // Om token har gått ut, hämta en ny och försök igen
    if (response.data.response_code === 3) {
      console.warn('Token expired. Fetching a new token.');
      token = await fetchToken();
      return await fetchQuizData(amount, category, difficulty); // Försök igen med ny token
    }

    // Returnera frågorna om allt fungerar
    return response.data.results as Question[];
  } catch (error) {
    console.error('Error fetching quiz data', error);
    throw new Error('Unable to fetch quiz data');
  }
};

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

let tokenCache: string | null = null;

const fetchToken = async (): Promise<string> => {
  try {
    const response = await axios.get(`${BASE_URL}/api_token.php`, {
      params: { command: 'request' },
    });
    if (response.data.response_code === 0) {
      tokenCache = response.data.token;
      return tokenCache || ''; ;
    }
    throw new Error('Failed to fetch token');
  } catch (error) {
    console.error('Error fetching token', error);
    throw error;
  }
};

const getToken = async (): Promise<string> => {
  if (!tokenCache) {
    tokenCache = await fetchToken();
  }
  return tokenCache;
};

export const fetchQuizData = async (
  amount: number,
  category: string,
  difficulty: string
): Promise<Question[]> => {
  let retryCount = 0;
  while (retryCount < 2) {
    try {
      const token = await getToken();
      const response = await axios.get(`${BASE_URL}/api.php`, {
        params: {
          amount,
          category,
          difficulty,
          type: 'multiple',
          token,
        },
      });

      if (response.data.response_code === 3) {
        console.warn('Token expired. Fetching a new token.');
        tokenCache = null;
        retryCount++;
      } else {
        return response.data.results as Question[];
      }
    } catch (error) {
      console.error(`Error fetching quiz data (attempt ${retryCount + 1})`, error);
      throw error;
    }
  }
  throw new Error('Failed to fetch quiz data after multiple attempts');
};

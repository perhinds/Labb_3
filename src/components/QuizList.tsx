// components/QuizList.tsx
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import axios from 'axios'

interface Category {
    id: string
    name: string
}

const QuizList = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    // Function to fetch categories with retry logic and caching
    const fetchCategories = useCallback(async () => {
        // Check if categories are cached in localStorage
        const cachedCategories = localStorage.getItem('categories')
        if (cachedCategories) {
            setCategories(JSON.parse(cachedCategories)) // Use cached categories
            return
        }

        // If no cached data, fetch from API
        try {
            const response = await axios.get(
                'https://opentdb.com/api_category.php'
            )
            const fetchedCategories = response.data.trivia_categories

            // Set categories and cache them in localStorage
            setCategories(fetchedCategories)
            localStorage.setItem(
                'categories',
                JSON.stringify(fetchedCategories)
            )
        } catch (error: unknown) {
            // Catching the error with 'unknown' type
            if (axios.isAxiosError(error)) {
                // Now 'error' is typed as AxiosError
                if (error.response && error.response.status === 429) {
                    setError('Too many requests. Please try again later.')
                    console.log('Rate limit exceeded. Retrying...')
                    await new Promise((resolve) => setTimeout(resolve, 1000)) // Retry after 1 second
                    fetchCategories() // Retry fetching data
                } else {
                    setError('Error fetching categories.')
                    console.error('Error fetching categories:', error)
                }
            } else {
                // If the error is not from Axios, we handle it generically
                setError('An unknown error occurred.')
                console.error('Unknown error:', error)
            }
        }
    }, []) // Empty dependency array ensures it doesn't change unless necessary
    // Fetch categories from API
    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    return (
        <div className="flex justify-center items-center w-full">
            <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold mb-4 text-center">
                    Tillgängliga Quiz
                </h1>

                <div className="mb-6">
                    <label
                        htmlFor="category"
                        className="block text-lg font-medium mb-2"
                    >
                        Välj en kategori:
                    </label>
                    <select
                        id="category"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="" disabled></option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedCategory && (
                    <div className="text-center">
                        <Link
                            href={`/quiz/${selectedCategory}`}
                            className="text-blue-600 hover:underline text-lg"
                        >
                            Kör igång!
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default QuizList

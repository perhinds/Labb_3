// pages/index.tsx
import React, { useState, useEffect } from 'react'
import QuizList from '../components/QuizList'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Home = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)
                setLoading(false)
            } catch (err) {
                setError(
                    'Det gick inte att hämta quizdata. Försök igen senare.'
                )
                setLoading(false)
                console.error(err)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return <div>Loading quizzes...</div>
    }

    if (error) {
        return <div className="text-red-500">{error}</div>
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex flex-col items-center justify-start flex-grow  mt-4">
                <QuizList />
            </main>
            <Footer />
        </div>
    )
}

export default Home

// pages/quiz/[id].tsx
import React from 'react'
import { useRouter } from 'next/router'
import QuizCard from '../../components/QuizCard'
import Header from '../../components/Header' // Importera Header
import Footer from '../../components/Footer' // Importera Footer

const QuizPage = () => {
    const router = useRouter()
    const { id } = router.query

    // Hantera fall där id inte är tillgängligt än (t.ex. när sidan laddas första gången)
    if (router.isFallback) {
        return <div>Loading...</div>
    }

    // Kontrollera att id finns innan du använder det
    if (!id) {
        return (
            <div className="text-red-500">
                Invalid quiz id. Please try again.
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto p-8">
                <h1 className="text-3xl mb-4 text-center">
                    quiz: {id}
                </h1>
                <QuizCard category={id as string} difficulty="easy" />
            </main>
            <Footer />
        </div>
    )
}

export default QuizPage

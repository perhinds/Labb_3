import React from 'react'
import Link from 'next/link'

const Header: React.FC = () => {
    return (
        <header
            className="bg-blue-500 text-white py-4 px-8 text-center"
            aria-label="Header">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Välkommen till quizappen
            </h1>

            <nav>
                <ul className="flex justify-center space-x-6">
                    <li>
                        <Link
                            href="/"
                            className="hover:text-blue-200 transition-colors">
                            Hem
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header

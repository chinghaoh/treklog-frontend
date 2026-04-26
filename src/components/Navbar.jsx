import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
    const { isDark, toggleTheme } = useTheme()

    return (
        <nav className="border-b border-gray-200 dark:border-[#333333] px-6 py-4 flex items-center justify-between bg-white dark:bg-[#1a1a1a]">
            <Link to="/" className="text-xl font-semibold text-gray-900 dark:text-white">
                🌍 Treklog
            </Link>

            <div className="flex items-center gap-6">
                <Link to="/countries" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    Countries
                </Link>
                <Link to="/my-countries" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    My List
                </Link>
                <button
                    onClick={toggleTheme}
                    className="text-sm px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    {isDark ? '☀️ Light' : '🌙 Dark'}
                </button>
            </div>
        </nav>
    )
}

export default Navbar
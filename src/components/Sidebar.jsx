import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/my-countries', label: 'My Countries' },
    { path: '/countries', label: 'Browse Countries' },
    { path: '/map', label: 'World Map' },
]

function Sidebar() {
    const { isDark, toggleTheme } = useTheme()
    const location = useLocation()

    return (
        <div className="w-52 h-screen border-r border-gray-200 dark:border-[#333333] bg-white dark:bg-[#1a1a1a] flex flex-col flex-shrink-0 p-4">

            <div className="flex items-center gap-2 mb-8 px-2">
                <span className="text-base font-medium text-gray-900 dark:text-white">🌍 Treklog</span>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-2">Menu</p>
                {navItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                            location.pathname === item.path
                                ? 'bg-gray-100 dark:bg-[#242424] text-gray-900 dark:text-white font-medium'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#242424]'
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="border-t border-gray-200 dark:border-[#333333] pt-4 flex flex-col gap-1">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-2">Account</p>
                <button
                    onClick={toggleTheme}
                    className="text-sm px-3 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#242424] text-left transition-colors"
                >
                    {isDark ? '☀️ Light mode' : '🌙 Dark mode'}
                </button>
            </div>

        </div>
    )
}

export default Sidebar
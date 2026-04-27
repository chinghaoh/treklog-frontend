import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { theme } from '../theme'

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
                <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
                    <span className="text-white text-xs font-medium w-full text-center">T</span>
                </div>
                <span className={`text-base font-medium ${theme.tw.textMain}`}>Treklog</span>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-2">Menu</p>
                {navItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                            location.pathname === item.path ? theme.tw.navActive : theme.tw.navInactive
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
                    className={`text-sm px-3 py-2 rounded-lg text-left transition-colors ${theme.tw.navInactive}`}
                >
                    {isDark ? '☀️ Light mode' : '🌙 Dark mode'}
                </button>
            </div>
        </div>
    )
}

export default Sidebar
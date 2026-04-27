import { useState, useEffect } from 'react'
import client from '../api/client'
import { Link } from 'react-router-dom'
import { theme } from '../theme'

function Countries() {
    const [countries, setCountries] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [continent, setContinent] = useState('')

    useEffect(() => {
        fetchCountries()
    }, [search, continent])

    const fetchCountries = async () => {
        setLoading(true)
        try {
            const params = {}
            if (search) params.search = search
            if (continent) params.continent = continent
            const response = await client.get('/countries/', { params })
            setCountries(response.data)
        } catch (error) {
            console.error('Failed to fetch countries', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">

            <h1 className={`text-2xl font-bold ${theme.tw.textMain}`}>Browse Countries</h1>

            {/* Filters */}
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Search countries..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className={`px-4 py-2 ${theme.tw.border} rounded-lg ${theme.tw.surface} ${theme.tw.textMain} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 w-64`}
                />
                <select
                    value={continent}
                    onChange={e => setContinent(e.target.value)}
                    className={`px-4 py-2 ${theme.tw.border} rounded-lg ${theme.tw.surface} ${theme.tw.textMain} focus:outline-none focus:ring-2 focus:ring-teal-500`}
                >
                    <option value="">All Continents</option>
                    <option value="AF">Africa</option>
                    <option value="AN">Antarctica</option>
                    <option value="AS">Asia</option>
                    <option value="EU">Europe</option>
                    <option value="NA">North America</option>
                    <option value="OC">Oceania</option>
                    <option value="SA">South America</option>
                </select>
            </div>

            {/* Countries grid */}
            {loading ? (
                <p className={`text-sm ${theme.tw.textMuted}`}>Loading...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {countries.map(country => (
                        <Link to={`/countries/${country.iso_code}`} key={country.id}>
                            <div className={`p-4 ${theme.tw.border} rounded-lg ${theme.tw.surface} hover:bg-gray-100 dark:hover:bg-[#2e2e2e] transition-colors cursor-pointer`}>
                                <img
                                    src={`https://flagcdn.com/48x36/${country.iso_code.toLowerCase()}.png`}
                                    alt={country.name}
                                    className="mb-2 h-8"
                                />
                                <div className={`font-medium ${theme.tw.textMain} text-sm`}>{country.name}</div>
                                <div className={`text-xs ${theme.tw.textMuted} mt-1`}>{country.capital}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

        </div>
    )
}

export default Countries
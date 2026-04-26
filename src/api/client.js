import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const DEMO_KEY = import.meta.env.VITE_DEMO_API_KEY

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${DEMO_KEY}`
    }
})

export default client
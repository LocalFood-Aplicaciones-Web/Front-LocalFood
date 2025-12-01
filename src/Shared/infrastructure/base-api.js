import axios from 'axios';

/**
 * @class BaseApi
 * @summary Base API class for HTTP communication.
 * Provides common HTTP client configuration and methods.
 */
export class BaseApi {
    #http;

    /**
     * @constructor
     * Initializes the HTTP client with base configuration.
     */
    constructor() {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        
        this.#http = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Request interceptor
        this.#http.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.#http.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error('API Error:', error);
                return Promise.reject(error);
            }
        );
    }

    /**
     * Gets the HTTP client instance.
     * @returns {Object} The axios instance.
     */
    get http() {
        return this.#http;
    }
}

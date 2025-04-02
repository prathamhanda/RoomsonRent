import { useState, useEffect } from "react";
import backendURL from "@/config/config";

const useFetch = (urlpart, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Fetching from:', backendURL + urlpart);
                const response = await fetch(backendURL + urlpart, {
                    ...options,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    }
                });
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                console.log('Fetch result:', result);
                setData(result);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [urlpart, JSON.stringify(options)]);

    return { data, loading, error };
};

export default useFetch;

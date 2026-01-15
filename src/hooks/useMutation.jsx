import { useState, useCallback } from 'react';

const useMutation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const mutate = useCallback(async (url, method, body = null) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : null
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const text = await response.text();
            const result = text ? JSON.parse(text) : {};
            
            setLoading(false);
            return result;
        } catch (err) {
            setLoading(false);
            setError(err.message);
            console.error(err);
            // throw err;
        }
    }, []);

    return { mutate, loading, error };
};

export default useMutation;




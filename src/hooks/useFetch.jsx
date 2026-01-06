import { useState, useEffect, useCallback } from 'react';

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // שימוש ב-useCallback כדי שהפונקציה לא תיווצר מחדש בכל רינדור
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const result = await response.json();
            setData(result);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setTimeout(() => setLoading(false), 600);
        }
    }, [url]);

    useEffect(() => {
        if (url) {
            fetchData();
        }
    }, [fetchData]);

    // אנחנו מחזירים גם את setData כדי שנוכל לעדכן את הרשימה מקומית אחרי מחיקה/עריכה
    return { data, loading, error, setData, refetch: fetchData };
};

export default useFetch;
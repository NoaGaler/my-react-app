import { useReducer, useEffect } from 'react';
import useFetch from './useFetch';
import useMutation from './useMutation';
import resourceReducer from './resourceReducer';

const initialState = {
    items: [],
    searchTerm: "",
    searchCriteria: "title",
    sortBy: "id"
};

const useResourceManager = (baseUrl, fetchUrl) => {
    const [state, dispatch] = useReducer(resourceReducer, initialState);

    // טעינה ראשונית - משתמש בכתובת הכוללת userId (fetchUrl)
    const { data, loading, error } = useFetch(fetchUrl);

    // פעולות שינוי - משתמש בכתובת הבסיסית (baseUrl)
    const { mutate, loading: actionLoading } = useMutation();

    // עדכון הסטייט המקומי ברגע שהנתונים מגיעים מהשרת
    useEffect(() => {
        if (data) dispatch({ type: 'SET_DATA', payload: data });
    }, [data]);

    // לוגיקת סינון ומיון גנרית המופעלת על המערך שבזיכרון
    const processedItems = [...state.items]
        .filter(item => {
            if (!state.searchTerm) return true;
            const value = item[state.searchCriteria]?.toString().toLowerCase();
            return value?.includes(state.searchTerm.toLowerCase());
        })
        .sort((a, b) => {
            const valA = a[state.sortBy];
            const valB = b[state.sortBy];
            if (typeof valA === 'number') return valA - valB;
            return String(valA).localeCompare(String(valB));
        });


    const addItem = async (newItem) => {
        try {
            // אנחנו לוקחים את כל מה שקיבלנו ב-newItem ושולחים לשרת
            // השרת יקבל גם title, גם body (עבור פוסטים) וגם completed (עבור טודוס)
            const itemToSend = {
                ...newItem // זה התיקון הקריטי!
            };

            const savedItem = await mutate(baseUrl, 'POST', itemToSend);
            dispatch({ type: 'ADD_ITEM', payload: savedItem });
        } catch (err) {
            console.error("Add failed:", err);
        }
    };

    const updateItem = async (id, updates) => {
        try {
            // עדכון משאב ספציפי לפי מזהה בכתובתbaseUrl/id
            const updatedItem = await mutate(`${baseUrl}/${id}`, 'PATCH', updates);
            dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    const removeItem = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                // מחיקת משאב ספציפי בכתובת baseUrl/id
                await mutate(`${baseUrl}/${id}`, 'DELETE');
                dispatch({ type: 'DELETE_ITEM', payload: id });
            } catch (err) {
                console.error("Delete failed:", err);
            }
        }
    };

    return {
        items: processedItems,
        loading,
        error,
        actionLoading,
        addItem,
        updateItem,
        removeItem,
        // פונקציות לעדכון מצב התצוגה (חיפוש ומיון) ב-Reducer
        setSearch: (t) => dispatch({ type: 'SET_SEARCH_TERM', payload: t }),
        setCriteria: (c) => dispatch({ type: 'SET_SEARCH_CRITERIA', payload: c }),
        setSort: (s) => dispatch({ type: 'SET_SORT_BY', payload: s }),
        searchTerm: state.searchTerm,
        searchCriteria: state.searchCriteria,
        sortBy: state.sortBy
    };
};

export default useResourceManager;
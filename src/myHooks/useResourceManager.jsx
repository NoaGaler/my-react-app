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

const useResourceManager = (baseUrl, params = {}) => {
    const [state, dispatch] = useReducer(resourceReducer, initialState);
    
    // בניית URL לקריאה בלבד עם ה-Params (למשל: todos?userId=1)
    const queryParams = new URLSearchParams(params).toString();
    const fetchUrl = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;

    const { data, loading, error } = useFetch(baseUrl ? fetchUrl : null);
    const { mutate, loading: actionLoading } = useMutation();

    useEffect(() => {
        if (data) {
            dispatch({ type: 'SET_DATA', payload: data });
        }
    }, [data]);

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
            const maxId = state.items.length > 0 
                ? Math.max(...state.items.map(i => Number(i.id))) 
                : 0;
            const itemWithId = { ...newItem, id: String(maxId + 1) };
            
            // שימוש ב-baseUrl הנקי (ללא הפרמטרים) להוספה
            const savedItem = await mutate(baseUrl, 'POST', itemWithId);
            dispatch({ type: 'ADD_ITEM', payload: savedItem });
        } catch (err) { console.error("Add failed", err); }
    };

    const updateItem = async (id, updates) => {
        try {
            // גישה ישירה ל-ID בתוך ה-baseUrl הנקי
            const updatedItem = await mutate(`${baseUrl}/${id}`, 'PATCH', updates);
            dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
        } catch (err) { console.error("Update failed", err); }
    };

    const removeItem = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                // גישה ישירה ל-ID בתוך ה-baseUrl הנקי - פותר את ה-404
                await mutate(`${baseUrl}/${id}`, 'DELETE');
                dispatch({ type: 'DELETE_ITEM', payload: id });
            } catch (err) { console.error("Delete failed", err); }
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
        setSearch: (term) => dispatch({ type: 'SET_SEARCH_TERM', payload: term }),
        setCriteria: (criteria) => dispatch({ type: 'SET_SEARCH_CRITERIA', payload: criteria }),
        setSort: (key) => dispatch({ type: 'SET_SORT_BY', payload: key }),
        searchTerm: state.searchTerm,
        searchCriteria: state.searchCriteria,
        sortBy: state.sortBy
    };
};

export default useResourceManager;
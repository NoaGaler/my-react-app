// resourceReducer.js

const resourceReducer = (state, action) => {
    switch (action.type) {
        // 1. טעינת נתונים ראשונית מהשרת
        case 'SET_DATA':
            return {
                ...state,
                items: action.payload, // הרשימה המלאה
            };

        // 2. הוספת פריט חדש
        case 'ADD_ITEM':
            return {
                ...state,
                items: [...state.items, action.payload],
            };

        // 3. עדכון פריט קיים (מתאים לעריכה וגם ל-Toggle של סטטוס)
        case 'UPDATE_ITEM':
            return {
                ...state,
                items: state.items.map(item => 
                    item.id === action.payload.id ? action.payload : item
                ),
            };

        // 4. מחיקת פריט
        case 'DELETE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
            };

        // 5. עדכון הגדרות התצוגה (חיפוש ומיון)
        case 'SET_SEARCH_TERM':
            return { ...state, searchTerm: action.payload };

        case 'SET_SEARCH_CRITERIA':
            return { ...state, searchCriteria: action.payload };

        case 'SET_SORT_BY':
            return { ...state, sortBy: action.payload };

        default:
            return state;
    }
};

export default resourceReducer;
import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import useResourceManager from '../../hooks/useResourceManager';
import TodoItem from './TodosItem'; 
import TodoModal from './TodoModal'; 
import './Todos.css';

const TodosPage = () => {
    const { currentUser } = useContext(UserContext);

    // 1. הגדרת הכתובות:
    // baseUrl משמש למחיקה/עריכה (PATCH/DELETE) - חייב להיות נקי!
    // fetchUrl משמש לטעינה ראשונית עם userId
    const baseUrl = `http://localhost:3000/todos`;
    const fetchUrl = currentUser ? `${baseUrl}?userId=${currentUser.id}` : null;

    // 2. שימוש בהוק הגנרי
    const {
        items: todos,
        loading,
        error,
        actionLoading,
        addItem,
        updateItem,
        removeItem,
        setSearch,
        setCriteria,
        setSort,
        searchTerm,
        searchCriteria,
        sortBy
    } = useResourceManager(baseUrl, fetchUrl);

    // סטייט לניהול המודאל
    const [modalConfig, setModalConfig] = useState({ 
        isOpen: false, 
        type: '', 
        todo: null 
    });

    // פונקציות עזר (סגירת המודאל בצורה בטוחה)
    const closeModal = () => {
        setModalConfig({ isOpen: false, type: '', todo: null });
    };

    const openModal = (type, todo = null) => {
        setModalConfig({ isOpen: true, type, todo });
    };

    // 3. לוגיקת השמירה
    const handleSave = async (title) => {
        try {
            if (modalConfig.type === 'add') {
                // הוספה - שולחים את ה-userId ב-Body
                await addItem({
                    userId: currentUser.id,
                    title: title,
                    completed: false
                });
            } else if (modalConfig.type === 'edit') {
                // עריכה - מעדכנים רק כותרת
                await updateItem(modalConfig.todo.id, { title: title });
            }
            closeModal();
        } catch (err) {
            console.error("Save failed:", err);
        }
    };

    if (loading) return <div className="infoWrapper"><div className="spinner"></div><p>Loading tasks...</p></div>;
    if (error) return <div className="errorContainer"><p>Error: {error}</p></div>;

    return (
        <div className="todosContainer">
            <h1 className="pageTitle">My Tasks</h1>

            <div className="todosToolbar">
                <div className="searchGroup">
                    <div className="searchChips">
                        <button 
                            className={`chip ${searchCriteria === 'title' ? 'active' : ''}`} 
                            onClick={() => setCriteria('title')}
                        >
                            Title
                        </button>
                        <button 
                            className={`chip ${searchCriteria === 'id' ? 'active' : ''}`} 
                            onClick={() => setCriteria('id')}
                        >
                            ID
                        </button>
                    </div>
                    <div className="searchField">
                        <input 
                            type="text" 
                            className="searchInput" 
                            placeholder={`Search by ${searchCriteria}...`}
                            value={searchTerm}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <span className="searchIcon">🔍</span>
                    </div>
                </div>

                <div className="actionGroup">
                    <select className="sortSelect" value={sortBy} onChange={(e) => setSort(e.target.value)}>
                        <option value="id">Sort by ID</option>
                        <option value="title">Sort by Title</option>
                        <option value="completed">Sort by Status</option>
                    </select>
                    <button className="addTodoBtn" onClick={() => openModal('add')}>+ New Task</button>
                </div>
            </div>

            <TodoModal 
                isOpen={modalConfig.isOpen}
                title={modalConfig.type === 'edit' ? "Edit Task" : "Create New Task"}
                initialValue={modalConfig.type === 'edit' ? modalConfig.todo.title : ""}
                onSave={handleSave}
                onClose={closeModal}
            />

            <div className="todosList">
                {todos && todos.length > 0 ? (
                    todos.map(todo => (
                        <TodoItem 
                            key={todo.id} 
                            todo={todo} 
                            onToggle={(id) => updateItem(id, { completed: !todo.completed })} 
                            onDelete={removeItem} 
                            onEdit={() => openModal('edit', todo)} 
                        />
                    ))
                ) : (
                    <p className="noResults">No tasks found.</p>
                )}
            </div>
            
            {actionLoading && <div className="mutationOverlay">Updating...</div>}
        </div>
    );
};

export default TodosPage;








// import React, { useContext, useState } from 'react';
// import { UserContext } from '../../context/UserContext';
// import useFetch from '../../myHooks/useFetch';
// import useMutation from '../../myHooks/useMutation';
// import TodoItem from './TodosItem'; 
// import TodoModal from './TodoModal'; 
// import './Todos.css';

// const TodosPage = () => {
//     const { currentUser } = useContext(UserContext);

//     // סטייטים למיון וחיפוש
//     const [sortBy, setSortBy] = useState('id');
//     const [searchTerm, setSearchTerm] = useState("");
//     const [searchCriteria, setSearchCriteria] = useState("title"); 

//     // סטייט לניהול המודאל
//     const [modalConfig, setModalConfig] = useState({ 
//         isOpen: false, 
//         type: '', 
//         todo: null 
//     });

//     // שליפת נתונים
//     const { 
//         data: todos, 
//         loading: fetchLoading, 
//         error: fetchError, 
//         setData: setTodos 
//     } = useFetch(currentUser ? `http://localhost:3000/todos?userId=${currentUser.id}` : null);

//     const { mutate, loading: mutationLoading } = useMutation();

//     // --- לוגיקת סינון ומיון משולבת ---
//     const processedTodos = todos ? [...todos]
//         .filter(todo => {
//             if (!searchTerm) return true;
//             const term = searchTerm.toLowerCase();
//             if (searchCriteria === 'title') return todo.title.toLowerCase().includes(term);
//             if (searchCriteria === 'id') return todo.id.toString() === term;
//             if (searchCriteria === 'completed') {
//                 const searchDone = term === 'v' || term === 'done' || term === 'true';
//                 return todo.completed === searchDone;
//             }
//             return true;
//         })
//         .sort((a, b) => {
//             if (sortBy === 'id') return Number(a.id) - Number(b.id);
//             if (sortBy === 'title') return a.title.localeCompare(b.title);
//             if (sortBy === 'completed') return (a.completed === b.completed) ? 0 : a.completed ? 1 : -1;
//             return 0;
//         }) : [];

//     // --- פונקציות הפעולה ---
    
//     const handleSave = async (title) => {
//         try {
//             if (modalConfig.type === 'add') {
//                 const maxId = todos.length > 0 ? Math.max(...todos.map(t => Number(t.id))) : 0;
//                 const newTodo = await mutate(`http://localhost:3000/todos`, 'POST', {
//                     userId: currentUser.id,
//                     id: String(maxId + 1),
//                     title: title,
//                     completed: false
//                 });
//                 setTodos(prev => [...prev, newTodo]);
//             } else if (modalConfig.type === 'edit') {
//                 await mutate(`http://localhost:3000/todos/${modalConfig.todo.id}`, 'PATCH', {
//                     title: title
//                 });
//                 setTodos(prev => prev.map(t => 
//                     t.id === modalConfig.todo.id ? { ...t, title: title } : t
//                 ));
//             }
//             closeModal();
//         } catch (err) {
//             alert("Action failed.");
//         }
//     };

//     const deleteTodo = async (id) => {
//         if (window.confirm("Delete this task?")) {
//             try {
//                 await mutate(`http://localhost:3000/todos/${id}`, 'DELETE');
//                 setTodos(prev => prev.filter(t => t.id !== id));
//             } catch (err) {
//                 alert("Failed to delete the task.");
//             }
//         }
//     };

//     const toggleTodo = async (id) => {
//         const todoToUpdate = todos.find(t => t.id === id);
//         if (!todoToUpdate) return;
//         try {
//             await mutate(`http://localhost:3000/todos/${id}`, 'PATCH', {
//                 completed: !todoToUpdate.completed
//             });
//             setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
//         } catch (err) {
//             alert("Failed to update status.");
//         }
//     };

//     const openModal = (type, todo = null) => {
//         setModalConfig({ isOpen: true, type: type, todo: todo });
//     };

//     const closeModal = () => {
//         setModalConfig({ isOpen: false, type: '', todo: null });
//     };

//     if (fetchLoading) return <div className="infoWrapper"><div className="spinner"></div><p>Loading...</p></div>;
//     if (fetchError) return <div className="errorContainer"><p>Error: {fetchError}</p></div>;

//     return (
//         <div className="todosContainer">
//             <h1 className="pageTitle">My Tasks</h1>

//             <div className="todosToolbar">
//                 <div className="searchGroup">
//                     <div className="searchChips">
//                         <button className={`chip ${searchCriteria === 'title' ? 'active' : ''}`} onClick={() => setSearchCriteria('title')}>Title</button>
//                         <button className={`chip ${searchCriteria === 'id' ? 'active' : ''}`} onClick={() => setSearchCriteria('id')}>ID</button>
//                         <button className={`chip ${searchCriteria === 'completed' ? 'active' : ''}`} onClick={() => setSearchCriteria('completed')}>Status</button>
//                     </div>
//                     <div className="searchField">
//                         <input 
//                             type="text" 
//                             className="searchInput" 
//                             placeholder={`Search by ${searchCriteria}...`}
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                         <span className="searchIcon">🔍</span>
//                     </div>
//                 </div>

//                 <div className="actionGroup">
//                     <select className="sortSelect" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//                         <option value="id">Sort by ID</option>
//                         <option value="title">Sort by Title</option>
//                         <option value="completed">Sort by Status</option>
//                     </select>
//                     <button className="addTodoBtn" onClick={() => openModal('add')}>+ New Task</button>
//                 </div>
//             </div>

//             <TodoModal 
//                 isOpen={modalConfig.isOpen}
//                 title={modalConfig.type === 'edit' ? "Edit Task" : "Create New Task"}
//                 initialValue={modalConfig.type === 'edit' ? modalConfig.todo.title : ""}
//                 onSave={handleSave}
//                 onClose={closeModal}
//             />

//             <div className="todosList">
//                 {processedTodos.map(todo => (
//                     <TodoItem 
//                         key={todo.id} 
//                         todo={todo} 
//                         onToggle={toggleTodo} 
//                         onDelete={deleteTodo}
//                         onEdit={() => openModal('edit', todo)} 
//                     />
//                 ))}
//             </div>
            
//             {mutationLoading && <div className="mutationOverlay">Syncing with server...</div>}
//         </div>
//     );
// };

// export default TodosPage;



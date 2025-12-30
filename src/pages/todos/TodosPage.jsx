import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import TodoItem from './TodosItem'; // וודאי ששם הקובץ תואם (TodoItem או TodosItem)
import './Todos.css';

const TodosPage = () => {
  const { currentUser } = useContext(UserContext);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/todos?userId=${currentUser.id}`);
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    if (currentUser) fetchTodos();
  }, [currentUser]);

  const deleteTodo = (id) => {
    if(window.confirm("Delete this task?")) {
      setTodos(todos.filter(t => t.id !== id));
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? {...t, completed: !t.completed} : t));
  };

  if (loading) {
    return (
      <div className="infoWrapper">
        <div className="loadingSpinner">
          <div className="spinner"></div>
          <p>Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="todosContainer">
      <header className="todosHeader">
        <h1>My Tasks</h1>
        <button className="addTodoBtn">+ New Task</button>
      </header>

      {/* הרשימה המכילה את כל השורות */}
      <div className="todosList">
        {todos.length > 0 ? (
          todos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onToggle={toggleTodo} 
              onDelete={deleteTodo}
              onEdit={(t) => alert(`Editing: ${t.title}`)}
            />
          ))
        ) : (
          <p className="noTodos">No tasks found. Start by adding one!</p>
        )}
      </div>
    </div>
  );
};

export default TodosPage;









// import React, { useState, useEffect, useContext } from 'react';
// import { UserContext } from '../../context/UserContext';
// import TodoItem from './TodosItem';
// import './Todos.css';

// const TodosPage = () => {
//   const { currentUser } = useContext(UserContext);
//   const [todos, setTodos] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTodos = async () => {
//       try {
//         const response = await fetch(`http://localhost:3000/todos?userId=${currentUser.id}`);
//         const data = await response.json();
//         setTodos(data);
//       } catch (error) {
//         console.error("Error fetching todos:", error);
//       } finally {
//         setTimeout(() => setLoading(false), 600);
//       }
//     };
//     if (currentUser) fetchTodos();
//   }, [currentUser]);

//   const deleteTodo = (id) => {
//     if(window.confirm("Delete this task?")) {
//       setTodos(todos.filter(t => t.id !== id));
//     }
//   };

//   const toggleTodo = (id) => {
//     setTodos(todos.map(t => t.id === id ? {...t, completed: !t.completed} : t));
//   };

//   if (loading) {
//     return (
//       <div className="infoWrapper">
//         <div className="loadingSpinner">
//           <div className="spinner"></div>
//           <p>Loading your tasks...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="todos-container">
//       <header className="todos-header">
//         <h1>My Tasks</h1>
//         <button className="add-todo-btn">+ New Task</button>
//       </header>

//       {/* שינוי שם המחלקה כאן ל-todos-list */}
//       <div className="todos-list">
//         {todos.length > 0 ? (
//           todos.map(todo => (
//             <TodoItem 
//               key={todo.id} 
//               todo={todo} 
//               onToggle={toggleTodo} 
//               onDelete={deleteTodo}
//               onEdit={(t) => alert(`Editing: ${t.title}`)}
//             />
//           ))
//         ) : (
//           <p className="no-todos">No tasks found. Start by adding one!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TodosPage;







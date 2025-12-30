import React from 'react';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  return (
    <div className={`todoRow ${todo.completed ? 'completed' : ''}`}>
      {/* עטיפה לצ'קבוקס למיקום קבוע בשורה */}
      <div className="todoCheckboxWrapper">
        <input 
          type="checkbox" 
          checked={todo.completed} 
          onChange={() => onToggle(todo.id)} 
          className="todoCheckbox"
          title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        />
      </div>

      {/* טקסט המשימה */}
      <span className="todoText">{todo.title}</span>

      {/* כפתורי פעולה מיושרים לסוף השורה */}
      <div className="todoActions">
        <button onClick={() => onEdit(todo)} className="actionBtn" title="Edit">✏️</button>
        <button onClick={() => onDelete(todo.id)} className="actionBtn" title="Delete">🗑️</button>
      </div>
    </div>
  );
};

export default TodoItem;




// import React from 'react';

// const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
//   return (
//     <div className={`todo-row ${todo.completed ? 'completed' : ''}`}>
//       {/* הצד השמאלי - מחובר יחד ב-Flex */}
//       <div className="todo-left">
//         <input 
//           type="checkbox" 
//           checked={todo.completed} 
//           onChange={() => onToggle(todo.id)} 
//           className="todo-checkbox"
//         />
//         <span className="todo-text">{todo.title}</span>
//       </div>

//       {/* הצד הימני - הכפתורים נדחפים לסוף השורה */}
//       <div className="todo-actions">
//         <button onClick={() => onEdit(todo)} className="action-btn" title="Edit">✏️</button>
//         <button onClick={() => onDelete(todo.id)} className="action-btn" title="Delete">🗑️</button>
//       </div>
//     </div>
//   );
// };

// export default TodoItem;






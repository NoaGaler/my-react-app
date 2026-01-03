



import React from 'react';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
    return (
        <div className={`todoRow ${todo.completed ? 'completed' : ''}`}>
            <div className="todoCheckboxWrapper">
                <input 
                    type="checkbox" 
                    className="todoCheckbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                />
            </div>
            
            {/* הצגת המזהה של המשימה לפני הכותרת */}
            <span className="todoId">#{todo.id}</span>
            
            <span className="todoText">{todo.title}</span>
            
            <div className="todoActions">
                <button className="actionBtn editBtn" onClick={onEdit}>✏️</button>
                <button className="actionBtn deleteBtn" onClick={() => onDelete(todo.id)}>🗑️</button>
            </div>
        </div>
    );
};

export default TodoItem;







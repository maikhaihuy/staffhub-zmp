import type { TodoTask } from '@/types/shift'

interface TodoListProps {
  todos: TodoTask[]
  onToggle: (id: number) => void
  doneCount: number
}

export function TodoList({ todos, onToggle, doneCount }: TodoListProps) {
  return (
    <section aria-label="Checklist tasks">
      <div className="section-label section-label--spread">
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          Checklist
        </span>
        <span className="counter-badge" aria-live="polite" aria-label={`${doneCount} of ${todos.length} tasks done`}>
          {doneCount}/{todos.length}
        </span>
      </div>

      <div className="task-group" role="list">
        {todos.map((todo, i) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            isLast={i === todos.length - 1}
          />
        ))}
      </div>
    </section>
  )
}

interface TodoItemProps {
  todo: TodoTask
  onToggle: (id: number) => void
  isLast: boolean
}

function TodoItem({ todo, onToggle, isLast }: TodoItemProps) {
  return (
    <button
      className={`todo-item ${todo.done ? 'todo-item--done' : ''} ${isLast ? 'todo-item--last' : ''}`}
      onClick={() => onToggle(todo.id)}
      role="listitem"
      aria-checked={todo.done}
      aria-label={`${todo.label}: ${todo.done ? 'done, tap to uncheck' : 'tap to complete'}`}
    >
      <div className={`todo-check ${todo.done ? 'todo-check--checked' : ''}`} aria-hidden="true">
        {todo.done && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        )}
      </div>
      <span className="todo-label">{todo.label}</span>
      <span className={`todo-tag todo-tag--${todo.tag}`}>{todo.tag}</span>
    </button>
  )
}

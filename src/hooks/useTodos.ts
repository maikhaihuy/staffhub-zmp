import { useState, useCallback } from 'react'
import type { TodoTask } from '@/types/shift'
import { ZaloBridge } from '@/utils/shiftUtils'

const INITIAL_TODOS: TodoTask[] = [
  { id: 1, label: 'Clean bar counter', tag: 'urgent', done: false },
  { id: 2, label: 'Refill toppings (pearls, coconut jelly)', tag: 'normal', done: false },
  { id: 3, label: 'Clean customer seating area', tag: 'normal', done: false },
  { id: 4, label: 'Restock takeaway cups & lids', tag: 'normal', done: false },
  { id: 5, label: 'Wipe down blenders & shakers', tag: 'urgent', done: false },
  { id: 6, label: 'Update whiteboard menu', tag: 'normal', done: false },
]

interface UseTodosResult {
  todos: TodoTask[]
  toggle: (id: number) => void
  doneCount: number
  totalCount: number
  unfinishedLabels: string[]
  allDone: boolean
}

export function useTodos(): UseTodosResult {
  const [todos, setTodos] = useState<TodoTask[]>(INITIAL_TODOS)

  const toggle = useCallback((id: number) => {
    setTodos(prev =>
      prev.map(t => {
        if (t.id !== id) return t
        const next = { ...t, done: !t.done }
        if (next.done) ZaloBridge.vibrate()
        return next
      }),
    )
  }, [])

  const doneCount = todos.filter(t => t.done).length
  const allDone = doneCount === todos.length
  const unfinishedLabels = todos.filter(t => !t.done).map(t => t.label)

  return { todos, toggle, doneCount, totalCount: todos.length, unfinishedLabels, allDone }
}

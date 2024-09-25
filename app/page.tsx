'use client'

import { addTodo } from '@/actions/addTodo'
import { deleteTodo } from '@/actions/deleteTodo'
import { getTodo } from '@/actions/getTodo'
import { updateTodo } from '@/actions/updateTodo'
import Popup from '@/components/Popup'
import { FormEvent, useEffect, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { MdDelete } from 'react-icons/md'

interface Todo {
  id: number
  todo: string
  status: boolean
}

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [tableData, setTableData] = useState<Todo[]>([])
  const [editTodo, setEditTodo] = useState<Todo | undefined>()

  const openPopup = () => {
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
    setEditTodo(undefined)
  }

  const loadTableData = async () => {
    try {
      const todos: Todo[] = await getTodo()
      setTableData(todos)
    } catch (error) {
      throw error
    }
  }

  const handleTodoSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const target = event.target as typeof event.target & {
      todo: { value: string }
    }

    try {
      if (editTodo) {
        await updateTodo(editTodo)
      } else {
        await addTodo(target.todo.value)
      }
      loadTableData()
      closePopup()
    } catch (error) {
      console.log('Failed to create todo: ', error)
      throw error
    }
  }

  const doneTodo = async (todo: Todo) => {
    try {
      await updateTodo({ ...todo, status: true })
      await loadTableData()
    } catch (error) {
      throw error
    }
  }

  const deleteItem = async (id: number) => {
    try {
      await deleteTodo(id)
      await loadTableData()
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    loadTableData()
  }, [])

  return (
    <main className='bg-gray-800 w-4/5 mx-auto mt-20 p-5 rounded-lg'>
      <div className='flex justify-between items-center mb-3'>
        <div className='text-3xl text-white'>Todos</div>
        <button onClick={openPopup} className='bg-blue-500 text-white px-5 py-3 text-xl rounded-xl'>
          Add Todos
        </button>
      </div>

      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <form onSubmit={handleTodoSubmit} className='mx-auto'>
          <div className='mb-5'>
            <label htmlFor='todo' className='block mb-2 text-sm font-medium text-white'>
              Todo
            </label>
            {editTodo ? (
              <input
                type='text'
                required
                id='todo'
                value={editTodo.todo}
                onChange={(e) => setEditTodo((prev) => (prev ? { ...prev, todo: e.target.value } : { id: 0, todo: e.target.value, status: false }))}
                placeholder='Enter your task'
                className='text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white shadow-sm-light'
              />
            ) : (
              <input
                type='text'
                required
                id='todo'
                placeholder='Enter your task'
                className='text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white shadow-sm-light'
              />
            )}
          </div>
          <button type='submit' className='px-4 py-2 bg-blue-500 text-white rounded-lg'>
            {editTodo ? 'Update Todo' : 'Add Todo'}
          </button>
        </form>
      </Popup>

      <div className='mt-5'>
        <table className='w-full border rounded-xl overflow-hidden'>
          <thead className='bg-blue-900'>
            <tr>
              <th className='text-center py-3 border border-gray-500 text-lg'>Done</th>
              <th className='text-center py-3 border border-gray-500 text-lg'>Task</th>
              <th className='text-center py-3 border border-gray-500 text-lg'>Edit</th>
              <th className='text-center py-3 border border-gray-500 text-lg'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {tableData &&
              tableData.map((row, i) => (
                <tr key={i} className='text-center odd:bg-gray-700 even:bg-gray-600'>
                  <td className='py-3 border border-gray-500'>
                    <button onClick={() => doneTodo(row)}>
                      <div className='w-4 h-4 cursor-pointer border border-white rounded-sm'></div>
                    </button>
                  </td>
                  <td className='py-3 border border-gray-500'>{row.todo}</td>
                  <td className='py-3 border border-gray-500'>
                    <button
                      onClick={() => {
                        setIsPopupOpen(true)
                        setEditTodo(row)
                      }}
                      className='bg-yellow-200 rounded-lg px-4 py-2 cursor-pointer hover:opacity-80'
                    >
                      <MdEdit className='w-6 h-6 text-black' />
                    </button>
                  </td>
                  <td className='py-3 border border-gray-500'>
                    <button onClick={() => deleteItem(row.id)} className='bg-red-400 rounded-lg px-4 py-2 cursor-pointer hover:opacity-80'>
                      <MdDelete className='w-6 h-6 text-black' />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

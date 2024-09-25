'use server'

import { dbDocClient } from '@/utils/dbconfig'
import { PutCommand } from '@aws-sdk/lib-dynamodb'

export interface TodoItem {
  id: number
  todo: string
  status: boolean
}

export const addTodo = async (todo: string) => {
  try {
    const params = {
      TableName: 'todo',
      Item: {
        id: Math.floor(Math.random() * 1000),
        todo: todo,
        status: false,
      },
    }
    await dbDocClient.send(new PutCommand(params))
  } catch (error) {
    console.log('Database error: ', error)
    throw new Error('Database Error: Failed to create Todo')
  }
}

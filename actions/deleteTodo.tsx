'use server'

import { dbDocClient } from '@/utils/dbconfig'
import { DeleteCommand } from '@aws-sdk/lib-dynamodb'

export const deleteTodo = async (id: number) => {
  try {
    await dbDocClient.send(
      new DeleteCommand({
        TableName: 'todo',
        Key: {
          id: id,
        },
      }),
    )
  } catch (error) {
    console.log('Database error: ', error)
    throw new Error('Database Error: Failed to delete Todo')
  }
}

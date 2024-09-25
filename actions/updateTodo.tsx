'use server'

import { dbDocClient } from '@/utils/dbconfig'
import { UpdateCommand } from '@aws-sdk/lib-dynamodb'

export interface TodoItem {
  id: number
  todo: string
  status: boolean
}

export const updateTodo = async ({ id, todo, status }: TodoItem) => {
  try {
    await dbDocClient.send(
      new UpdateCommand({
        TableName: 'todo',
        Key: { id },
        UpdateExpression: 'set todo =  :todoVal, #status = :statusVal',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':todoVal': todo,
          ':statusVal': status,
        },
      }),
    )
  } catch (error) {
    console.log('Database error: ', error)
    throw new Error('Database Error: Failed to update Todo')
  }
}

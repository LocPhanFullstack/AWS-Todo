'use server'

import { dbDocClient } from '@/utils/dbconfig'
import { ScanCommand, ScanCommandOutput } from '@aws-sdk/lib-dynamodb'

export interface TodoItem {
  id: number
  todo: string
  status: boolean
}

export const getTodo = async () => {
  try {
    const data: ScanCommandOutput = await dbDocClient.send(
      new ScanCommand({
        TableName: 'todo',
        FilterExpression: '#status = :statusVal',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':statusVal': false,
        },
      }),
    )
    return (data.Items as TodoItem[]) || []
  } catch (error) {
    console.log('Database error: ', error)
    throw new Error('Database Error: Failed to get Todo')
  }
}

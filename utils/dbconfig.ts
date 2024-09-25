'server only'

import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, TranslateConfig } from '@aws-sdk/lib-dynamodb'

const REGION = process.env.REGION

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_KEY || !process.env.REGION) {
  throw new Error('Cannot Read env variable AWS_ACCESS_KEY_ID or AWS_SECRET_KEY or REGION')
}

const dbClientConfig: DynamoDBClientConfig = {
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
}

const dbClient = new DynamoDBClient(dbClientConfig)

const marshallOptions: TranslateConfig['marshallOptions'] = {
  convertEmptyValues: false,
  removeUndefinedValues: true,
  convertClassInstanceToMap: false,
}

const unmarshallOptions: TranslateConfig['unmarshallOptions'] = {
  wrapNumbers: false,
}

const translateConfig: TranslateConfig = {
  marshallOptions,
  unmarshallOptions,
}

const dbDocClient = DynamoDBDocumentClient.from(dbClient, translateConfig)

export { dbDocClient }

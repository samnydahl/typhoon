import AWS from 'aws-sdk'

const dynamoClient = new AWS.DynamoDB.DocumentClient()

/**
 * fetchExchangeRate.js
 *
 * Runs once every day at midnight.
 * Fetches current Foreign exchange rates
 * and stores in DynamoDB.
 */
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  const date = getCurrentDate()

  const rate = getExchangeRate(date)

  await persistToDb({
    currency: 'NOK',
    rate,
    date,
  })
}

/**
 * Get current date, in YYYY-MM-DD format
 * @return {String}
 */
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0]
}

/**
 * Get foreign exchange rates by date.
 * For the pourpouse of this demo, only a dummy,
 * value is returned. But could be fetched from
 * https://api.exchangeratesapi.io/2020-12-21?base=SEK&symbols=NOK
 *
 * @return {Number}
 */
const getExchangeRate = (date) => {
  return 1.0513754405
}

/**
 * Persist data to DynamoDB
 * @param  {Object} data
 * @return {Promise}
 */
const persistToDb = async (data) => {
  return dynamoClient.put({
    TableName: process.env.DYNAMODB_RATE_TABLE,
    Item: data,
  }).promise()
}

import AWS from 'aws-sdk'

const dynamoClient = new AWS.DynamoDB.DocumentClient()

const rates = {}

/**
 * processOrders.js
 *
 * Processes all orders from an SQS queue.
 * Transforms data and writes to dynamo.
 */
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  const items = []

  for (var i = 0; i < event.Records.length; i++) {
    // Each record from SQS
    const record = event.Records[i]

    // Parse event body
    const order = JSON.parse(record.body)

    // Format Event creation date to YYYY-MM-DD
    const date = formatDate(record.time)

    // Fetch exchange rate for event date
    const rate = await getExchangeRate(date)

    items.push({
      // Use Event id as primary id
      id: record.id,

      ...order,

      // Transform product attributes
      products: products.map((p) => {
        return {
          ...p,
          productId: transformId(p.productId),
          price: transformPrice(rate, p.price),
        }
      })
    })
  }

  await writeToDb(items)

  return { msg: 'Completed' }
}

/**
 * Format date in YYYY-MM-DD format
 * @return {String}
 */
const formatDate = (date) => {
  return date.toISOString().split('T')[0]
}

/**
 * Get exchange rate by date.
 * Caches rate between warm executions.
 * @param  {String} date
 * @return {Number}
 */
const getExchangeRate = async(date) => {
  if (rates[date]) {
    return rates[date]
  }

  rates[date] = await getRateFromDb(date)

  return rates[date]
}

/**
 * Converts a price at a specific date.
 * @param  {Number} rate
 * @param  {Number} price
 * @return {Number}
 */
const transformPrice = (rate, price) => {
  return price * rate
}

const transformId = (id) => {
  return id.toLower
}

/**
 * Fetch a rate stored in DynamoDB
 * @param  {String} date
 * @return {Number}
 */
const getRateFromDb = async(date) => {
  return await dynamoClient.get({
    TableName: process.env.DYNAMODB_RATE_TABLE,
    Key: date,
  }).promise()
}

/**
 * BatchWrite items to DynamoDB
 * @return {Promise}
 */
const writeToDb = async(items) => {
  return await dynamoClient.batchWrite({
    [process.env.DYNAMODB_ORDER_TABLE]: items.map((i) => {
      return {
        PutRequest: {
          Item: i,
        },
      }
    })
  }).promise()
}

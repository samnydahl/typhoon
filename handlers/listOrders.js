import AWS from 'aws-sdk'

const dynamoClient = new AWS.DynamoDB.DocumentClient()

/**
 * listOrders.js
 *
 * Returns all registered orders.
 */

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  const items = await fetchOrdersFromDb()

  return {
    statusCode: 200,
    body: JSON.stringify({
      items,
    })
  }
}

/**
 * Fetch all items from order table
 * @return {Array}
 */
const fetchOrdersFromDb = async() => {
  const response = await dynamoClient.scan({}).promise()

  return response.Items
}

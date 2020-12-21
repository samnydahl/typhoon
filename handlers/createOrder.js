import AWS from 'aws-sdk'

const eventbridge = new AWS.EventBridge()

/**
 * createOrders.js
 *
 * Parses and validates input, and send it off to Event Bridge.
 */
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  const data = parseEventBody(event)

  validateInput(data)

  await publishEvent(data)

  return {
    statusCode: 200,
    body: JSON.stringify({
      msg: 'Order consumed',
    })
  }
}

/**
 * Parse event body
 *
 * @param  {Objext} event
 * @return {Object}
 */
const parseEventBody = (event) => {
  if (event.body !== null && event.body !== undefined) {
    return JSON.parse(event.body)
  }

  throw new Error('Could not parse event body')
}

/**
 * Validate input.
 * Not implemented in this demo.
 * But would be trivial to run against
 * a schema using eg. ajv.
 *
 * @param  {Object} data
 * @return {Boolean}
 */
const validateInput = (data) => {
  return true
}

/**
 * Publishes an Event to EventBridge
 * @param  {Objexct} data
 * @return {Promise}
 */
const publishEvent = async(eventName, data) => {
  await eventbridge.putEvents({
    Entries: [
      {
        Detail: JSON.stringify({
          body: data,
        }),
        DetailType: eventName,
        EventBusName: process.env.EVENT_BUS,
        Source: 'com.acme.orders',
        Time: new Date(),
      }
    ]
  }).promise()
}

/* eslint-disable no-console */
// start server (port, error handling, logging server start)
import exitHook from 'async-exit-hook'

import app from './app'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import { env } from './config/environment'


// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})


// Start server
let server
const START_SERVER = async () => {
  if (env.BUILD_MODE === 'production') { // production
    server = app.listen(process.env.APP_PORT, () => {
      console.log(`3. Production: Hi ${env.AUTHOR}, Back-end Server is running successfully at host: ${env.APP_HOST} and at port: ${env.APP_PORT}`)
    })
  } else {
    server = app.listen(env.APP_PORT, env.APP_HOST, () => { // local
      console.log(`3. Local Dev: Hi ${env.AUTHOR}, Back-end Server is running successfully at host: ${env.APP_HOST} and at port: ${env.APP_PORT}`)
      console.log(`Hello, running at http://${ env.APP_HOST }:${ env.APP_PORT }/`)
    })
  }

  exitHook(() => {
    console.log('Closing MongoDB connection...')
    CLOSE_DB()
      .then(() => console.log('MongoDB connection closed.'))
      .catch((err) => console.error('Error closing MongoDB:', err))
  })
}


(async () => {
  try {
    console.log('1. Connecting to MongoDB...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB.')
    START_SERVER()
  } catch (error) {
    console.error('Failed to connect DB:', error)
    process.exit(1)
  }
})()

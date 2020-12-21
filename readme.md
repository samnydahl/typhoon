This project has no tests, and has not been deployed to AWS.

Notes:
  * Add Archive to Event Bridge to add replay capabilities
  * Dump events to S3 for safe-keeping and analysis.
  * Use DLQ for SQS queue
  * Each function should have their own IAM permissions.



Usage:
  #Deploy
    `serverless deploy --aws-profile xyz`

  #Package
    `serverless package`

  #Invoke locally
    `serverless invoke local --function=xyz --path=./event.json`

#!/usr/bin/env bash

FUNCTION_NAME=$1
ZIP_NAME=$2


report_status () {
  STATUS=$1
  SUCCESS_MESSAGE=$2
  FAILURE_MESSAGE=$3

  if [ $STATUS -eq 0 ]
  then
    echo $SUCCESS_MESSAGE
  else
    echo $FAILURE_MESSAGE >&2
    exit 1
  fi
}

tsc

report_status $? "Typescript transpilation successful!" "Typescript transpilation failed."

cp -r node_modules .out

report_status $? "Node modules import successful!" "Node modules import failed."

cd .out

zip -r -q ${ZIP_NAME}.zip .

report_status $? "Deployment package zip file creation successful!" "Deployment package zip file creation failed."

aws lambda update-function-code --function-name ${FUNCTION_NAME} --zip-file fileb://${ZIP_NAME}.zip | jq '.Environment = "***"'

TRIES=20
STATE=$(aws lambda get-function --function-name ${FUNCTION_NAME} --query 'Configuration.LastUpdateStatus' | jq -r)
echo "STATE: $STATE"
while [ "$STATE" != "Successful" ]
do
  echo "Waiting for lambda to update..."
  sleep 5
  STATE=$(aws lambda get-function --function-name ${FUNCTION_NAME} --query 'Configuration.LastUpdateStatus' | jq -r)
  echo "STATE: $STATE"
  let TRIES-=1
  if [ $TRIES -le 0 ]
  then
    echo "Breaking, this took too long"
    exit 1
  fi
done

rm -r ${ZIP_NAME}.zip

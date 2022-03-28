#!/usr/bin/env bash

FUNCTION_NAME=$1
ZIP_NAME=$2

tsc

TYPESCRIPT_STATUS=$?

if [ $TYPESCRIPT_STATUS -eq 0 ]
then
  echo "Typescript transpilation successful!"
else
  echo "Typescript transpilation failed." >&2
  exit 1
fi

cp -r node_modules .out

cd .out

zip -r ${ZIP_NAME}.zip .

aws lambda update-function-code --function-name ${FUNCTION_NAME} --zip-file fileb://${ZIP_NAME}.zip

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

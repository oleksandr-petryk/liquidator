#!/bin/bash
set -e

BUCKET_NAME="pictures"

echo "Checking if bucket '$BUCKET_NAME' exists..."
if awslocal s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
  echo "Bucket '$BUCKET_NAME' already exists"
else
  echo "Creating bucket '$BUCKET_NAME'..."
  awslocal s3 mb s3://"$BUCKET_NAME"
fi

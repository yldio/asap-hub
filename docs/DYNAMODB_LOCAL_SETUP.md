# DynamoDB Local Setup

This guide explains how to run DynamoDB Local using Docker for local development.

## Quick Start

1. **Start DynamoDB Local:**

   ```bash
   yarn dynamodb:start
   ```

   Or manually:

   ```bash
   docker-compose up -d dynamodb-local
   ```

2. **Create the table:**

   **_CRN_**

   ```bash
   aws dynamodb create-table \
   --table-name gp2-hub-dev-cookie-preferences \
   --attribute-definitions AttributeName=cookieId,AttributeType=S \
   --key-schema AttributeName=cookieId,KeyType=HASH \
   --billing-mode PAY_PER_REQUEST \
   --endpoint-url http://localhost:8000 \
   --region us-east-1
   ```

   **_GP2_**

   ```bash
   aws dynamodb create-table \
   --table-name gp2-hub-dev-cookie-preferences \
   --attribute-definitions AttributeName=cookieId,AttributeType=S \
   --key-schema AttributeName=cookieId,KeyType=HASH \
   --billing-mode PAY_PER_REQUEST \
   --endpoint-url http://localhost:8000 \
   --region us-east-1
   ```

3. **Set environment variable in your `.env` file:**

   ```bash
   LOCAL_DYNAMODB_ENDPOINT=http://localhost:8000
   ```

   **Note:**

   - The cookie preferences endpoints are Lambda handlers, so you need to use `serverless offline` (`yarn start:backend:crn:sls`) rather than the Express server (`yarn start:backend:crn`)
   - Make sure `SLS_STAGE=local` is set so serverless-offline runs in local mode
   - Check your server logs for: `DynamoDB config: { endpoint: "http://localhost:8000" }` to confirm it's using the local endpoint

## Verification

### Check DynamoDB Local is running:

```bash
curl http://localhost:8000
```

### List tables:

```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000 --region us-east-1
```

### Check data in the table:

**Scan all items:**

```bash
aws dynamodb scan \
  --endpoint-url http://localhost:8000 \
  --table-name asap-hub-dev-cookie-preferences \
  --region us-east-1
```

**Get a specific item by cookieId:**

```bash
aws dynamodb get-item \
  --endpoint-url http://localhost:8000 \
  --table-name asap-hub-dev-cookie-preferences \
  --key '{"cookieId":{"S":"your-cookie-id-here"}}' \
  --region us-east-1
```

**Pretty print with jq (if installed):**

```bash
aws dynamodb scan \
  --endpoint-url http://localhost:8000 \
  --table-name asap-hub-dev-cookie-preferences \
  --region us-east-1 | jq '.Items[]'
```

## Stopping DynamoDB Local

```bash
docker-compose stop dynamodb-local
```

## Notes

- DynamoDB Local runs on port `8000` by default
- Data is stored in memory (lost when container stops) unless you mount a volume
- No AWS credentials needed when using DynamoDB Local
- The handlers automatically detect `LOCAL_DYNAMODB_ENDPOINT` and configure the client accordingly

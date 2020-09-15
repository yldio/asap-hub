# Import data

The package purpose is to automate the process of inserting bulk user and team information.

`yarn pnpify node apps/import-data/build/import.js </path/to/file>.csv`

The csv format needs to respect the following structure:

| Application ID | Project Title | First Name | Middle Name | Last Name | Role   | Institution | Degree | Job Title | N/A    | Email  | ORCID                               |
| -------------- | ------------- | ---------- | ----------- | --------- | ------ | ----------- | ------ | --------- | ------ | ------ | ----------------------------------- |
| string         | string        | string     | string      | string    | string | string      | string | string    | string | string | \*\*\*\*-\*\*\*\*-\*\*\*\*-\*\*\*\* |

The script relies on the first column to be named `Application ID`.

## Environment Variables

- SQUIDEX_CLIENT_ID
- SQUIDEX_CLIENT_SECRET
- SQUIDEX_BASE_URL
- SQUIDEX_APP_NAME=asap-hub

# Import

The script ignores the first line as it is considered the header of the file.

## users

The command purpose is to automate the process of inserting bulk user and team information.

`yarn node apps/asap-cli/build-cjs/cli.js import users </path/to/file>.csv`

The csv format needs to respect the following structure:

- email
- application
- role
- project_title
- first_name
- last_name
- institution
- degree
- position_title
- orcid
- question_1
- question_2
- question_3
- question_4
- expertise
- biography
- research_interest
- responsibilities
- skills
- asap_role
- avatar
- website1
- website2
- linkedin
- scholar
- github
- researchGate
- researcherId
- twitter

## protocols

The command purpose is to automate the process of inserting bulk protocols.

`yarn node apps/asap-cli/build-cjs/cli.js import protocols </path/to/file>.csv`

- teamLeadPILastName
- linkToProtocols
- name
- version
- protocolAuthors
- createdDate
- contact
- keywords
- abstract

## Environment Variables

- SQUIDEX_CLIENT_ID
- SQUIDEX_CLIENT_SECRET
- SQUIDEX_BASE_URL
- SQUIDEX_APP_NAME

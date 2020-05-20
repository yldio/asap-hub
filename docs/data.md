# Data Model

## Entity Relational Diagram

```https://mermaid-js.github.io/mermaid-live-editor/
erDiagram
  USER ||..|| INVITE : has
  USER ||..o{ Auth : has
```

## Data access patterns

### Invite (one time token)

- Create a one time token related to a particular user
- Fetch a one time token and the related user information

### Auth

We need to correlate the authentication provided by the external service to the profiles of the user.

- Create a new identity and the connection to the user profile
- Fetch the user profile associated with a particular identity

### Profile

The profile entity contains the information about a user of the platform:

- Create a user profile and an invite used to join the platform
- Fetch the profile information based on the code on an invite

## Data Storage Options

A decision on what storage solution to choose should consider the entities of the system and how they relate to each other and data access patterns to retrieve them.
As you can be above the ERD doesn't have many of the entities and relationships required further in the project, although we need to pick a storage solution.

An important decision is about managed or unmanaged services. A managed service is better in our context due to the size of the team and to enable focus on different areas.

Our options are:
An SQL database. Our data is strongly relational. A relational database would be an excellent fit.
MongoDB. MongoDB is a document database with high adoption due to the flexibility of schemaless documents.
DynamoDB. We are using serverless in AWS for the backend, which turns DynamoDB is an attractive pairing. DynamosDB is a key/value and document database.

A relational database allows us to map the ERD without too much consideration due to the possibility to join data on different tables. The tooling for the relational database is wide-spread, and it gives substantial flexibility in our data model.

MongoDB is the go-to solution when considering a document database due to the simple API. Modelling data in MongoDB isn't has straightforward has in a relational database, but you still have the flexibility when querying your data and changing access patterns.

DynamoDB is a document database hosted by AWS. DynamoDB offers a simple API tailored for data sets with known access patterns. To ensure the scaling capabilities, you need to think about your data model in a more intentional way than MongoDB. Has you can read in the Peter Parker principle "with great power comes great responsibility".

Considerations
The majority of database solutions use connection pools to manage connections to the database. The usage of serverless functions reduces the benefits of having a connection pool and can exhaust the connection limit.

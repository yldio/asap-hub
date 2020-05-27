# Data Storage

Status: Draft

Date: 2020-05-22

Author: Filipe Pinheiro <filipe@yld.io>

Reviewed-by: Tim Seckinger <tim.seckinger@yld.io>

## Context

The ASAP Hub has to store data about users and usage of the application. To decide how to implement our data storage, we need to take into consideration the data model and data access patterns the application needs.

## Data Model

### Entity Relational Diagram

```
erDiagram
  User ||..|| Invite : has
  User ||..o{ Auth : has
```

https://mermaid-js.github.io/mermaid-live-editor/
[![](https://mermaid.ink/img/eyJjb2RlIjoiZXJEaWFncmFtXG4gIFVzZXIgfHwuLnx8IEludml0ZSA6IGhhc1xuICBVc2VyIHx8Li5veyBBdXRoIDogaGFzIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZXJEaWFncmFtXG4gIFVzZXIgfHwuLnx8IEludml0ZSA6IGhhc1xuICBVc2VyIHx8Li5veyBBdXRoIDogaGFzIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0)

### Potential data access patterns

**Invite (one time token)**

- Create a one time token related to a particular user
- Fetch a one time token and the related user information

**Auth**

We need to correlate the authentication provided by the external service to the profiles of the user.

- Create a new identity and the connection to the user account
- Fetch the user account associated with a particular identity

**User**

The user entity contains the information about a user of the platform:

- Create a user account and an invite used to join the platform
- Fetch the account information based on the code on an invite

### Data Storage Options

A decision on what storage solution to choose should consider the entities of the system, how they relate to each other, and the data access patterns to retrieve them.
As you can see above, the ERD doesn't have many of the entities and relationships required later in the project, but we need to pick a first storage solution now.

An important decision is about managed or unmanaged services. A managed service is better in our context due to the size of the team and to enable focus on different areas.

Our options are:

- A SQL database. Our data is strongly relational. A relational database would be an excellent fit.
- MongoDB. MongoDB is a document database with high adoption due to the flexibility of schemaless documents.
- DynamoDB. We are using serverless in AWS for the backend, which is an attractive pairing with DynamoDB. DynamoDB is a key/value and document database.

A **relational database** allows us to map the ERD without too much consideration due to the possibility to join data on different tables.
The tooling for the relational database is wide-spread, and the database gives us substantial flexibility in our data model.

**MongoDB** is the go-to solution when considering a document database due to the simple API.
Modelling data in MongoDB isn't as straightforward as in a relational database, but you still have flexibility when querying your data and changing access patterns.

**DynamoDB** is a document database hosted by AWS. DynamoDB offers a simple API tailored for data sets with known access patterns.
To ensure the scaling capabilities, you need to think about your data model in a more intentional way than for a MongoDB. As you can read in the Peter Parker principle "with great power comes great responsibility".

**Considerations**

- Due to the serverless nature of our application, databases that use connection pools to manage database connection aren't a good fit. A serverless architecture can exhaust the connection limit, creating zombie connections that may impact database performance.

## Options

### SQL

**Amazon Aurora Serverless**

Amazon Aurora Serverless is an on-demand database. It starts, stops, and scales according to the needs of the application.
Amazon Aurora Serverless supports the Data API, removing the need to have a persistent connection to the cluster.

https://aws.amazon.com/rds/aurora/pricing/

Amazon Aurora is a MySQL and PostgreSQL-compatible relational database. It is priced per hour starting at \$0.082/h (~\$60/mo).

https://aws.amazon.com/rds/aurora/

### MongoDB

**MongoDB Atlas**

MongoDB Atlas is a managed service, and we can deploy the cluster on AWS, GCP, or Azure. In our case, AWS is the most suitable option so that we can leverage VPC peering to added security. It it priced per hour starting at \$0.08/h (~\$58/mo).

https://www.mongodb.com/cloud/atlas/pricing/

### DynamoDB

DynamoDB is a pay-per-request or pay-per-provisioned-capacity. Since we don't know the capacity needed for our application, the choice would need to be its on-demand mode.
DynamoDB is a key-value and document database performant at scale. It's fully managed, and the HTTP API fits nicely with the serverless model.

https://aws.amazon.com/dynamodb/pricing/on-demand/

## Decision

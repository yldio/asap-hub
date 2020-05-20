# Data Model

## Entity Relational Diagram

```https://mermaid-js.github.io/mermaid-live-editor/
erDiagram
    USER ||..o{ OTT : has
```

## Data access patterns

### OTT (one time token)

- Create a one time token related to a particular user
- Fetch a one time token and the related user information

### Account

The user entity contains the information about a user of the platform:

- Create a user profile and a one time token used to join the platform
- Fetch the user information

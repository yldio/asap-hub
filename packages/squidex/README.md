# ASAP Hub and Squidex

Github is the source of truth for Squidex schemas. All the schemas and rules are stored [here](https://github.com/yldio/asap-hub/tree/master/packages/squidex/schema).

We commit the squidex schema with the code, we then have a CI job that will sync the schemas with to the different environments.
We use [squidex-cli](https://github.com/Squidex/squidex-samples/releases) to interact with Squidex.

To configure an app on the cli use:

```
$ sq config add asap-hub-dev asap-hub-dev:default ASAP_HUB_CLIENT_SECRET -l asap-hub-dev
$ sq config use asap-hub-dev
```

To update the schema run this script on the root folder.

```
$ sq sync out packages/squidex/schema/crn -t schemas
```

To ensure consistency run the `fix:format` script before looking at the unstaged changes.
**Note:** don't commit everything, we have some TEMPLATE strings that are replaced on deploy.

# Squidex Rules

Squidex rules for content events can be one of the following values:

- Created: The content has been created
- Updated: The content has been updated
- Published: The status of the content has been changed to Published
- Unpublished: The status of the content has been changed from Published to another status.
- StatusChanged: The status has been changed, e.g. Draft to Archived
- Deleted: The content has been deleted.

Algolia sync is trigger by the following events:

| Entity           | Created | Published | Updated | Unpublished | Status changed | Deleted |
| :--------------- | :-----: | --------: | ------: | ----------: | -------------: | ------: |
| Research Outputs |    -    |         x |       x |           x |              - |       x |
| Teams            |    -    |         x |       x |           - |              - |       x |
| User             |    -    |         - |       - |           - |              - |       - |
| External authors |    -    |         - |       - |           - |              - |       - |
| Labs             |    -    |         - |       - |           - |              - |       - |

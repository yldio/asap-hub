# ASAP Hub and Squidex

We commit the squidex schema with the code.
We use [squidex-cli](https://github.com/Squidex/squidex-samples/releases) to interact with Squidex.

To configure an app on the cli use:

```
$ sq config add asap-hub asap-hub-dev:default ASAP_HUB_CLIENT_SECRET -l asap-hub-dev
$ sq config use asap-hub-dev
```

To update the schema run this script on the root folder.

```
$ sq sync out packages/squidex/schema
```

To ensure consistency run the `fix:format` script before looking at the unstaged changes.
**Note:** don't commit everything, we have some TEMPLATE strings that are replaced on deploy.

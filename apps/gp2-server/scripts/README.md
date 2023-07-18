# Import data scripts

## Environment setup

The import scripts need to target the correct environment. Make sure to set the following environment variables:

```sh
CONTENTFUL_ACCESS_TOKEN
CONTENTFUL_ENV_ID
CONTENTFUL_SPACE_ID
```

### User import

To run the import script use this command from the root of this repository:

```bash
yarn import:users <file-path>
```

Where `<file-path>` is a relative path to the CSV file.

### Contributing Cohort import

To run the import script use this command from the root of this repository:

```bash
yarn import:cohorts <file-path>
```

Where `<file-path>` is a relative path to the CSV file.

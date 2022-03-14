import os
import sys

import requests
from common import getClientHeaders

headers = getClientHeaders()

SQUIDEX_URL = os.getenv('SQUIDEX_BASE_URL')

def deleteApp(appName):
    # Delete app using app client
    deleteUrl = SQUIDEX_URL + "/api/apps/" + appName
    r = requests.delete(url = deleteUrl, headers = headers)
    return r

def main():
    appName = os.getenv('SQUIDEX_APP_NAME')

    if appName is None:
        print("SQUIDEX_APP_NAME is undefined")
        sys.exit(1)

    deleteApp(appName)
    print("App", appName, "deleted")

main()

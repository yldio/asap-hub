import requests 
import os
import sys

from common import getClientHeaders
headers = getClientHeaders()

SQUIDEX_URL = 'https://cloud.squidex.io'

def deleteApp(appName):
    # Delete app using app client
    deleteUrl = SQUIDEX_URL + "/api/apps/" + appName 
    r = requests.delete(url = deleteUrl, headers = headers)
    return r

def main():
    appName = os.getenv('SQUIDEX_TEST_APP_NAME')

    if appName is None:
        print("SQUIDEX_TEST_APP_NAME is undefined")
        sys.exit()

    deleteApp(appName)
    print("App", appName, "deleted")

main()

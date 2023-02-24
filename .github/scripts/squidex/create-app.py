import os
import sys

import requests
from common import getClientHeaders, isAppAvailable

headers = getClientHeaders()

SQUIDEX_URL = os.getenv('SQUIDEX_BASE_URL')


def createAPP(appName):
    url = SQUIDEX_URL + "/api/apps"
    body = {'name': appName}
    requests.post(url=url, json=body, headers=headers)


def getAppClient(appName):
    url = SQUIDEX_URL + "/api/apps/" + appName + "/clients"
    r = requests.get(url=url, headers=headers)
    json_data = r.json()
    return json_data['items'][0]


def promoteClient(appName, client):
    # Make user owner to allow him deleting the app
    clientUrl = SQUIDEX_URL + "/api/apps/" + \
        appName + "/clients/" + client['id']
    update = {'role': 'Owner'}
    requests.put(url=clientUrl, headers=headers, json=update)


def setApp(appName, clientId, clientSecret, app):
    os.system('sq config add {appName} {appName}:default {clientSecret}'.format(
        appName=appName,
        clientId=clientId,
        clientSecret=clientSecret
    ))
    os.system('sq config use {appName}'.format(appName=appName))

def main():
    appName = os.getenv('SQUIDEX_APP_NAME')
    app = os.getenv('APP')

    if appName is None:
        print("SQUIDEX_APP_NAME is undefined. Exiting")
        sys.exit(1)

    appAvailable = isAppAvailable(appName, headers)
    if appAvailable:
        print("name=app-created::false",file=$GITHUB_OUTPUT)
        print("App", appName, "already exists")
    else:
        createAPP(appName)
        print("App", appName, "created")
        client = getAppClient(appName)
        promoteClient(appName, client)
        setApp(appName, client['id'], client['secret'], app)
        print("name=app-created::true",file=$GITHUB_OUTPUT)

main()

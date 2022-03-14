import requests
import os
import sys

from common import getClientHeaders
headers = getClientHeaders()

SQUIDEX_URL = os.getenv('SQUIDEX_BASE_URL')

def createAPP(appName):
    url = SQUIDEX_URL + "/api/apps"
    body = {'name': appName}
    requests.post(url = url, json = body, headers = headers)

def getAppClient(appName):
    url = SQUIDEX_URL + "/api/apps/" + appName + "/clients"
    r = requests.get(url = url, headers = headers)
    json_data = r.json()
    return json_data['items'][0]

def promoteClient(appName, client):
    # Make user owner to allow him deleting the app
    clientUrl = SQUIDEX_URL + "/api/apps/" + appName + "/clients/" + client['id']
    update = { 'role': 'Owner'}
    requests.put(url = clientUrl, headers = headers, json = update)

def syncApp(appName, clientId, clientSecret):
    os.system('sq config add {appName} {appName}:default {clientSecret}'.format(
        appName = appName,
        clientId = clientId,
        clientSecret = clientSecret
    ))
    os.system('sq config use {appName}'.format( appName = appName ))
    # ATM we have not contents in the repo, but we can easily use this feature to setup fixture data
    os.system('sq sync in packages/squidex/schema/ -t app -t schemas -t contents')

def main():
    appName = os.getenv('SQUIDEX_APP_NAME')

    if appName is None:
        print("SQUIDEX_APP_NAME is undefined. Exiting")
        sys.exit(1)

    createAPP(appName)
    print("App", appName, "created")
    client = getAppClient(appName)
    promoteClient(appName, client)
    syncApp(appName, client['id'], client['secret'])

main()

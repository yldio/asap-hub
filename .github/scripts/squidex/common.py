import os
import sys

import requests

CLIENT_SECRET = os.getenv('SQUIDEX_CLIENT_SECRET')
CLIENT_ID = os.getenv('SQUIDEX_CLIENT_ID')

SQUIDEX_URL = os.getenv('SQUIDEX_BASE_URL')

def getClientHeaders():

    if SQUIDEX_URL is None:
        print("SQUIDEX_BASE_URL is undefined. Exiting")
        sys.exit(1)

    if CLIENT_ID is None:
        print("SQUIDEX_CLIENT_ID is undefined. Exiting")
        sys.exit(1)

    if CLIENT_ID in {'asap-hub:default', 'asap-hub-dev:default'}:
        print("SQUIDEX_CLIENT_ID is pointing to prod or dev. Exiting")
        sys.exit(1)

    if CLIENT_SECRET is None:
        print("SQUIDEX_CLIENT_SECRET is undefined. Exiting")
        sys.exit(1)

    tokenUrl = SQUIDEX_URL + '/identity-server/connect/token'
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    body = {
      'grant_type':'client_credentials',
      'scope':'squidex-api',
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET
    }

    r = requests.post(url = tokenUrl, data = body, headers = headers)
    res = r.json()

    if 'error' in res:
        print("Error getting access token: ", res['error'])
        sys.exit()

    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + res['access_token']
    }

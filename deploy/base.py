import os
import json

import requests
import base64

from .app import App

def base64_encode(data):
    return base64.b64encode(data.encode())




session = requests.Session()
encode_password = base64_encode(f'{os.environ.get('user_dev')}:{os.environ.get('password_dev')}'.strip())

session.headers.update({
    "X-Cybozu-Authorization": encode_password,
    "Content-Type": "application/json"
})


def fetch_data(url, **kwargs):
    global session
    response = session.get(url, **kwargs)
    response.raise_for_status()
    return response.json()

app = App(subdomain='development')

if __name__ == '__main__':
    layout = fetch_data(app.get_form_layout_url(), json={"app": 252})
    fields = fetch_data(app.get_form_fields_url(), json={"app": 252})

    with open('form-fields/layout.json', 'w', encoding='utf-8') as f:
        json.dump(layout, f, indent=4)

    with open('form-fields/fields.json', 'w', encoding='utf-8') as f:
        json.dump(fields, f, indent=4)

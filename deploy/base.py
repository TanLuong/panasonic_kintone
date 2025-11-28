import os
import json

import requests
import base64

from .app import App

# user_dev='luongnhattan2807@gmail.com'
# password_dev='nhattan2807'
# subdomain_dev='development.kintone.com'
# app_id = 72

user_dev='magnus.ngo@mor.com.vn'
password_dev='2409Baobao@' 
subdomain_dev='graceland.cybozu.com'
app_id = 1


def base64_encode(data):
    return base64.b64encode(data.encode())




session = requests.Session()
encode_password = base64_encode(f'{user_dev}:{password_dev}'.strip())

session.headers.update({
    "X-Cybozu-Authorization": encode_password,
    "Content-Type": "application/json",
    # 'Accept-Language': "ja",
})


def fetch_data(url, **kwargs):
    global session
    response = session.get(url, **kwargs)
    response.raise_for_status()
    return response.json()

app = App(subdomain=subdomain_dev)

if __name__ == '__main__':
    layout = fetch_data(app.get_form_layout_url(), json={"app": app_id})
    fields = fetch_data(app.get_form_fields_url(), json={"app": app_id})

    with open('form-fields/layout.json', 'w', encoding='utf-8') as f:
        json.dump(layout, f, ensure_ascii=False, indent=4)

    with open('form-fields/fields.json', 'w', encoding='utf-8') as f:
        json.dump(fields, f, ensure_ascii=False, indent=4)

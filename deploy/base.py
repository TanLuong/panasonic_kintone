import requests
import base64

def base64_encode(data):
    return base64.b64encode(data.encode())




session = requests.Session()
encode_password = base64_encode('luongnhattan2807@gmail.com:nhattanKintone1')

session.headers.update({
    "X-Cybozu-Authorization": encode_password,
    "Content-Type": "application/json"
})


def fetch_data(url, **kwargs):
    global session
    response = session.get(url, **kwargs)
    response.raise_for_status()
    return response.json()

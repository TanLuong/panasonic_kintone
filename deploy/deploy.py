import json

from .base import session, fetch_data, app


def post_data(url, **kwargs):
    global session
    response = session.post(url, **kwargs)
    # response.raise_for_status()
    return response.json()

def put_data(url, **kwargs):
    global session
    response = session.put(url, **kwargs)
    # response.raise_for_status()
    return response.json()

with open('form-fields/layout.json', 'r', encoding='utf-8') as f:
    layout = json.load(f)
with open('form-fields/fields_deploy.json', 'r', encoding='utf-8') as f:
    fields = json.load(f)

layout['app'] = 73
fields['app'] = 73



# deploy fields
print(post_data(app.add_form_fields_url(space_id=0), json=fields))
# deploy layout
print(put_data(app.update_form_layout_url(space_id=0), json=layout))


# deploy app
post_data(app.deploy_url(space_id=0), json={"app": 73})

# check deployed layout and fields
deployed_layout = fetch_data(app.deploy_url(space_id=0), json={"apps": [73]})
print("Deployed Layout:", deployed_layout)

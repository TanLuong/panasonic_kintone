

class App:
    
    def __init__(self, subdomain: str):
        self.subdomain = subdomain

    def get_form_layout_url(self, space_id: int = 0):
        if space_id:
            return f'https://{self.subdomain}/k/guest/{space_id}/v1/app/form/layout.json'
        return f'https://{self.subdomain}/k/v1/app/form/layout.json'

    def deploy_url(self, space_id: int = 0):
        if space_id:
            return f'https://{self.subdomain}/k/guest/{space_id}/v1/preview/app/deploy.json'
        return f'https://{self.subdomain}/k/v1/preview/app/deploy.json'
    
    def update_form_layout_url(self, space_id: int = 0):
        if space_id:
            return f'https://{self.subdomain}/k/guest/{space_id}/v1/preview/app/form/layout.json'
        return f'https://{self.subdomain}/k/v1/preview/app/form/layout.json'

    def get_form_fields_url(self, space_id: int = 0):
        if space_id:
            return f'https://{self.subdomain}/k/guest/{space_id}/v1/app/form/fields.json'
        return f'https://{self.subdomain}/k/v1/app/form/fields.json'

    def add_form_fields_url(self, space_id: int = 0):
        if space_id:
            return f'https://{self.subdomain}/k/guest/{space_id}/v1/preview/app/form/fields.json'
        return f'https://{self.subdomain}/k/v1/preview/app/form/fields.json'


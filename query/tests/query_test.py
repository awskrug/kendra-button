import unittest
import requests

import requests

url = "https://0y3n5xq4vi.execute-api.us-west-2.amazonaws.com/dev/kendra/"


files = [

]
headers= {}

response = requests.request("POST", url, headers=headers, data = payload, files = files)

print(response.text.encode('utf8'))


class QueryPOSTTestCase(unittest.TestCase):
    """ Test for the Query """ 
    lambda_url = "https://0y3n5xq4vi.execute-api.us-west-2.amazonaws.com/dev"

    def test_query_post(self):
        
        """ request POST """ 
        # Fire POST
        payload = {'IndexId': '65a73c7f-74df-43da-950b-70cbc46be778',
            'QueryText': 'kendra'}
        actual = requests.post(lambda_url + "/query", data = query)

        self.assertEqual(expected, actual)
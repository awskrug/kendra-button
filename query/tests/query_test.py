import unittest
import requests

import requests




class QueryPOSTTestCase(unittest.TestCase):
    """ Test for the Query """ 
    url = "https://0y3n5xq4vi.execute-api.us-west-2.amazonaws.com/dev/kendra/"

    def test_query_post(self):
        
        """ request POST """ 
        # Fire POST
        payload = {"IndexId": "65a73c7f-74df-43da-950b-70cbc46be778",
                  "QueryText": "kendra"}
        expected = {}

        actual = requests.post(self.url + "query", data = payload)
        print(actual.text.encode('utf8'))

        self.assertEqual(expected, actual)

unittest.main()
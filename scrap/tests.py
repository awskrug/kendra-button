import unittest

import requests_mock


@requests_mock.Mocker()
class WorkerTestCase(unittest.TestCase):
    def test_get_page(self,m):
        m.register_uri('GET', 'http://test.com', text='resp')
        async

        pass

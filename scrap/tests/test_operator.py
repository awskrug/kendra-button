import os
from unittest import TestCase

import boto3
from moto import mock_dynamodb2, mock_sqs

mock_site_db = 'mock-kendra-buttons-index-dev'
mock_page_db = 'mock-kendra-buttons-page-dev'
mock_sqs_name = 'mock-kendra-buttons-page-que-dev'
os.environ['siteDB'] = mock_site_db
os.environ['pageDB'] = mock_page_db
os.environ['SQS'] = mock_sqs_name

from ..page import Page
from ..kendra_site import Site


class OperatorTestCase(TestCase):
    def setUp(self):
        self.motos = [mock_dynamodb2(), mock_sqs()]
        [m.start() for m in self.motos]
        Page.create_table(wait=True)
        Site.create_table(wait=True)
        boto3.client('sqs').create_queue(QueueName=mock_sqs_name)

    def test_mock(self):
        Page('as', 'asdf', _type='html').save()
        print([p for p in Page.scan()])

    def tearDown(self):
        for m in self.motos:
            m.stop()

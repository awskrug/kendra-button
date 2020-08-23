import asyncio
import json
import os

from chalice import Chalice, CognitoUserPoolAuthorizer
from chalice.app import SQSEvent

from chalicelib.schema import schema
from chalicelib.scraper import handler, operator

STAGE = os.environ.get('CHALICE_STAGE', 'dev')
app = Chalice(app_name='kendra-scrap')
app.debug = True

authorizer = CognitoUserPoolAuthorizer('KendraBtnUserPool', provider_arns=[
    'arn:aws:cognito-idp:us-west-2:213888382832:userpool/us-west-2_XT1s3RtPp'],
                                       header='Authorization'
                                       )


def execute():
    request = app.current_request
    user = request.context.get('authorizer', {}).get('claims', {}).get('cognito:username','test')

    if request.method == 'GET':
        query = request.query_params.get('query')
        variables = request.query_params.get('variables')
        operation_name = request.query_params.get('operation_name')
    else:
        body = json.loads(request.raw_body.decode())
        query = body['query']
        variables = body.get('variables', {})
        operation_name = body.get('operationName')
    print(f'{query=}\n{request=}\n{operation_name}\n{variables=}\n{user=}')

    result = schema.execute(
        query,
        variables=variables,
        operation_name=operation_name,
        context={
            'user': user
        })
    print(f"{result.data=}")
    return result.data


@app.route('/graphql', methods=['GET', 'POST'], cors=True, authorizer=authorizer)
def query():
    return execute()


@app.route('/noauth/graphql', methods=['GET', 'POST'], cors=True)
def noauth():
    return execute()


@app.lambda_function(name='operator')
def operator_handler(event, context):
    return operator(event, context)


@app.on_sqs_message(f'kendra-btns-page-que-{STAGE}', batch_size=10)
def worker_handler(event: SQSEvent):
    print('run worker')
    print(event.to_dict())
    # request에서 메세시 파싱
    messages = []

    try:
        for record in event:
            body_json = json.loads(record.body)
            messages.append(body_json)

    except Exception as e:
        # Send some context about this error to Lambda Logs
        print(e)
        # throw exception, do not handle. Lambda will make message visible again.
        raise e

    asyncio.get_event_loop().run_until_complete(handler(messages))

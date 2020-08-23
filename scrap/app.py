import json

from chalice import Chalice, CognitoUserPoolAuthorizer

from chalicelib.schema import schema

app = Chalice(app_name='kendra-scrap')

authorizer = CognitoUserPoolAuthorizer('KendraBtnUserPool', provider_arns=[
    'arn:aws:cognito-idp:us-west-2:213888382832:userpool/us-west-2_XT1s3RtPp'],
                                       header='Authorization'
                                       )


@app.route('/graphql', methods=['POST'], cors=True, authorizer=authorizer)
def query():
    q = json.loads(app.current_request.raw_body.decode())['query']
    result = schema.execute(q, context={
        'user': app.current_request.context.get('authorizer', {}).get('claims', {}).get('cognito:username')})
    return result.data


@app.route('/noauth/graphql', methods=['POST'], cors=True)
def noauth():
    q = json.loads(app.current_request.raw_body.decode())['query']
    result = schema.execute(q)
    return result.data

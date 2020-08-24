import asyncio
import json
import os
from functools import partial

from chalice import Chalice, CognitoUserPoolAuthorizer
from chalice.app import Request, Response, SQSEvent
from graphql import GraphQLError, GraphQLSchema
from graphql.error import format_error
from graphql_server import HttpQueryError, encode_execution_results, json_encode, \
    run_http_query

from chalicelib.render_graphiql import GraphiQLConfig, GraphiQLData, GraphiQLOptions, render_graphiql_sync
from chalicelib.schema import schema
from chalicelib.scraper import handler, operator

STAGE = os.environ.get('CHALICE_STAGE', 'dev')
app = Chalice(app_name='kendra-scrap')
app.debug = True

authorizer = CognitoUserPoolAuthorizer('KendraBtnUserPool', provider_arns=[
    'arn:aws:cognito-idp:us-west-2:213888382832:userpool/us-west-2_XT1s3RtPp'],
                                       header='Authorization'
                                       )


class GraphQLView:
    schema = schema
    root_value = None
    context = None
    pretty = False
    graphiql = True
    graphiql_version = None
    graphiql_template = None
    graphiql_html_title = None
    middleware = None
    batch = False
    jinja_env = None
    max_age = 86400
    subscriptions = None
    headers = None
    default_query = None
    header_editor_enabled = None
    should_persist_headers = None

    accepted_methods = ["GET", "POST", "PUT", "DELETE"]

    format_error = staticmethod(format_error)
    encode = staticmethod(json_encode)

    def __init__(self, **kwargs):
        super(GraphQLView, self).__init__()
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)

        assert isinstance(
            self.schema, GraphQLSchema
        ), "A Schema is required to be provided to GraphQLView."

    def get_root_value(self):
        return self.root_value

    def get_context(self, request: Request):
        user = request.context.get('authorizer', {}).get('claims', {}).get('cognito:username')
        return {
            "user": user,
            "request": request
        }

    def get_middleware(self):
        return self.middleware

    # This method can be static
    def parse_body(self, request: Request):
        content_type = request.headers.get('content-type', '')
        # request.text() is the aiohttp equivalent to
        # request.body.decode("utf8")
        if content_type == "application/graphql":
            r_text = request.raw_body.decode()
            return {"query": r_text}

        if content_type == "application/json":
            return request.json_body

        if content_type in (
                "application/x-www-form-urlencoded",
                "multipart/form-data",
        ):
            print(f'request {content_type}\n {request.to_dict()}')

        return {}

    # TODO:
    #  use this method to replace flask and sanic
    #  checks as this is equivalent to `should_display_graphiql` and
    #  `request_wants_html` methods.
    def is_graphiql(self, request: Request):
        query = request.query_params or {}
        return all(
            [
                self.graphiql,
                request.method.lower() == "get",
                "raw" not in query,
                any(
                    [
                        "text/html" in request.headers.get("accept", {}),
                        "*/*" in request.headers.get("accept", {}),
                    ]
                ),
            ]
        )

    # TODO: Same stuff as above method.
    def is_pretty(self, request: Request):
        return any(
            [self.pretty, self.is_graphiql(request), request.query_params.get("pretty")]
        )

    def __call__(self, request: Request):
        try:
            data = self.parse_body(request)
            request_method = request.method.lower()
            is_graphiql = self.is_graphiql(request)
            is_pretty = self.is_pretty(request)

            # TODO: way better than if-else so better
            #  implement this too on flask and sanic
            if request_method == "options":
                return self.process_preflight(request)

            all_params: list
            execution_results, all_params = run_http_query(
                self.schema,
                request_method,
                data,
                query_data=request.query_params,
                batch_enabled=False,
                catch=is_graphiql,
                # Execute options
                run_sync=True,
                root_value=self.get_root_value(),
                context_value=self.get_context(request),
                middleware=self.get_middleware(),
            )

            result, status_code = encode_execution_results(
                execution_results,
                is_batch=False,
                format_error=self.format_error,
                encode=partial(self.encode, pretty=is_pretty),  # noqa: ignore
            )

            if is_graphiql:
                graphiql_data = GraphiQLData(
                    result=result,
                    query=getattr(all_params[0], "query"),
                    variables=getattr(all_params[0], "variables"),
                    operation_name=getattr(all_params[0], "operation_name"),
                    subscription_url=self.subscriptions,
                    headers=self.headers,
                )
                graphiql_config = GraphiQLConfig(
                    graphiql_version=self.graphiql_version,
                    graphiql_template=self.graphiql_template,
                    graphiql_html_title=self.graphiql_html_title,
                    jinja_env=self.jinja_env,
                )
                graphiql_options = GraphiQLOptions(
                    default_query=self.default_query,
                    header_editor_enabled=self.header_editor_enabled,
                    should_persist_headers=self.should_persist_headers,
                )
                source = render_graphiql_sync(
                    data=graphiql_data, config=graphiql_config, options=graphiql_options
                )
                return Response(
                    status_code=200,
                    body=source,
                    headers={'Content-Type': "text/html"}
                )

            return Response(
                body=result,
                status_code=status_code,
                headers={'Content-Type': "application/json"}
            )

        except HttpQueryError as err:
            parsed_error = GraphQLError(err.message)
            return Response(
                body=self.encode(dict(errors=[self.format_error(parsed_error)])),
                status_code=err.status_code,
                headers={
                    **err.headers,
                    'Content-Type': "application/json"
                },

            )

    def process_preflight(self, request: Request):
        """
        Preflight request support for apollo-client
        https://www.w3.org/TR/cors/#resource-preflight-requests
        """
        headers = request.headers
        origin = headers.get("Origin", "")
        method = headers.get("Access-Control-Request-Method", "").upper()

        if method and method in self.accepted_methods:
            return Response(
                status_code=200,
                headers={
                    "Access-Control-Allow-Origin": origin,
                    "Access-Control-Allow-Methods": ", ".join(self.accepted_methods),
                    "Access-Control-Max-Age": str(self.max_age),
                },
            )
        return Response(status_code=400)


#
# def execute(request):
#     user = request.context.get('authorizer', {}).get('claims', {}).get('cognito:username')
#
#     if request.method == 'GET':
#         query = request.query_params.get('query')
#         variables = request.query_params.get('variables')
#         operation_name = request.query_params.get('operation_name')
#     else:
#         body = json.loads(request.raw_body.decode())
#         query = body['query']
#         variables = body.get('variables', {})
#         operation_name = body.get('operationName')
#     print(f'{query=}\n{request=}\n{operation_name}\n{variables=}\n{user=}')
#
#     result = schema.execute(
#         query,
#         variables=variables,
#         operation_name=operation_name,
#         context={
#             'user': user
#         })
#     return {
#         'data': result.data,
#         'errors': result.errors
#     }


@app.route('/graphql', methods=['GET', 'POST'], cors=True, authorizer=authorizer)
def query():
    request = app.current_request
    if request.query_params is None:
        request.query_params = {}
    view = GraphQLView()
    return view(request)


@app.route('/noauth/graphql', methods=['GET', 'POST'], cors=True)
def noauth():
    request = app.current_request
    if request.query_params is None:
        request.query_params = {}
    view = GraphQLView()
    return view(request)


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

from flask import Flask
from flask_cors import CORS
from flask_graphql import GraphQLView

try:
    from scrap.schema import schema
except Exception as e:
    from schema import schema

app = Flask(__name__)
CORS(app)
app.config['JSON_AS_ASCII'] = False


@app.route('/')
def hello_world():
    return '<h1>Helllo</h1>'


app.add_url_rule('/graphql', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))
if __name__ == '__main__':
    app.run()

from flask import Flask
from flask_cors import CORS
from flask_graphql import GraphQLView
import sys
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
sys.path.append(BASE_DIR)


# try:
    # from scrap.schema import schema
# except Exception as e:
from schema import schema

app = Flask(__name__)
CORS(app)
app.config['JSON_AS_ASCII'] = False


@app.route('/')
def hello_world():
    return '<h1>Helllo</h1>'

func = GraphQLView.as_view('graphql', schema=schema, graphiql=True)

app.add_url_rule('/graphql', view_func=func)
app.add_url_rule('/noauth/graphql', view_func=func)

if __name__ == '__main__':
    app.run()

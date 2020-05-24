# FIXME: Not sure how to add this in our system
import boto3
from flask import Flask, request, abort, jsonify

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False


@app.route('/')
def hello_world():
    return '<h1>Helllo</h1>'


white_list = [
    'query',
    'list_indices',
    'list_data_sources',
    'list_indices',
    'list_faqs',
    'describe_data_source',
    'describe_faq',
    'describe_index',
]


@app.route('/kendra/<method>', methods=['POST'])
def kendra_client(method: str):
    kendra = boto3.client('kendra')
    if method not in white_list:
        abort(404)
    try:
        return jsonify(getattr(kendra, method)(**request.form))
    except Exception as e:
        return jsonify({
            'error': f"{e}",
        })

        # We only need this for local development.


if __name__ == '__main__':
    app.run()

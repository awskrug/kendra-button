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
    'start_data_source_sync_job',
    'stop_data_source_sync_job'
    'batch_put_document',
    'batch_delete_document',
    'update_data_source',
    'update_index',
]


@app.route('/kendra/<method>', methods=['POST'])
def kendra_client(method: str):
    if method not in white_list:
        abort(404)

    kendra = boto3.client('kendra')
    try:
        data = request.get_json(silent=True) or {}
        return jsonify(getattr(kendra, method)(**data))
    except Exception as e:
        return jsonify({
            'error': f"{e}",
        })

 # We only need this for local development.
if __name__ == '__main__':
    app.run()

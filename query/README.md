# setup
```shell script
python3 -m venv .venv
. ./.venv/bin/activate
pip install pipreqs
pipreqs . 
pip install -r requirements.txt
npm install -g serverless
npm install serverless-wsgi
npm install serverless-python-requirements
serverless
```

# deploy & view
- Run “serverless deploy” to deploy your service.
- Run “serverless dashboard” to view the dashboard.


# setup
```shell script
cd scrap
python3 -m venv .venv
. ./.venv/bin/activate
pip install -r requirements.txt
npm install -g serverless
sls plugin install -n serverless-python-requirements
sls plugin install -n serverless-wsgi
```

# deploy
```shell script
cd scrap
sls deploy
```

# run server in local
```shell script
cd scrap
. ./.venv/bin/activate
flask run

# http://localhost:5000/graphql
```
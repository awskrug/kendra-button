# prerequisite 
* Python v3.8 
* Node v12.x

# setup
```
 
```

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
## 'dev' stage로 배포하기
```shell script
cd scrap
sls deploy
```

## 개인별 개발 환경 구성 
--stage(-s) 파라미터를 입력하여 개별 개발환경을 구성할 수 있다. 
여기서 {id}는 본인의 id를 사용하거나 dev, production 등의 stage 이름과 겹치지 않는 유일한 키워드를 이용하면 된다.   
```shell script
cd scrap
sls deploy --stage {id}
```

# 개발하기 
## *Operator* lambda function 
### 소스 수정에서 부터 배포 및 테스트까지 
#### 소스 수정
* Operator는 scarp.py에 구현되어있으며, lambda handler 함수는 operator 이다. 
#### 함수 단위 배포
* 최소 1회 전체 리소스를 배포했다면, 수정한 Operator 소스만을 배포해서 배포시간을 단축할 수 있다. 전체 배포시 CloudFormation을 이용하게 되어 많은 시간이 소요된다.    
* Lambda에서 테스트 할 때에는 'sls deploy' 대신 --function 옵션을 추가해서 배포하도록한다.   
```bash 
sls deploy function --function operator --stage {id}
```

#### 배포한 함수 테스트 
* scrap/event_samples 디렉토리에 이벤트 샘플을 이용해 sls invoke로 배포한 함수를 실행해 볼 수 있다.
* 예제  
```bash  
cat event_samples/dynamodb_modify.json | sls invoke -f operator -s {id}
```

## Worker 코드 수정하기
```bash 
sls deploy function --function worker --stage {id}
```


# run server in local
```shell script
cd scrap
. ./.venv/bin/activate
flask run

# http://localhost:5000/graphql
```
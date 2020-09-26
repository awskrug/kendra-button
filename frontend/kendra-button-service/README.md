# Kendra-button Service Guide

> Kendra-button service의 guide 문서입니다

<br>

<br>

#### [Usecase 보러가기](../../draw/usecase.drawio.svg)

<br>


## 1. 사용자 사이트

<br>

```html
<script type="text/javascript" src="kendra.js?site=newsite&floating=true" defer></script>
```

- 위의 HTML script tag를 **kendra-button** 서비스를 사용하고자 하는 사이트에 추가한다

<br>
<br>

## 2. `kendra.js` 

>Parameter 처리 및 iframe return

<br>


### 2-1. `kendra.js` architecture

- `https://button.kendra.fun`
  - Sung Kim 교수님이 소유한 domain
    - everypython의 Amplify 에서 handling 할 수 없다
- S3 bucket - **button.kendra.fun**
  - Sung Kim 교수님이 bucket url을 redirct 형식으로 연결 해준다
  - **button.kendra.fun** bucket은 everypython이 소유하고 있다

<br>

### 2-2. Parameter 처리

: Vanilla JS 문법으로 `kendra.js` 를 src로 갖고 있는 **script** tag로부터 parameter를 받는다

- `site`, `target`, `floating`, `_src` 를 인식하여 값을 받아온다
  - **site**
    - `https://admin.kendra.fun` 에서 생성한 crawling site 이름
  - **target**
    - 자신의 site HTML에서 **kendra-button** 검색 화면이 보이게 하고자 하는 영역의 **id** or **class** name
  - **floating**
    - 자산의 site HTML에서 우측 하단에 고정시키고자 한다면 입력
  - **_src**
    - 정형화된 parameter 외에 custom parameter를 받고자 할 때 쓰인다


<br>

### 2-3. iframe return

: 정의된 parameter를 이용하여 새로운 iframe HTML, DOM을 생성하고, 사용자의 site의 영역에 rendering 시켜준다

- #### iframe attribute

    ```html
    <iframe id="" src="" style=""/>
    ```

  - **id**
    - iframe 고유 id
  - **src**
    - 위의 `2-2` 에 정의된 parameter와 함께 `https://service.kendra.fun`을 호출하는 url
  - **style**
    - iframe 영역 안의 inline css
- 주소 뒤에 넘어오는 parameter를 `https://service.kendra.fun`에 전달하여 `https://service.kendra.fun` 이 validation 을 확인한다

<br>
<br>

## 3. `https://service.kendra.fun`

<br>

- 실제로 kendra-button server에 접속하여 검색을 해주는 frontend project
- 주소 뒤에 넘어오는 parameter를 활용하여 validation을 할 수 있다

<br>
<br>

## 4. Local Test 하기
<br>

1. 프로젝트 실행하기
   ```bash
   $ cd frontend/kendra-buton-servce
   $ yarn start
   ```

2. `frontend/kendra-button-service/sample.html` 에서 local test를 위한 **script** 를 import 한 뒤 실행
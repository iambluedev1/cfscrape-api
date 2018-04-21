# CfScrape Api

A Restful api to bypass Cloudflare's anti-bot and get the page contents for webscraping app.
> A java implementation of this api can be viewed [here](https://github.com/iambluedev1/cfscrape-java).

### Install
> git clone https://github.com/iambluedev1/cfscrape-api.git

> npm install

### Usage
> npm start

or

> npm run dev

The api is listening on the port 8888.

### RESTful API

|  Path | Method | Fields | Description
| ------------ | ------------ | ------------ | ------------ |
| /wait | POST | url | Wait for pages contents |
| /get | POST | url | Initialize bypassing task |
| /raw/{token} |  GET | | Raw response |

#### Params

|  Param  | Description |
| ------------ | ------------ |
| url  | Website with the CloudFlare's Protection |
| token  | The request "/get" will return you a token |

#### Responses

Request for */wait* with field *https://kfaction.net/banlist* :
```curl
curl --request POST \
  --url http://127.0.0.1:8888/wait \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data url=https://kfaction.net/banlist
```

Response :
```json
{
    "url": "https://kfaction.net/banlist",
    "html": "html content here"
}
```

---

Request for */get* with field *https://kfaction.net/banlist* :
```curl
curl --request POST \
  --url http://127.0.0.1:8888/get \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data url=https://kfaction.net/banlist
```

Response :
```json
{
    "token": "7Aap85Z4dd",
    "startedAt": 1524321384,
    "refreshAt": 1524326884,
    "estimatedTime": 5500,
    "rawUrl":"http://127.0.0.1:8888/raw/7Aap85Z4dd"
}
```
---

Request for */raw/7Aap85Z4dd* :
```curl
curl --request GET \
  --url http://127.0.0.1:8888/raw/7Aap85Z4dd
```
Response :
```json
{
    "token": "7Aap85Z4dd",
    "finished": true,
    "url": "https://kfaction.net/banlist",
    "html": "html content here"
}
```
package baiduspeech

import (
	"chatbot/network"

	"encoding/json"
	"log"
)

var _ACCESS_TOKEN = ""

const _CLIENT_ID = "yWvU4ybjpBosOB8exqPGGaZr"
const _CLIENT_SECRET = "0kzjPFfXDoKOrM6MejOdMroBnPHCrxwW"
const _AUTH_URL = "https://openapi.baidu.com/oauth/2.0/token"

type auth struct {
	ACCESS_TOKEN string `json:"access_token"`
}

func init() {
	getAuth()
}

func getAuth() {

	para := make(map[string]string)

	para["client_id"] = _CLIENT_ID
	para["client_secret"] = _CLIENT_SECRET
	para["grant_type"] = "client_credentials"

	resp, err := network.Get(_AUTH_URL, para)

	if err != nil {
		log.Println("获取授权认证失败")
		panic(err.Error())
	}

	a := auth{}

	err = json.Unmarshal(resp, &a)

	if err != nil {
		log.Println("获取授权认证失败")
		panic(err)
	}

	_ACCESS_TOKEN = a.ACCESS_TOKEN
}

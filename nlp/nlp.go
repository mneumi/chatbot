package nlp

import (
	"chatbot/network"

	"encoding/json"
	"log"
)

const _TULING_URL = "http://openapi.tuling123.com/openapi/api/v2"

func Response(info string, cuid string, spd string, pit string, vol string, per string) string {

	tulingJson := `{"reqType":0,"perception":{"inputText":{"text":"` + info + `"},"selfInfo":{"location":{"city":"广州","province":"广东","street": "番禺区"}}},"userInfo":{"apiKey":"20d93ad716244a33bb30ade9d1a01bbe","userId":"` + cuid + `"}}`

	nlpResult := tuling(tulingJson)

	return nlpResult
}

type first struct {
	Intent  secondIntent    `json:"intent"`
	Results []secondResults `json:"results"`
}

type secondIntent struct {
	Code       int      `json:"code"`
	IntentName string   `json:"intentName"`
	ActionName string   `json:"actionName"`
	Parameters thridOne `json:"parameters"`
}

type thridOne struct {
	NearbyPlace string `json:"nearby_place"`
}

type secondResults struct {
	GroupType  int      `json:"groupType"`
	ResultType string   `json:"resultType"`
	Values     thirdTwo `json:"values"`
}

type thirdTwo struct {
	Url  string `json:"url"`
	Text string `json:"text"`
}

func tuling(tulingJson string) string {
	b, err := network.Post(_TULING_URL, "application/json", tulingJson)

	if err != nil {
		log.Println(err)
	}

	res := first{}

	err = json.Unmarshal(b, &res)

	if err != nil {
		log.Println("json parse error")
		log.Println(err)
		return "tuling error: " + err.Error()
	}

	return res.Results[0].Values.Text
}

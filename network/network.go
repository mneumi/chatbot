package network

import (
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

func Post(url string, header string, para string) ([]byte, error) {

	resp, err := http.Post(url, header, strings.NewReader(para))

	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return nil, err
	}

	return body, nil
}

func Get(url string, para map[string]string) ([]byte, error) {

	client := &http.Client{}

	resp, err := client.Get(makeUrl(url, para))

	if err != nil {
		log.Println(err.Error())
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return nil, err
	}

	return body, nil
}

func makeUrl(url string, para map[string]string) string {

	url += "?"

	for k, v := range para {
		var temp = k + "=" + v + "&"
		url += temp
	}

	return url[:len(url)-1]
}

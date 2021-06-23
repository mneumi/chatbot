package main

import (
	"chatbot/api"
	_ "chatbot/baiduspeech"

	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/api/v1/word", api.Word)
	http.HandleFunc("/api/v1/voice", api.Voice)

	log.Fatal(http.ListenAndServe(":33333", nil))
}

package api

import (
	"chatbot/baiduspeech"
	"chatbot/nlp"
	"chatbot/tools"
	"log"

	"io/ioutil"
	"net/http"
	"strings"
)

func Word(w http.ResponseWriter, r *http.Request) {

	r.ParseForm()

	info := r.FormValue("info")
	cuid := strings.Split(r.FormValue("cuid"), ",")[0]
	spd := strings.Split(r.FormValue("spd"), ",")[0]
	pit := strings.Split(r.FormValue("pit"), ",")[0]
	vol := strings.Split(r.FormValue("vol"), ",")[0]
	per := strings.Split(r.FormValue("per"), ",")[0]

	nlpResult := nlp.Response(info, cuid, spd, pit, vol, per)

	var ret string = `{"nlp":"` + nlpResult + `"}`

	w.Write([]byte(ret))
}

func Voice(w http.ResponseWriter, r *http.Request) {

	r.ParseMultipartForm(204800)

	cuid := strings.Split(r.MultipartForm.Value["cuid"][0], ",")[0]
	devPid := r.MultipartForm.Value["dev_pid"][0]
	spd := r.MultipartForm.Value["spd"][0]
	pit := r.MultipartForm.Value["pit"][0]
	vol := r.MultipartForm.Value["vol"][0]
	per := r.MultipartForm.Value["per"][0]

	fileHeader := r.MultipartForm.File["file"][0]
	file, err := fileHeader.Open()

	if err != nil {
		log.Println("error: ", err.Error())
		w.Write([]byte("Server Error ..."))
		return
	}

	tools.RemoveExistFile("./audio/sound.amr")

	fileByte, err := ioutil.ReadAll(file)

	if err != nil {
		log.Println("read sound file error: ", err.Error())
		w.Write([]byte("语言上传失败"))
	}

	tools.CreateFile("./audio/sound.amr", fileByte)

	info := baiduspeech.Asr("./audio/sound.amr", cuid, devPid)

	nlpResult := nlp.Response(info, cuid, spd, pit, vol, per)

	w.Write([]byte(nlpResult))
}

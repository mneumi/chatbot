package baiduspeech

import (
	"chatbot/network"
	"chatbot/tools"
	_ "chatbot/tools"

	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"strconv"
)

const _ASR_URL = "http://vop.baidu.com/server_api"

type asrPara struct {
	Format  string `json:"format"`
	Rate    int    `json:"rate"`
	Channel int    `json:"channel"`
	Cuid    string `json:"cuid"`
	Token   string `json:"token"`
	DevPid  int    `json:"dev_pid"`
	Len     int    `json:"len"`
	Speech  string `json:"speech"`
}

type asrResult struct {
	ErrNo  int      `json:"err_no"`
	ErrMsg string   `json:"err_msg"`
	Result []string `json:"result"`
}

func encodingToBase64(b []byte) string {
	return base64.StdEncoding.EncodeToString(b)
}

func amrToPcm(source string, target string) {

	os.Create("./audio/output.pcm")

	command := fmt.Sprintf("ffmpeg -y -i %s -acodec pcm_s16le -f s16le -ac 1 -ar 16000 %s", source, target)

	cmd := exec.Command("/bin/bash", "-c", command)
	err := cmd.Run()

	if err != nil {
		log.Println("acmToPcm: Error: ", err.Error())
		panic(err)
	}
}

func Asr(filePath string, cuid string, devPidStr string) string {

	ret := ""
	devPid, _ := strconv.Atoi(devPidStr)

	tools.RemoveExistFile("./audio/output.pcm")

	amrToPcm(filePath, "./audio/output.pcm")

	file, err := os.Open("./audio/output.pcm")

	if err != nil {
		log.Println(err)
		panic(err)
	}

	defer file.Close()

	fileByte, _ := ioutil.ReadAll(file)

	length := len(fileByte)

	base64String := encodingToBase64(fileByte)

	ap := asrPara{
		Format:  "pcm",
		Rate:    16000,
		Channel: 1,
		Cuid:    cuid,
		Token:   _ACCESS_TOKEN,
		DevPid:  devPid,
		Len:     length,
		Speech:  base64String,
	}

	apJson, _ := json.Marshal(ap)

	resp, err := network.Post(_ASR_URL, "application/json", string(apJson))

	if err != nil {
		log.Println("Asr 发生错误: ", err.Error())
		panic(err)
	}

	ar := asrResult{}

	err = json.Unmarshal(resp, &ar)

	if err != nil || ar.ErrNo != 0 {
		ret = "语音识别失败"
	} else {
		ret = ar.Result[0]
	}

	return ret
}

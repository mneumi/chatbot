package tools

import (
	"log"
	"os"
)

func CreateFile(filePath string, b []byte) {

	f, err := os.OpenFile(filePath, os.O_RDWR|os.O_CREATE, 0766)

	if err != nil {
		log.Println("创建文件失败")
		panic(err)
	}

	defer f.Close()

	f.Write(b)
}

func RemoveExistFile(filePath string) {

	_, exist := os.Stat(filePath) // 文件存在，则 exist 为 nil

	if exist == nil {
		os.Remove(filePath)
	}
}

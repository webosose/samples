# Copyright (c) 2021-2022 LG Electronics, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0

import cv2
import numpy as np
import requests
import os
import pyaudio
import wave
from collections import Counter

def talk(text):
    from gtts import gTTS
    import os
    mytext = text
    language = 'en'
    myobj = gTTS(text=mytext, lang=language, slow=False)
    myobj.save("welcome.mp3")
    os.system("mpg123 " + "welcome.mp3")


def take_alter_command():
    def voicein():
        CHUNK = 515
        FORMAT = pyaudio.paInt16
        CHANNELS = 2
        RATE = 44100
        RECORD_SECONDS = 5
        WAVE_OUTPUT_FILENAME = "output.wav"

        p = pyaudio.PyAudio()

        stream = p.open(format=FORMAT,
                        channels=CHANNELS,
                        rate=RATE,
                        input=True,
                        frames_per_buffer=CHUNK)
        print("* recording")

        frames = []

        for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
            data = stream.read(CHUNK)
            frames.append(data)
        print("* done recording")

        stream.stop_stream()
        stream.close()
        p.terminate()

        wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(p.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))
        wf.close()

        from google.cloud import speech
        import io

        client = speech.SpeechClient()
        speech_file = "/home/root/ObjectDetection/output.wav"

        with io.open(speech_file, "rb") as audio_file:
            content = audio_file.read()

        audio = speech.RecognitionAudio(content=content)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=44100,
            language_code="en-US",
            audio_channel_count=2,
        )

        response = client.recognize(config=config, audio=audio)

        # Each result is for a consecutive portion of the audio. Iterate through
        # them to get the transcripts for the entire audio file.

        if len(response.results) == 0:
            return voicein()
        else:
            for result in response.results:
                # The first alternative is the most likely one for this portion.

                print(u"Transcript: {}".format(result.alternatives[0].transcript))
                resultvoice = (format(result.alternatives[0].transcript))
                resultvoice = resultvoice.lower()
                if 'lg' in resultvoice:
                    outputvoice = resultvoice.replace('lg', '')
                    return outputvoice
                else:
                    return take_alter_command()
                return resultvoice
    text = voicein()
    return text;

def run_lg():
    InputCommand = take_alter_command()
    InputCommand = InputCommand.lower()
    if "potted plant" in InputCommand:
        InputCommand = InputCommand.replace("potted plant", "pottedplant")
    if "tv monitor" in InputCommand:
        InputCommand = InputCommand.replace("tv monitor", "tvmonitor")
    if "dining table" in InputCommand:
        InputCommand = InputCommand.replace("dining table", "diningtable")
    ObjectToFind = []
    ObjectToFind = (InputCommand.split())
    net = cv2.dnn.readNet('yolov3.weights', 'yolov3.cfg')

    classes = []

    with open('coco.names', 'r') as f:
        classes = f.read().splitlines()

    os.system("luna-send -n 1 -f luna://com.webos.service.camera2/open '{"+'"id": "camera1"}'+"'"+">handle.txt")
    f = open("handle.txt")
    for i in f:
        if "handle" in i:
            h = i.replace('"handle":', '')
            handle = h.replace(" ","")

    os.system("luna-send -n 1 -f luna://com.webos.service.camera2/setFormat '{"+'"handle": '+str(handle)+',"params":{"width": 1920,"height": 1080,"format": "JPEG", "fps": 30}}'+"'")
    os.system("luna-send -n 1 -f luna://com.webos.service.camera2/startPreview '{"+'"handle": '+str(handle)+', "params": {"type":"sharedmemory","source":"0"}}'+"'")
    os.system("rm /home/root/ObjectDetection/picture/*")
    os.system("luna-send -n 1 -f luna://com.webos.service.camera2/startCapture '{"+'"handle": '+str(handle)+',"params":{"width": 1920,"height": 1080,"format": "JPEG","mode":"MODE_ONESHOT","nimage":6},"path":"/home/root/ObjectDetection/picture"}'+"'")
    os.system("ls /home/root/ObjectDetection/picture >imgName.txt")
    f = open("imgName.txt")

    val = 0
    for i in f:
        val = i

    os.system("luna-send -n 1 -f luna://com.webos.service.camera2/stopPreview '{"+'"handle": '+str(handle)+"}'")
    os.system("luna-send -n 1 -f luna://com.webos.service.camera2/close '{"+'"handle": '+str(handle)+"}'")

    if "\n" in val:
        val = val.replace("\n", "")

    imgPath = '/home/root/ObjectDetection/picture/'+val
    img = cv2.imread(imgPath)
    height, width, _ = img.shape
    center = (width/2)

    blob = cv2.dnn.blobFromImage(img, 1/255, (416, 416), (0,0,0), swapRB=True, crop=False)
    net.setInput(blob)
    output_layers_names = net.getUnconnectedOutLayersNames()
    layesOutputs = net.forward(output_layers_names)

    boxes = []
    confidences = []
    class_ids = []

    for output in layesOutputs:
        for detection in output:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence > 0.5:
                center_x = int(detection[0]*width)
                center_y = int(detection[1]*height)
                w = int(detection[2]*width)
                h = int(detection[3]*height)

                x = int(center_x - w/2)
                y = int(center_y - h/2)

                boxes.append([x, y, w, h])
                confidences.append((float(confidence)))
                class_ids.append(class_id)

    indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
    font = cv2.FONT_HERSHEY_PLAIN
    colors = np.random.uniform(0, 255, size=(len(boxes), 3))

    items = []
    position = []
    position2 = []

    for i in indexes.flatten():
        x, y, w, h = boxes[i]
        label = str(classes[class_ids[i]])
        items.append(label)
        position.append(x)
        position2.append(x+w)
        confidence = str(round(confidences[i],2))
        color = colors[i]
        cv2.rectangle(img, (x,y), (x+w, y+h), color, 2)
        cv2.putText(img, label +" "+ confidence, (x, y+20), font, 2, (255,255,255), 2)

    cv2.imwrite('/media/internal/ObjectDetectionImage/image.jpg',img)
    temp = ("luna-send -n 1 luna://com.webos.applicationManager/launch '{"+'"id":"com.app.objectviewer", "params":{"imagePath": "/media/internal/ObjectDetectionImage/image.jpg", "imageLabel": "Test Image"}}'+"'")
    temp2 = ("luna-send -n 1 -f luna://com.webos.applicationManager/closeByAppId '{"+'"id":"com.app.objectviewer"}'+"'")
    os.system(temp2)
    os.system(temp)
    ObjectToFindLen = len(ObjectToFind)
    ObjectToFindCount = 0
    f=0
    p1 = 0
    p2 = 0
    duplicate_dict = Counter(items)
    dis = ((center*15)/100)
    for i in ObjectToFind:
        ObjectToFindCount = ObjectToFindCount + 1
        if i in classes:
            if i in items:
                f=1
                TotalObject = duplicate_dict[i]
                if TotalObject == 1:
                    coord = items.index(i)
                    if((position[coord] <= center) and (position2[coord] >= center)):
                        talk(i+" found in the center")
                    if((position[coord] < center) and (position2[coord] <= center)):
                        if (position2[coord] >= (center - dis)):
                            talk(i+" found in the left but close to the center")
                        elif (position[coord] <= dis):
                            talk(i+" found towards the left most end")
                        else:
                            talk(i+" found in the left middle")
                    if((position[coord] >= center) and (position2[coord] > center)):
                        if (position[coord] <= (center + dis)):
                            talk(i+" found in the right but close to the center")
                        elif (position2[coord] >= (width - dis)):
                            talk(i+" found towards the right most end")
                        else:
                            talk(i+" found in the right middle")

                if TotalObject > 1:
                    talk("total "+str(TotalObject)+" "+i+" found")
                    w = 0
                    objcountLeftCenter = 0
                    objcountLeftMiddle = 0
                    objcountLeftEnd = 0
                    objcountRightCenter = 0
                    objcountRightMiddle = 0
                    objcountRightEnd = 0
                    objcountCenter = 0

                    for q in items:
                        if q == i:
                        if((position[w] <= center) and (position2[w] >= center)):
                                objcountCenter = objcountCenter + 1
                            if((position[w] < center) and (position2[w] <= center)):
                                if (position2[w] >= (center - dis)):
                                    objcountLeftCenter = objcountLeftCenter + 1
                                elif (position[w] <= dis):
                                    objcountLeftEnd = objcountLeftEnd + 1
                                else:
                                    objcountLeftMiddle = objcountLeftMiddle + 1
                            if((position[w] >= center) and (position2[w] > center)):
                                if (position[w] <= (center + dis)):
                                    objcountRightCenter = objcountRightCenter + 1
                                elif (position2[w] >= (width - dis)):
                                    objcountRightEnd = objcountRightEnd + 1
                                else:
                                    objcountRightMiddle = objcountRightMiddle + 1
                        w = w+1
                    talk("out of which ")
                    if objcountLeftCenter != 0:
                        talk(str(objcountLeftCenter)+" "+i+" found in the left but close to the center")
                    if objcountLeftMiddle != 0:
                        talk(str(objcountLeftMiddle)+" "+i+" found in the left middle")
                    if objcountLeftEnd != 0:
                        talk(str(objcountLeftEnd)+" "+i+" found towards the left most end")
                    if objcountRightCenter != 0:
                        talk(str(objcountRightCenter)+" "+i+" found in the right but close to the center")
                    if objcountRightMiddle != 0:
                        talk(str(objcountRightMiddle)+" "+i+" found in the right middle")
                    if objcountRightEnd != 0:
                        talk(str(objcountRightEnd)+" "+i+" found towards the right most end")
                    if objcountCenter != 0:
                        talk(str(objcountCenter)+" "+i+" found in the center")
            else:
                f=1
                talk(i+" not found")

        else:
            if ObjectToFindCount == ObjectToFindLen:
                s=0
                for i in ObjectToFind:
                    s = s+1
                    if s <= (len(ObjectToFind) - 1):
                        val = (i+" "+ObjectToFind[s])
                        if val in classes:
                            if val in items:
                                f=1
                                TotalObject = duplicate_dict[val]
                                if TotalObject == 1:
                                    coord = items.index(val)
                                    if((position[coord] <= center) and (position2[coord] >= center)):
                                        talk(val+" found in the center")
                                    if((position[coord] < center) and (position2[coord] <= center)):
                                        if (position2[coord] >= (center - dis)):
                                            talk(val+" found in the left but close to the center")
                                        elif (position[coord] <= dis):
                                            talk(val+" found towards the left most end")
                                        else:
                                            talk(val+" found in the left middle")
                                    if((position[coord] >= center) and (position2[coord] > center)):
                                        if (position[coord] <= (center + dis)):
                                            talk(val+" found in the right but close to the center")
                                        elif (position2[coord] >= (width - dis)):
                                            talk(val+" found towards the right most end")
                                        else:
                                            talk(val+" found in the right middle")

                                if TotalObject > 1:
                                    talk("total "+str(TotalObject)+" "+val+" found")
                                    w = 0
                                    objcountLeftCenter = 0
                                    objcountLeftMiddle = 0
                                    objcountLeftEnd = 0
                                    objcountRightCenter = 0
                                    objcountRightMiddle = 0
                                    objcountRightEnd = 0
                                    objcountCenter = 0
                                    for q in items:

                                        if q == val:
                                            if((position[w] <= center) and (position2[w] >= center)):
                                                objcountCenter = objcountCenter + 1
                                            if((position[w] < center) and (position2[w] <= center)):
                                                if (position2[w] >= (center - dis)):
                                                    objcountLeftCenter = objcountLeftCenter + 1
                                                elif (position[w] <= dis):
                                                    objcountLeftEnd = objcountLeftEnd + 1
                                                else:
                                                    objcountLeftMiddle = objcountLeftMiddle + 1
                                            if((position[w] >= center) and (position2[w] > center)):
                                                if (position[w] <= (center + dis)):
                                                    objcountRightCenter = objcountRightCenter + 1
                                                elif (position2[w] >= (width - dis)):
                                                    objcountRightEnd = objcountRightEnd + 1
                                                else:
                                                    objcountRightMiddle = objcountRightMiddle + 1
                                        w = w+1
                                    talk("out of which ")
                                    if objcountLeftCenter != 0:
                                        talk(str(objcountLeftCenter)+" "+val+" found in the left but close to the center")
                                    if objcountLeftMiddle != 0:
                                        talk(str(objcountLeftMiddle)+" "+val+" found in the left middle")
                                    if objcountLeftEnd != 0:
                                        talk(str(objcountLeftEnd)+" "+val+" found towards the left most end")
                                    if objcountRightCenter != 0:
                                        talk(str(objcountRightCenter)+" "+val+" found in the right but close to the center")
                                    if objcountRightMiddle != 0:
                                        talk(str(objcountRightMiddle)+" "+val+" found in the right middle")
                                    if objcountRightEnd != 0:
                                        talk(str(objcountRightEnd)+" "+val+" found towards the right most end")
                                    if objcountCenter != 0:
                                        talk(str(objcountCenter)+" "+val+" found in the center")
                            else:
                                f=1
                                talk(val+" not found")
                    if s == (ObjectToFindLen -1) and f==0:
                        talk("Sorry no object found")
while True:
    run_lg()

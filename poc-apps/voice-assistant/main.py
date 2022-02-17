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

import pyaudio
import speech_recognition as sr
import wave
import requests
import datetime
import wikipedia
import pickle
import os
import os.path
import time
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
import httplib2
import os
from oauth2client import file
from apiclient import discovery
import oauth2client
from oauth2client import client
from oauth2client import tools
from datetime import datetime

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/calendar']

def talk(text):
    from gtts import gTTS
    import os
    mytext = text
    text_file = open("/usr/palm/services/voiceui/public/js/output.txt", "w")
    n = text_file.write(mytext)
    text_file.close()
    language = 'en'
    myobj = gTTS(text=mytext, lang=language, slow=False)
    myobj.save("welcome.mp3")
    text_file = open("/usr/palm/services/voiceui/public/js/status.txt", "w")
    n = text_file.write("Answering...")
    text_file.close()
    os.system("mpg123 " + "welcome.mp3")

def take_command():
    """Transcribe the given audio file."""

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
        text_file = open("/usr/palm/services/voiceui/public/js/status.txt", "w")
        n = text_file.write("Listening...")
        text_file.close()

        frames = []

        for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
            data = stream.read(CHUNK)
            frames.append(data)

        print("* done recording")
        text_file = open("/usr/palm/services/voiceui/public/js/status.txt", "w")
        n = text_file.write("Processing...")
        text_file.close()

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
        speech_file = "/usr/palm/services/voiceui/output.wav"

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

                    text_file = open("/usr/palm/services/voiceui/public/js/input.txt", "w")
                    n = text_file.write(outputvoice)
                    text_file.close()

                    text_file = open("/usr/palm/services/voiceui/public/js/output.txt", "w")
                    n = text_file.write("")
                    text_file.close()

                    return outputvoice
                else:
                    return take_command()

    text = voicein()
    return text;


def take_alter_command():
    """Transcribe the given audio file."""

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
        text_file = open("/usr/palm/services/voiceui/public/js/status.txt", "w")
        n = text_file.write("Listening...")
        text_file.close()

        frames = []

        for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
            data = stream.read(CHUNK)
            frames.append(data)

        print("* done recording")
        text_file = open("/usr/palm/services/voiceui/public/js/status.txt", "w")
        n = text_file.write("Processing...")
        text_file.close()

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
        speech_file = "/usr/palm/services/voiceui/output.wav"
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
                text_file = open("/usr/palm/services/voiceui/public/js/input.txt", "w")
                n = text_file.write(resultvoice)
                text_file.close()

                return resultvoice
    text = voicein()

    return text;

def run_lg():
    command = take_command()
    print(command)
    if 'play' in command:
        try:
            import urllib.request
            import re
            if 'play' in command:
                command = command.replace('play ', '')
            talk("playing "+command)
            if ' ' in command:
                command=command.replace(' ','+')
            html = urllib.request.urlopen("https://www.youtube.com/results?search_query="+command)
            video_ids = re.findall(r"watch\?v=(\S{11})", html.read().decode())
            searchresult = (video_ids[0])
            temp = ('luna-send -n 1 -f luna://com.webos.service.applicationmanager/launch '+"'"+'{"id":"com.webos.app.enactbrowser", "params": {"target":"https://www.youtube.com/watch?v='+searchresult+'"'+"}}'")
            os.system(temp)
        except:
            talk("This youtube operation is having some issue please try again!")

    elif 'who is' in command:
        try:
            person = command.replace('who is', '')
            temp = ('luna-send -n 1 -f luna://com.webos.service.applicationmanager/launch '+"'"+'{"id":"com.webos.app.enactbrowser", "params": {"target":"https://en.wikipedia.org/wiki/'+person+'"'+"}}'")
            os.system(temp)
            info = wikipedia.summary(person, 1);
            talk(info)
        except:
            talk("This wiki operation is having some issue please try again!")

    elif 'temperature' in command or 'weather' in command:
        try:
            def cityValidate(name):
                complete_url = base_url + "appid=" + api_key + "&q=" + name
                response = requests.get(complete_url)
                x = response.json()
                return x, complete_url
            if 'tell' in command:
                command = command.replace('tell','')
            if 'how' in command:
                command = command.replace('how','')
            import requests, json
            api_key = "ed5459fa93e76130e7d895742ee345dd"
            base_url = "http://api.openweathermap.org/data/2.5/weather?"
            temp = 0
            if 'today' in command or 'outside' in command or 'place' in command or 'location' in command:
                city_name = 'bengaluru'
                complete_url = base_url + "appid=" + api_key + "&q=" + city_name
                response = requests.get(complete_url)
                x = response.json()
                temp = 1
            else:
                brk = command.split()
                s=0
                temp=0
                t = 0
                for i in brk:
                    if (s+2) < len(brk):
                        h=(i+" "+brk[s+1]+" "+brk[s+2])
                        x, complete_url = cityValidate(h)
                        if x["cod"] != "404":
                            temp = 1
                            city_name = h
                            break
                    s=s+1
                if temp == 0:
                    for i in brk:
                        if (t+1) < len(brk):
                            h=(i+" "+brk[t+1])
                            x, complete_url = cityValidate(h)
                            if x["cod"] != "404":
                                temp = 1
                                city_name = h
                                break
                        t=t+1
                if temp == 0:
                    for i in brk:
                        x, complete_url = cityValidate(i)
                        if x["cod"] != "404":
                            temp = 1
                            city_name = i
                            break
            if temp == 1:
                url=("https://www.timeanddate.com/weather/india/"+city_name)
                temp = ('luna-send -n 1 -f luna://com.webos.service.applicationmanager/launch '+"'"+'{"id":"com.webos.app.enactbrowser", "params": {"target":"'+city_name+' weather"'+"}}'")
                os.system(temp)
                response = requests.get(complete_url)
                y = x["main"]
                current_temperature = y["temp"]
                temperature = current_temperature - 273.15
                current_pressure = y["pressure"]
                current_humidiy = y["humidity"]
                z = x["weather"]
                weather_description = z[0]["description"]
                temperature = int(temperature)
                temperature = str(temperature)
                current_pressure = str(current_pressure)
                current_humidiy = str(current_humidiy)
                weather_description = str(weather_description)
                if 'temperature' in command:
                    talk("Today in "+ city_name +" the temperature is "+temperature+" degree Celsius")
                if 'weather' in command:
                    talk("Today in "+ city_name +" the temperature is "+temperature+" degree Celsius")
                    talk("with an atmospheric pressure of "+current_pressure+" hPa")
                    talk("and humidity of "+current_humidiy+" percent with "+weather_description)

                    print(" Temperature (in kelvin unit) = " +
                                    str(int(temperature)) +
                        "\n atmospheric pressure (in hPa unit) = " +
                                    str(current_pressure) +
                        "\n humidity (in percentage) = " +
                                    str(current_humidiy) +
                        "\n description = " +
                                    str(weather_description))
            else:
                talk("city not found")
        except:
            talk("This weather operation is having some issue please try again!")

    elif 'time' in command:
        try:
            time = datetime.now().strftime('%I:%M %p')
            print(time)
            talk('Current time is ' + time)
        except:
            talk("This operation is having some issue please try again!")

    elif 'date' in command:
        try:
            from datetime import date
            today = date.today()
            today = datetime.now().strftime("%d %B, %Y")
            print("Today's date:", today)
            talk("Today's date:" + today)
        except:
            talk("This operation is having some issue please try again!")

    elif 'create' in command and ('calendar' in command or 'event' in command):
        def get_credentials():
            """Gets valid user credentials from storage.

            If nothing has been stored, or if the stored credentials are invalid,
            the OAuth2 flow is completed to obtain the new credentials.

            Returns:
                Credentials, the obtained credential.
            """
            try:
                import argparse
                flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
            except ImportError:
                flags = None

            # If modifying these scopes, delete your previously saved credentials
            # at ~/.credentials/calendar-python-quickstart.json
            SCOPES = 'https://www.googleapis.com/auth/calendar'
            CLIENT_SECRET_FILE = 'credentials.json'
            APPLICATION_NAME = 'Google Calendar API Python Quickstart'

            home_dir = os.path.expanduser('~')
            credential_dir = os.path.join(home_dir, '.credentials')
            if not os.path.exists(credential_dir):
                os.makedirs(credential_dir)
            credential_path = os.path.join(credential_dir,
                                           'calendar-python-quickstart.json')

            store = oauth2client.file.Storage(credential_path)
            credentials = store.get()
            if not credentials or credentials.invalid:
                flow = client.flow_from_clientsecrets(CLIENT_SECRET_FILE, SCOPES)
                flow.user_agent = APPLICATION_NAME
                if flags:
                    credentials = tools.run_flow(flow, store, flags)
                else:  # Needed only for compatibility with Python 2.6
                    credentials = tools.run(flow, store)
                print('Storing credentials to ' + credential_path)
            return credentials

        def create_event():
            try:
                import datetime
                import time
                """Shows basic usage of the Google Calendar API.

                Creates a Google Calendar API service object and outputs a list of the next
                10 events on the user's calendar.
                """
                credentials = get_credentials()
                http = credentials.authorize(httplib2.Http())
                service = discovery.build('calendar', 'v3', http=http)

                # Refer to the Python quickstart on how to setup the environment:
                # https://developers.google.com/google-apps/calendar/quickstart/python
                # Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
                # stored credentials.
                talk('Sure, what is the title of the event: ')
                opt_var = take_alter_command()
                title = opt_var

                def start_time():
                    talk('start time of event: ')
                    str1 = take_alter_command()
                    if 'a.m.' in  str1 :
                        str1 = str1.replace('a.m.', '')
                        if ' 'in str1:
                            str1 = str1.replace(' ','')
                        if len(str1) == 1 or len(str1) == 2:
                            str1 = (str1 +":00")
                        if str1[:2] == "12":
                            start=( "00" + str1[2:])
                        else:
                            start =( str1)
                    elif 'p.m.' in  str1 :
                        str1 = str1.replace('p.m.', '')
                        if ' 'in str1:
                            str1 = str1.replace(' ','')
                        if len(str1) == 1:
                            str1 = ("0"+str1 +":00")
                        if len(str1) == 2:
                            str1 = (str1 + ":00")
                        if len(str1) == 4:
                            str1 = ("0"+str1)
                        if str1[:2] == "12":
                            start = (str1)
                        else:
                            start = (str(int(str1[:2]) + 12) + str1[2:5])
                    else:
                        talk("Please specify AM or PM in you Start time of Event")
                        start = start_time()
                    return start
                start = start_time()


                def end_time():
                    talk('end time of event: ')
                    str1 = take_alter_command()
                    if 'a.m.' in  str1 :
                        str1 = str1.replace('a.m.', '')
                        if ' 'in str1:
                            str1 = str1.replace(' ','')
                        if len(str1) == 1 or len(str1) == 2:
                            str1 = (str1 +":00")
                        if str1[:2] == "12":
                            end=( "00" + str1[2:])
                        else:
                            end =(str1)
                    elif 'p.m.' in  str1 :
                        str1 = str1.replace('p.m.', '')
                        if ' 'in str1:
                            str1 = str1.replace(' ','')
                        if len(str1) == 1:
                            str1 = ("0"+str1 +":00")
                        if len(str1) == 2:
                            str1 = (str1 + ":00")
                        if len(str1) == 4:
                            str1 = ("0"+str1)
                        if str1[:2] == "12":
                            end = ( str1)
                        else:
                            end = ( str(int(str1[:2]) + 12) + str1[2:5])

                    else:
                        talk("Please specify AM or PM in your End time of Event")
                        end = end_time()

                    shr = int(start[0:2])
                    smint = int(start[-2:])
                    ehr = int(end[0:2])
                    emint = int(end[-2:])
                    if (ehr < shr or (ehr == shr and emint <= smint )):
                        talk("End time should always be greater than start time")
                        end = end_time()
                    return end
                end = end_time()
                today = datetime.datetime.today()
                stoday = datetime.datetime.strftime(today, "%Y-%m-%d")
                startdate = stoday+'T'+start+":00"
                enddate = stoday+'T'+end+":00"
                print(startdate)
                print(enddate)
                event = {
                    'summary': title,
                    'start': {
                        'dateTime': startdate,
                        'timeZone': 'Asia/Calcutta',
                    },
                    'end': {
                        'dateTime': enddate,
                        'timeZone': 'Asia/Calcutta',
                    },
                    'reminders': {
                        'useDefault': False,
                        'overrides': [
                            {'method': 'email', 'minutes': 24 * 60},
                            {'method': 'popup', 'minutes': 10},
                        ],
                    },
                }

                event = service.events().insert(calendarId='primary', body=event).execute()
                print('Event created: %s' % (event.get('htmlLink')))
                temp = ('luna-send -n 1 -f luna://com.webos.service.applicationmanager/launch '+"'"+'{"id":"com.webos.app.enactbrowser", "params": {"target":"https://calendar.google.com/'+'"'+"}}'")
                os.system(temp)
                talk("event created")
            except:
                talk("This operation is having some issue please try again!")
        create_event()

    elif 'list' in command and ('calendar' in command or 'event' in command):
        def main():
            try:
                """Shows basic usage of the Google Calendar API.
                Prints the start and name of the next 10 events on the user's calendar.
                """
                creds = None
                # The file token.json stores the user's access and refresh tokens, and is
                # created automatically when the authorization flow completes for the first
                # time.
                if os.path.exists('token.json'):
                    creds = Credentials.from_authorized_user_file('token.json', SCOPES)
                # If there are no (valid) credentials available, let the user log in.
                if not creds or not creds.valid:
                    if creds and creds.expired and creds.refresh_token:
                        creds.refresh(Request())
                    else:
                        flow = InstalledAppFlow.from_client_secrets_file(
                            'credentials.json', SCOPES)
                        creds = flow.run_local_server(port=0)
                    # Save the credentials for the next run
                    with open('token.json', 'w') as token:
                        token.write(creds.to_json())

                service = build('calendar', 'v3', credentials=creds)

                # Call the Calendar API
                now = datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
                print('Getting the upcoming 10 events')
                #events_result = service.events().list(calendarId='primary', timeMin=now,maxResults=10, singleEvents=True,orderBy='startTime').execute()
                events_result = service.events().list(calendarId='primary', timeMin=now,
                                                    maxResults=10, singleEvents=True,
                                                    orderBy='startTime').execute()
                events = events_result.get('items', [])

                if not events:
                    print('No upcoming events found.')
                    talk("No upcoming events found.")
                else:
                    talk("following are the calendar events")
                    for event in events:
                        start = event['start'].get('dateTime', event['start'].get('date'))
                        str2 = (str(start))
                        str2 = str2[-14:-9]
                        d = datetime.strptime(str2, "%H:%M")
                        d2 = (d.strftime("%I:%M %p"))
                        talk(event['summary'] +" at " + str(d2))
            except:
                talk("This operation is having some issue please try again!")

        if __name__ == '__main__':
            main()

    elif 'delete' in command and ('calendar' in command or 'event' in command):
        def main():
            try:
                """Shows basic usage of the Google Calendar API.
                Prints the start and name of the next 10 events on the user's calendar.
                """
                creds = None
                # The file token.json stores the user's access and refresh tokens, and is
                # created automatically when the authorization flow completes for the first
                # time.
                if os.path.exists('token.json'):
                    creds = Credentials.from_authorized_user_file('token.json', SCOPES)
                # If there are no (valid) credentials available, let the user log in.
                if not creds or not creds.valid:
                    if creds and creds.expired and creds.refresh_token:
                        creds.refresh(Request())
                    else:
                        flow = InstalledAppFlow.from_client_secrets_file(
                            'credentials.json', SCOPES)
                        creds = flow.run_local_server(port=0)
                    # Save the credentials for the next run
                    with open('token.json', 'w') as token:
                        token.write(creds.to_json())

                service = build('calendar', 'v3', credentials=creds)

                # Call the Calendar API
                now = datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
                print('Getting the upcoming 10 events')
                #events_result = service.events().list(calendarId='primary', timeMin=now,maxResults=10, singleEvents=True,orderBy='startTime').execute()
                events_result = service.events().list(calendarId='primary', timeMin=now,
                                                    maxResults=10, singleEvents=True,
                                                    orderBy='startTime').execute()
                events = events_result.get('items', [])

                if not events:
                    print('No upcoming events found.')
                    talk("No upcoming events found.")
                else:
                    talk("following are the calendar events")
                    for event in events:
                        start = event['start'].get('dateTime', event['start'].get('date'))
                        str2 = (str(start))
                        str2 = str2[-14:-9]
                        d = datetime.strptime(str2, "%H:%M")
                        d2 = (d.strftime("%I:%M %p"))
                        talk(event['summary'] +" at " + str(d2))
                    talk("which one you want to delete")
                    ename = take_alter_command()
                    s=0
                    h=0
                    dtime = d2
                    for eventt in events:
                        s=s+1
                        if eventt['summary'] == ename:
                            foxs = (eventt['id'])
                            temp = ('luna-send -n 1 -f luna://com.webos.service.applicationmanager/launch '+"'"+'{"id":"com.webos.app.enactbrowser", "params": {"target":"https://calendar.google.com/'+'"'+"}}'")
                            os.system(temp)
                            service.events().delete(calendarId='primary', eventId=foxs).execute()
                            talk(ename +' event at '+ d2 +' deleted')
                        else:
                            h=h+1
                    if s == h:
                        talk(ename+ ' event not found')
            except:
                talk("This operation is having some issue please try again!")

        if __name__ == '__main__':
            main()

    else:
        talk('Please say again.')

while True:
    run_lg()
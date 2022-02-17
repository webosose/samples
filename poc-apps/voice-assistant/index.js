// Copyright (c) 2021-2022 LG Electronics, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-License-Identifier: Apache-2.0

const port = 5500;
_package = require('./package.json');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
flag = false;
const fs = require('fs');
const exec = require('child_process').exec;

app.use(express.static('public'));
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

function appRun() {
    exec('cd /usr/palm/services/voiceui;export GOOGLE_APPLICATION_CREDENTIALS="/usr/palm/services/voiceui/gstt.json";python3 main.py;', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    flag = true;
}


function appKill() {
    exec("pidof python3 main.py", (error, stdout, stderr) => {
    var killAppvalue = 'kill ' + stdout;

    exec(killAppvalue, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    });
    flag = false;
}

app.post('/clicked', (req, res) => {
    if (flag == false) {
        appRun();
        fs.truncate('./public/js/input.txt', 0, function () {
            //console.log('clear input file done');
        });
        fs.truncate('./public/js/output.txt', 0, function () {
            // console.log('clear output file done');
        });
        fs.truncate('./public/js/status.txt', 0, function () {
            //console.log('clear status file done');
        });
        flag = true;
    }
    else {
        appKill();
        fs.truncate('./public/js/status.txt', 0, function () {
            //console.log('clear status file done');
        });

        flag = false;
    }
    res.sendFile(__dirname + '/views/index.html');
});

app.listen(port, () => console.log(`LG voice assistant listening at http://<IPAddress>:${port}`));

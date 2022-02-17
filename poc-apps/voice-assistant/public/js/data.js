function readInput() {
    fetch('/js/input.txt')
        .then(response => response.text())
        .then(data => {
            //console.log(data);
            document.getElementById("inputTextarea").value = data;
            delete data;
        })
    setTimeout(readInput, 500)
    return true;
}

function readOutput() {
    fetch('/js/output.txt')
        .then(response => response.text())
        .then(data => {
            //console.log(data);
            document.getElementById("outputTextarea").value = data;
            delete data;
        })
    setTimeout(readOutput, 500);
    return true;
}

function iconchange(data) {
    if (data == "Listening...") {
        //document.getElementById("readstatus").value = data;
        document.getElementById("statusicon").className = "fa fa-microphone";
    }
    if (data == "Answering...") {
        //document.getElementById("readstatus").value = data;
        document.getElementById("statusicon").className = "fa fa-volume-up";
    }
    if (data == "Processing...") {
       // document.getElementById("readstatus").value = data;
        document.getElementById("statusicon").className = "fa fa-spinner";
    }

    return;
}
function readStatus() {
    fetch('/js/status.txt')
        .then(response => response.text())
        .then(data => {
            //console.log(data);
            iconchange(data);
            //document.getElementById("readstatus").value = data;
            delete data;
        })
    setTimeout(readStatus, 500);
    return true;
}

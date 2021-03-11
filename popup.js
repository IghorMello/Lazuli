var triggers = ["java", "c#", " violência ", " guerra "];

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

function getCustomWords() {
    chrome.storage.sync.get("data", function (items) {
        if (!chrome.runtime.error) {
            var storedTrigs = items["data"];
            if (storedTrigs !== undefined) {
                for (var i = triggers.length; i < storedTrigs.length; i++) {
                    triggers.push(storedTrigs[i]);
                }
            }
        }
    });
}


function findtrigs() {

    var found = 0;
    var message = "Aviso: esta página pode conter palavras como";
    var elements = document.getElementsByTagName('*');

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];
            if (node.nodeType === 3) {
                var string = node.nodeValue;
                string = string.toLowerCase();
                for (var k = 0; k < triggers.length; k++) {
                    var index = string.search(triggers[k]);
                    if (index !== -1) {
                        var end = index + triggers[k].length;
                        if (string[end] === undefined || !isLetter(string[index + triggers[k].length])) {
                            if (message.search(triggers[k]) === -1) {
                                found++;
                                message += (" " + triggers[k] + ",");
                                triggers.splice(k, 1);
                            }
                        }
                    }
                }
            }
        }
    }
    if (found > 0) {
        if (found === 1) {
            message = message.slice(0, -1);
        }
        message += " e outras palavras desencadeantes.";
        alert(message);
    }
}

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(function (mutations, observer) {
    findtrigs();
});

observer.observe(document, {
    attributes: true,
    subtree: true,
});

window.onload = function () {
    getCustomWords();
    var select = document.getElementById("dropdown");
    for (var i = triggers.length - 1; i > 0; i--) {
        var option = document.createElement('option');
        option.text = option.value = triggers[i];
        select.add(option, 0);
    }
    document.getElementById("dropdown").value = "";
};

document.addEventListener('DOMContentLoaded', function () {
    findtrigs();
    function addWord() {
        var newWord = document.getElementById("myText").value;
        newWord = newWord.replace(/[^a-zA-Z-]/g, '').toLowerCase();
        if (triggers.indexOf(newWord) === -1 && newWord !== "") {
            triggers.push(newWord);
            chrome.storage.sync.set({ "data": triggers }, function () {
                findtrigs();
                if (chrome.runtime.error) {
                    console.log("Runtime error.");
                }
            });
        }
        document.getElementById("myText").value = " ";
        getCustomWords();
    }
    document.getElementById('add-Word').onclick = addWord;
});
let lastElement = null;
let timer;
let scrolled = false;
let userScroll = false;
let NodeUrl = "http://207.180.251.133:8000"
const selector = document.getElementById("username");

if (localStorage.getItem('Username') === null || localStorage.getItem('Username').length <= 0) {
    $("main").load("login.html", function () {
        document.querySelector('form').addEventListener('submit', (e) => {
            if (document.getElementById("username").value.length > 0) {
                localStorage.setItem('Username', document.getElementById("username").value);
                $("main").load("home.html", function () {
                    customRequired();
                });
            }
            else {
                window.location.reload();
            }
        });
    });
}
else {
    $("main").load("home.html", function () {
        customRequired();
    });
}

/**
 * Transform UTC timestamp to Local timestamp
 * @param {number} timestamp 
 */
function UTCtoLocalHour(timestamp) {
    let computerOffset = new Date().getTimezoneOffset()
    let time = new Date(timestamp - computerOffset);
    return time.getHours().toString() + ':' + (time.getMinutes() < 10 ? '0' : '') + time.getMinutes().toString();
}
/**
 * Check if the user scroll
 * @param {boolean} check 
 */
function updateScroll(check) {
    var element = document.getElementById("ac-block-id");
    if (scrolled == false) {
        element.scroll({
            top: element.scrollHeight,
            behavior: "smooth"
        });
    }
}

/**
 * Check if the scroll is down then lock him down
 */
function checkDownScroll() {
    var element = document.getElementById("ac-block-id");
    if (element.clientHeight + element.scrollTop == element.scrollHeight) {
        scrolled = false;
        userScroll = false;
    }
    else {
        scrolled = true;
    }
}
function setEndOfContenteditable(contentEditableElement) {
    var range, selection;
    if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if (document.selection)//IE 8 and lower
    {
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}
function handlePaste(e) {
    var clipboardData, pastedData;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');

    // Do whatever with pasteddata
    document.getElementById('message').innerHTML = pastedData;
}

/**
 * Main method
 */
function customRequired() {
    updateMessage(true);
    timer = setInterval(updateMessage, 1000);
    $("ac-block-id").on('scroll', function () {
        userScroll = true;
    });
    document.getElementById('message').addEventListener('paste', handlePaste);
    $('#message').keydown(function (e) {
        // trap the return key being pressed
        setEndOfContenteditable(this);
        if (e.keyCode === 13) {
            Send();
            return false;
        }
    });
    document.querySelector('form').addEventListener('submit', (e) => {
        Send();
    });
}
/**
 * Send the message to API
 */
function Send() {
    const selector = document.getElementById("message");
    if (selector.innerHTML === '' || selector.innerHTML.replace(/<(.|\n)*?>/g, '') === '') {
        selector.style.boxShadow = 'rgb(255 140 220 / 22%) 0px 6.4px 14.4px 0px, rgb(255 140 220 / 0.22) 0px 4.8px 14.4px 0px';
        selector.style.animation = 'shake 0.5s';
        let newone = selector.cloneNode(true);
        selector.parentNode.replaceChild(newone, selector);
        document.getElementById("message").addEventListener('input', (e) => {
            document.getElementById("message").style.boxShadow = null;
            document.getElementById("message").style.animation = null;
        });
    }
    else {
        let object = {
            username: localStorage.getItem('Username'),
            message: selector.innerHTML
        };
        postAsync(NodeUrl + '/message/new', object, function () {
            console.log('Send Ok');
        });
        let sel = document.getElementById("message");
        sel.innerHTML = '';
    }
}
/**
 * Get all or only the new message
 * @param {boolean} all 
 */
function updateMessage(all = false) {
    if (all) {
        getAsync(NodeUrl + '/message', function (json) {
            let selector = document.getElementById("ac-block-id");
            json.forEach(element => {
                if (lastElement != null && element.username != localStorage.getItem('Username') && element.username == lastElement.username) {
                    selector.innerHTML += messageReceiveModel(element.username, element.message, UTCtoLocalHour(element.date), true);
                }
                else if (element.username == localStorage.getItem('Username')) {
                    selector.innerHTML += messageSendModel(element.message, UTCtoLocalHour(element.date));
                }
                else {
                    selector.innerHTML += messageReceiveModel(element.username, element.message, UTCtoLocalHour(element.date));
                }
                lastElement = element;
                updateScroll();
            });
        });
    }
    else {
        getAsync(NodeUrl + '/message/last/' + lastElement.date.toString(), function (json) {
            let selector = document.getElementById("ac-block-id");
            json.forEach(element => {
                removeAllMsgAnimation();
                checkDownScroll();
                if (lastElement != null && element.username != localStorage.getItem('Username') && element.username == lastElement.username) {
                    selector.innerHTML += messageReceiveModel(element.username, element.message, UTCtoLocalHour(element.date), true);
                }
                else if (element.username == localStorage.getItem('Username')) {
                    selector.innerHTML += messageSendModel(element.message, UTCtoLocalHour(element.date));
                }
                else {
                    selector.innerHTML += messageReceiveModel(element.username, element.message, UTCtoLocalHour(element.date));
                }
                lastElement = element;
                updateScroll();
            });
        });
    }
}
/**
 * Stop the animation
 */
function removeAllMsgAnimation() {
    let selector = document.querySelectorAll(".msg-bubble[style=\"animation: ms-motion-scaleDownIn 300ms;\"]");
    selector.forEach(element => {
        element.style.animation = null;
    });
}

/**
 * Model for message sended by other user
 * @param {string} username 
 * @param {string} text 
 * @param {string} date 
 * @param {boolean} suit 
 */
function messageReceiveModel(username, text, date, suit = false) {
    let result = '<div class="row">' +
        '<div class="col-4">' +
        '<div class="overflow-warp msg-bubble ms-depth-16 ms-fontSize-14" style="animation: ms-motion-scaleDownIn 300ms;">';

    if (!suit) {
        result += '<span class="ms-fontWeight-semibold">' + username + '</span><br/>';
    }

    result += text + '</div>' +
        '<div class="text-right ms-fontSize-12">' + date + '</div>' +
        '</div>' +
        '<div class="col-8"></div>' +
        '</div>';
    return result;
}
/**
 * Model for message sended by user
 * @param {string} text 
 * @param {string} date 
 */
function messageSendModel(text, date) {
    let result = '<div class="row">' +
        '<div class="col-4">' +
        '<div class="overflow-warp msg-bubble ms-depth-16 ms-fontSize-14" style="animation: ms-motion-scaleDownIn 300ms;">' +
        text + '</div>' +
        '<div class="text-right ms-fontSize-12">' + date + '</div>' +
        '</div>' +
        '<div class="col-8 order-first"></div>' +
        '</div>';
    return result;
}

/**
 * Send a GET request at url and callback with a json result to the function if success.
 *
 * @param {string} url
 * @param {function} callback
 */
function getAsync(url, callback) {
    if (typeof url != "string")
        throw "Parameter should be an string";
    if (typeof callback != "function")
        throw "Parameter should be an function";

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (this.status == 200) {
                callback(JSON.parse(this.responseText));
            }
            else if (this.status == 400) {
                console.log('Error code 400');
            }
            else if (this.status == 404) {
                console.log('Error code 404');
            }
            else if (this.status == 500) {
                console.log('Error code 500');
            }
        }

    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send();
}

/**
 * Send a POST request at the url and callback with a json result to the function if success.
 *
 * @param {string} url
 * @param {object} object
 * @param {function} callback
 */
function postAsync(url, object, callback) {
    if (typeof url != "string")
        throw "Parameter should be an string";
    if (typeof object != "object")
        throw "Parameter should be an object";
    if (typeof callback != "function")
        throw "Parameter should be an function";

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (this.status == 201)
                callback(JSON.parse(this.responseText));
            else if (this.status == 400) {
                console.log('Error code 400');
            }
        }
    }
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(object));
}
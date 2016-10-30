/**
 * Created by sophia on 10/19/16.
 */
//good practice to store variables used repetitively this way so that you don't need to request from DOM all the time
var
    $sessionTi = $('#sessionTime'),
    $breakTi = $('#breakTime'),
    $clock = $('.time'), //again NOT working in WebStorm!?!?
    $status = $('.status'), //would not work!?!
    timer,
    remainingSeconds,
    statusDisplay;
//define starting points
var sessionLength = 25,
    breakLength = 5,
    cStatus = null,
    isSession = true;

function statusToggle() {
    if (cStatus === null) {
        statusDisplay = 'Click play to begin';
    } else if (cStatus === true) {
        if (isSession) {
            statusDisplay = 'Work!';
        } else {
            statusDisplay = 'Break!';
        }
    } else if (cStatus === false) {
        statusDisplay = 'Pause';
    }
    $('.status').html(statusDisplay);
}
//sound the alarm when time reaches 0
var audio = new Audio('http://soundbible.com/grab.php?id=1377&type=mp3');
function beep() {
    audio.play();
}
//switch from session to break, and sound the alarm
function workBreakToggle() {
    isSession = !isSession;
    if (isSession) {
        startClock(minToSeconds(sessionLength));
    } else {
        startClock(minToSeconds(breakLength));
    }
    statusToggle();
}

//converts sessionLength to seconds
function minToSeconds(minute) {
    return minute * 60;
}
//converts seconds to minutes
function secondsToMin(seconds) {
    return seconds / 60;
}
//create an object of the minutes and seconds to display. There are 60 seconds in a minute, so divide seconds by 60 to get the whole minutes pulled, and the remainder (aka modulus) will be the seconds left, thus stored as seconds to display. For the minutes, do seconds/60 to get the hours, the % 60 for the remaining minutes.
function displayMinSec(seconds) {
    return {
        minutes: Math.floor((seconds / 60) % 60),
        seconds: Math.floor(seconds % 60)
    };
}

function fraction() {
    var progress;
    if (isSession) {
        progress = Math.floor((1 - (remainingSeconds / minToSeconds(sessionLength))) * 100);
    } else {
        progress = Math.floor((1 - (remainingSeconds / minToSeconds(breakLength))) * 100);
    }
    $('.clock-radial').addClass('progress-' + progress);
}

function resetProgress() {
    $('.clock-radial').removeClass(function (index, css) {
        return (css.match (/(^|\s)progress-\S+/g) || []).join(' ');
    }).addClass('progress-0');
}

function startClock(timeInSeconds) {
    remainingSeconds = timeInSeconds;
    //if the timer is running, reset it
    if (timer) {
        clearInterval(timer);
    }
    //setInterval is a low level function that is built into JS, and repeatedly calls a function in milliseconds
    timer = setInterval(function() {
        remainingSeconds--;
        if (remainingSeconds < 0) {
            clearInterval(timer);
            workBreakToggle();
            resetProgress();
            return;
        }
        var timerDisplay = displayMinSec(remainingSeconds);
        //makes seconds and minutes always double digits i.e. 09 instead of 9
        var minutesToDisplay,
            secondsToDisplay;
        if (timerDisplay.minutes < 10) {
            minutesToDisplay = "0" + timerDisplay.minutes;
        } else {
            minutesToDisplay = timerDisplay.minutes;
        }
        if (timerDisplay.seconds < 10) {
            secondsToDisplay = "0" + timerDisplay.seconds;
        } else {
            secondsToDisplay = timerDisplay.seconds;
        }
        //displays the timer
        $('.time').html('<span>' + minutesToDisplay + '</span> : <span>' + secondsToDisplay + '</span>');
        //must stop timer at 00:00, otherwise it will continue to count down
        fraction();
    }, 1000);
}

$(document).ready(function() {
    statusToggle();
    //subtract Session minute
    $('#subtractSes').on("click", function() {
        if (cStatus === null) {
            if (+sessionLength > 1) {
                sessionLength = sessionLength - 1;
                $sessionTi.text(sessionLength);
            }
        } else {
            alert('Stop the timer before you proceed.');
        }
    });
    //add Session minute
    $('#addSes').on("click", function() {
        if (cStatus === null) {
            sessionLength = sessionLength + 1;
            $sessionTi.text(sessionLength);
        } else {
            alert('Stop the timer before you proceed.');
        }
    });
    //subtract Break minute
    $('#subtractBre').on("click", function() {
        if (cStatus === null) {
            if (breakLength > 1) {
                breakLength = breakLength - 1;
                $breakTi.text(breakLength);
            }
        } else {
            alert('Stop the timer before you proceed.');
        }
    });
    //add Break minute
    $('#addBre').on("click", function() {
        if (cStatus === null) {
            breakLength = breakLength + 1;
            $breakTi.text(breakLength);
        } else {
            alert('Stop the timer before you proceed.');
        }
    });

    $('#playBtn').on("click", function() {
        cStatus = !cStatus;
        statusToggle();

        if (cStatus) {
            $(this).removeClass('fa-play').addClass('fa-pause');
            if (!remainingSeconds) {
                startClock(minToSeconds(sessionLength));
            } else {
                startClock(remainingSeconds);
            }
        } else {
            $(this).removeClass('fa-pause').addClass('fa-play');
            clearInterval(timer);
        }
    });

    $('#stopBtn').on("click", function() {
        clearInterval(timer);
        resetProgress();
        remainingSeconds = 0;
        $('.time').empty();
        $('#playBtn').removeClass('fa-pause').addClass('fa-play');
        cStatus = null;
    });
});


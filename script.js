
'use strict';

var dateFormat = 'MMDDYYYY';
var currDate = dayjs().format(dateFormat);


$(document).ready(function () {
  displayDate();
  addColorsToTimeBlock();
  removeOldDateEventsFromLocalStorage();
  displayEventsInTimeBlock();
  var saveBtn = $('button.saveBtn');
  saveBtn.on('click', saveEventToLocalStorage);
});

function saveEventToLocalStorage() {
  var timeBlockId = $($(this).closest('.time-block')).attr('id');
  var text = $(this).closest('.time-block').find('textarea').val().trim();
  var eventByHr = {
    hr: timeBlockId,
    event: text
  }
  addToLocalStorage(eventByHr);
  displayEventsInTimeBlock();
}

function addToLocalStorage(eventByHrToAdd) {
  var eventsForCurrDayLS = getLocalStorageForCurrentDay();
  var alertMsg = 'Event was added to Local Storage ';

  var eventsForCurrDayToAdd = {};
  eventsForCurrDayToAdd.date = currDate;
  if (eventsForCurrDayLS == null) {
    if (eventByHrToAdd.event.trim() === '') {
      return;
    }
    eventsForCurrDayToAdd.eventsByHour = [eventByHrToAdd];
    localStorage.setItem("events", JSON.stringify(eventsForCurrDayToAdd));
    showAlertWhenSaved(alertMsg);
    return;
  }

  var eventsByHrLS = eventsForCurrDayLS.eventsByHour;
  var eventByHrAlreadyExistsLS = false;
  var eventByHrDeleted = false;

  for (var eventByHrLS of eventsByHrLS) {
    if (eventByHrLS.hr === eventByHrToAdd.hr) {
      if (eventByHrToAdd.event === '') {
        eventByHrDeleted = true;
      }
      eventByHrLS.event = eventByHrToAdd.event;
      eventByHrAlreadyExistsLS = true;
      alertMsg = 'Event was updated in Local Storage ';
      break;
    }
  }
  if (!eventByHrAlreadyExistsLS) {
    if (eventByHrToAdd.event.trim() === '') {
      return;
    }
    eventsByHrLS.push(eventByHrToAdd);
  } else {
    if (eventByHrDeleted) {
      eventsByHrLS = eventsByHrLS.filter(obj => !(obj.hr === eventByHrToAdd.hr && obj.event.trim() === ''));
      alertMsg = 'Event was deleted from Local Storage ';
    }
  }
  eventsForCurrDayToAdd.eventsByHour = eventsByHrLS;
  localStorage.setItem("events", JSON.stringify(eventsForCurrDayToAdd));
  showAlertWhenSaved(alertMsg);
}

function removeOldDateEventsFromLocalStorage() {
  var events = JSON.parse(localStorage.getItem("events"));
  if (events == null) {
    return;
  }

  if (events.date != currDate) {
    localStorage.removeItem("events");
  }
}

function showAlertWhenSaved(alertMsg) {
  var alert = $('#alert');
  var alertTxt = $('#alert .alert-icon');
  alertTxt.html(alertMsg + '<i class="fas fa-check"></i>');
  alert.removeClass('d-none').hide().fadeIn()
  alert.delay(1000).fadeOut();

}

function getLocalStorageForCurrentDay() {
  var eventsLS = JSON.parse(localStorage.getItem("events"));
  if (eventsLS == null) {
    return null;
  }

  if (eventsLS.date === currDate) {
    return eventsLS;
  }

  return null;
}


function displayEventsInTimeBlock() {
  var eventsLS = getLocalStorageForCurrentDay();
  if (eventsLS == null || eventsLS.length == 0) {
    return;
  }
  for (var eventByHr of eventsLS.eventsByHour) {
    $("#" + eventByHr.hr).find("textarea").html(eventByHr.event);
  }
}

function addColorsToTimeBlock() {
  var timeBlockContainers = $('.time-block');
  var currHr = dayjs().hour();
  for (var container of timeBlockContainers) {
    var id = $(container).attr('id');
    var hrTimeBlock = id.split("-")[1];
    if (hrTimeBlock > currHr) {
      $(container).addClass('future');
    } else if (hrTimeBlock < currHr) {
      $(container).addClass('past');
    } else {
      $(container).addClass('present');
    }
  }
}

function displayDate() {
  $(currentDay).text(dayjs().format('dddd, MMMM DD, YYYY'));
}



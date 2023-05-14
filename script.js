
'use strict';
// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

var dateFormat = 'MMDDYYYY';
var currDate = dayjs().format(dateFormat);

$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
});

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
  var eventsForCurrDayToAdd = {};
  eventsForCurrDayToAdd.date = currDate;
  if (eventsForCurrDayLS == null) {
    eventsForCurrDayToAdd.eventsByHour = [eventByHrToAdd];
    localStorage.setItem("events", JSON.stringify(eventsForCurrDayToAdd));
    return;
  }

  var eventsByHrLS = eventsForCurrDayLS.eventsByHour;
  var eventByHrAlreadyExistsLS = false;
  for (var eventByHrLS of eventsByHrLS) {
    if (eventByHrLS.hr === eventByHrToAdd.hr) {
      eventByHrLS.event = eventByHrToAdd.event;
      eventByHrAlreadyExistsLS = true;
      break;
    }
  }
  if (!eventByHrAlreadyExistsLS) {
    eventsByHrLS.push(eventByHrToAdd);
  }
  eventsForCurrDayToAdd.eventsByHour = eventsByHrLS;
  localStorage.setItem("events", JSON.stringify(eventsForCurrDayToAdd))
}

function removeOldDateEventsFromLocalStorage() {
  var events = JSON.parse(localStorage.getItem("events"));
  if (events == null) {
    return;
  }

  var currEvents = events.filter(event => event.date < currDate);
  localStorage.setItem("events", JSON.stringify(currEvents));
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



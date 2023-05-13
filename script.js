// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

var eventByHr = {
  hr: "",
  event: ""
}
var eventByDay = {
  timestamp: "",
  eventsByHour: [eventByHr]
}
var events = [eventByDay];

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
  saveBtn.on('click', saveEventToLocalStorage);
});

function saveEventToLocalStorage() {
  var timeBlockId = $($(this).closest('.time-block')).attr('id');
  var text = $(this).closest('.time-block').find('textarea').val().trim();
  if (text === '') {
    return;
  }
  eventByHr = {
    hr: timeBlockId,
    event: text
  }
  addToLocalStorage(eventByHr);
  displayEventsInTimeBlock();
}

function addToLocalStorage(eventByHrToAdd) {
  var currTimestamp = dayjs().unix();
  var eventsByDate = getLocalStorageForCurrentDay();

  if (eventsByDate == null) {
    eventByDay.timestamp = currTimestamp;
    eventByDay.eventsByHour = [eventByHrToAdd];
    return;
  }
  var events = eventsByDate.eventsByHour;
  for (var eventByHour of events) {
    if (eventByHour.hr === eventByHrToAdd.hr) {
      eventByHour.event = eventByHrToAdd.event;
      return;
    }
  }
  events.push(eventByHrToAdd);
}

function removeOldDateEventsFromLocalStorage(){
  events = localStorage.getItem("events");
  if (events == null) {
    return null;
  }
  var currTimestamp = dayjs().unix();
  var currEvents = events.filter(event => event.timestamp < currTimestamp);
  localStorage.setItem("events", currEvents);
}

function getLocalStorageForCurrentDay() {
  events = localStorage.getItem("events");
  if (events == null) {
    return null;
  }
  var currTimestamp = dayjs().unix();
  for (var eventByDate of events) {
    if (eventByDate.timestamp === currTimestamp) {
      return eventByDate;
    }
  }
  return null;
}

function displayEventsInTimeBlock() {
  var events = getLocalStorageForCurrentDay();
  if (events == null || events.length == 0) {
    return;
  }
  for(var eventByHr of events){
    $("#" +eventByHr.hr).text(eventByHr.text);
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



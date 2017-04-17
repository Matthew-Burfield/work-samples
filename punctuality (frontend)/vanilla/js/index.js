const URL_SHIFTS = 'http://localhost:4567/shifts/2013-01-15/2015-09-15';
const URL_ROSTERS = 'http://localhost:4567/rosters/2013-01-15/2015-09-15';
const stats = {
  arrivedLate: 0,
  punctual: 0,
  leftEarly: 0,
};

function updateProgressBar(percentage) {
  var progressBarDegrees = percentage * 360;

  if (progressBarDegrees > 180) {
    setPieWrapperRightSideStyles(180);
    setStyles(document.querySelector(".pie-wrapper .pie"), ["clip: rect(auto, auto, auto, auto)"]);
  } 
  if (progressBarDegrees <= 180) {
    setPieWrapperRightSideStyles(0);
    document.querySelector(".pie-wrapper .pie").setAttribute("style", "clip: ''");
  }
  setStyles(
    document.querySelector(".pie-wrapper .pie .left-side"),
    [
      "-webkit-transform: rotate(" + progressBarDegrees + "deg)",
      "transform: rotate(" + progressBarDegrees + "deg)",
    ]);
};

function setPieWrapperRightSideStyles(setDegrees) {
  const display = setDegrees ? 'block' : 'none';
  setStyles(
    document.querySelector(".pie-wrapper .pie .right-side"),
    [
      `display: ${display}`,
      `-webkit-transform: rotate(${setDegrees}deg)`,
      `transform: rotate(${setDegrees}deg)`
    ]);
}

function setStyles(element, listOfStyles) {
  listOfStyles.forEach(style => element.setAttribute('style', style));
}

/**
 * Start the API calls here. Gets the roster data first
 */
(function getData() {
  fetch(URL_ROSTERS, { method: 'GET' })
    .then(response => response.json())
    .then(data => handleRosterData(data));
})();

/**
 * Loops through the array of roster objects and creates
 * td DOM elements for each one.
 * After all DOM elements have been added, get the shift data.
 * 
 * @param {array} data The roster data objects returned from the server
 */
function handleRosterData(data) {
  const tbody = document.querySelector('.body-table table tbody');
  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.setAttribute('id', item.date);
    tr.appendChild(getTd(item.date, 'MMMM Do YYYY'));
    tr.appendChild(getTd(item.start, 'LT')); // Roster start time
    tr.appendChild(getTd(""));
    tr.appendChild(getTd(item.finish, 'LT'));
    tr.appendChild(getTd(""));
    tbody.appendChild(tr);
  });

  fetch(URL_SHIFTS)
    .then(response => response.json())
    .then(data => handleShiftData(data))
    //.then(displayStats());
}

/**
 * Loop through the shift data and find the corresponding roster table row.
 * Compare the shift start and end times with the roster start and end times in
 * the corresponding td data-date attributes.
 * 
 * After all date computation is done, update the stats and convert the table
 * into a data table
 * 
 * @param {array} data The shift data objects returned from the server
 */
function handleShiftData(data) {
  data.forEach(item => {
    const tr = document.getElementById(item.date);
    if (tr) {
      const startTimeStatus = compareDateWithColumn(tr, item.start, true);
      addToStats(startTimeStatus);
      appendContentToElement(tr.children[2], startTimeStatus, item.start);
      
      const finishTimeStatus = compareDateWithColumn(tr, item.finish, false);
      addToStats(finishTimeStatus);
      appendContentToElement(tr.children[4], finishTimeStatus, item.finish);
    }
  });
  displayStats();
  addDataTable();
}

/**
 * Helper function to set the data table settings
 * https://datatables.net/examples/index
 */
function addDataTable() {
  $('.body-table table').DataTable( {
    "pagingType": "simple",
    "dom": '<t><"table-page"lp><"table-info"i>'
  } );
}

/**
 * This is called after all the API calls have finished, and
 * the table is finished populating
 * 
 */
function displayStats() {
  const percentage = stats.punctual / (stats.arrivedLate + stats.punctual + stats.leftEarly);
  document.getElementById('arrivedLate').innerHTML = stats.arrivedLate;
  document.getElementById('punctual').innerHTML = stats.punctual;
  document.getElementById('leftEarly').innerHTML = stats.leftEarly;
  document.querySelector('.pie-wrapper .label').innerHTML = percentage * 100 + '';
  document.querySelector('.body-text span').innerHTML = percentage * 100 + '';
  updateProgressBar(percentage);
}

/**
 * 
 * 
 * @param {node} tr The table row that we want to compare rostered and actual times
 * @param {string} date The actual date/time the person started
 * @param {boolean} isStartTime true if we are comparing to the rostered start,
 *                              false if we are comparing to the rostered finish
 * @returns {string} 'ont time' || 'left early' || 'started late'
 */
function compareDateWithColumn(tr, date, isStartTime) {
  const colNum = isStartTime ? 1 : 3;
  const colDate = moment(tr.children[colNum].getAttribute('data-date'));
  const compareToDate = moment(date);
  return displayIfOnTime(colDate, compareToDate, isStartTime);
}

function appendContentToElement(element, content, date) {
  const contentNode = document.createTextNode(content);
  const hoverDiv = document.createElement('div');
  const hoverContent = document.createTextNode(moment(date).format('LT'));

  hoverDiv.setAttribute('class', 'hover-box');
  hoverDiv.appendChild(hoverContent);
  element.appendChild(contentNode);
  element.appendChild(hoverDiv);
  element.setAttribute('data-date', date);
}

function handleMouseOver(date, parentElement) {
  const div = document.createElement('div');
  div.innerHTML = moment(date).format('LT');
  div.setAttribute('style', 'position: absolute; height: 40px; width: 100px; background-color: black; text-align: center;')
  parentElement.appendChild(div);
}

function handleMouseLeave(element) {
  element.firstElementChild.remove();
}

function displayIfOnTime(rosteredTime, actualTime, isStartTime) {
  const timeDiff = rosteredTime.diff(actualTime, 'minutes');
  if (timeDiff > 0 && !isStartTime) {
    return 'left early';
  } else if (timeDiff < 0 && isStartTime) {
    return 'started late'
  }
  return 'on time';
}

function addToStats(displayString) {
  switch (displayString) {
    case 'on time':
      stats.punctual += 1;
      break;
    case 'started late':
      stats.arrivedLate += 1;
      break;
    case 'left early':
      stats.leftEarly += 1;
      break;
  }
}

function getTd(content, dateFormat) {
  const td = document.createElement('td');
  const friendlyDateValue = dateFormat ? getFriendlyDate(content, dateFormat) : '';
  const contentNode = document.createTextNode(friendlyDateValue);
  td.appendChild(contentNode);
  td.setAttribute('data-date', content);
  return td;
}

function getFriendlyDate(dateStr, format) {
  return moment(dateStr).format(format);
}



// Could try adding both lists to an array and then manipulating it so I only need to loop through once
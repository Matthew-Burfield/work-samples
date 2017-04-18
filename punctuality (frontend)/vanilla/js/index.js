const URL_SHIFTS = 'http://localhost:4567/shifts/2013-01-15/2015-09-15';
const URL_ROSTERS = 'http://localhost:4567/rosters/2013-01-15/2015-09-15';
const stats = {
  arrivedLate: [],
  punctual: [],
  leftEarly: [],
};
const COLUMNS = {
  DAY: 0,
  ROSTERED_START: 1,
  ACTUAL_START: 2,
  ROSTERED_FINISH: 3,
  ACTUAL_FINISH: 4,
};

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
      updateActualStartFinishColumn(tr, item.start, true);
      updateActualStartFinishColumn(tr, item.finish, false);
    }
  });
  displayStats(30);
  addDataTable();
}


/**
 * Appends the time status to the actual start/finish column
 * and adds to the overall stats
 * 
 * @param {object} tr 
 * @param {string} actualTimeVal 
 * @param {boolean} isStartTime 
 */
function updateActualStartFinishColumn(tr, actualTimeVal, isStartTime) {
  const rosteredTimeCol = isStartTime ? COLUMNS.ROSTERED_START : COLUMNS.ROSTERED_FINISH;
  const actualTimeCol = isStartTime ? COLUMNS.ACTUAL_START : COLUMNS.ACTUAL_FINISH;

  const rosteredTimeVal = tr.children[rosteredTimeCol].getAttribute('data-date');
  const actualTimeColNode = tr.children[actualTimeCol];

  const timeDifference = getTimeDifference(rosteredTimeVal, actualTimeVal);
  const timeStatus = getActualTimeStatus(timeDifference, actualTimeVal, isStartTime);
  const timeDifferenceTagNode = getTimeDifferenceTagNode(timeStatus, timeDifference);

  addToStats(timeStatus, timeDifference);
  appendContentToElement(actualTimeColNode, timeStatus, actualTimeVal);
  if (timeDifferenceTagNode) {
    actualTimeColNode.appendChild(timeDifferenceTagNode);
  }
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
function displayStats(punctualErrorMargin) {
  const totalCountOfShifts = stats.punctual.length + stats.arrivedLate.length + stats.leftEarly.length;
  
  const arrivedLate = stats.arrivedLate.filter(time => time > punctualErrorMargin).length;
  const leftEarly = stats.leftEarly.filter(time => time > punctualErrorMargin).length;
  const percentage = Math.round(totalCountOfShifts / (arrivedLate + totalCountOfShifts + leftEarly) * 100);
  
  document.getElementById('arrivedLate').innerHTML = stats.arrivedLate.length;
  document.getElementById('punctual').innerHTML = stats.punctual.length;
  document.getElementById('leftEarly').innerHTML = stats.leftEarly.length;
  document.querySelector('.pie-wrapper .label').innerHTML = percentage;
  document.querySelector('.body-text span').innerHTML = percentage;
  updateProgressBar(percentage);
}


/**
 * 
 * 
 * @param {string} rosteredTime The time the user was rostered to start their shift
 * @param {string} actualTime The actual time the person started their shift
 * @param {boolean} isStartTime true if we are comparing to the rostered start,
 *                              false if we are comparing to the rostered finish
 * @returns {string} 'no time clocked' || 'on time' || 'left early' || 'started late'
 */
function getActualTimeStatus(timeDiff, actualTime, isStartTime) {
  if (actualTime === '') {
    return 'no time clocked';
  }
  if (timeDiff > 0 && !isStartTime) {
    return 'left early';
  } else if (timeDiff < 0 && isStartTime) {
    return 'started late';
  }
  return 'on time';
}


/**
 * Creates the DOM element for the orange tag that displays
 * how many minites the person started late or ended early
 * 
 * @param {string} timeStatus the status from the actual start/finish column
 * @param {any} timeDifference the difference of time between the rostered
 *                             start/finish and the actual start/finish in minutes
 * @returns DOM element or null if person was on time
 */
function getTimeDifferenceTagNode(timeStatus, timeDifference) {
  if (timeStatus === 'left early' || timeStatus === 'started late') {
    const node = document.createElement('span');
    node.classList.add('time-diff-tag');
    node.appendChild(document.createTextNode(`${Math.abs(timeDifference)} minutes`));
    return node;
  }
  return null;
}


/**
 * Get t the time difference between the two values in minutes
 * 
 * @param {string} rosteredTime 
 * @param {string} actualTime 
 * @returns {number} time difference in minutes
 */
function getTimeDifference(rosteredTime, actualTime) {
  if (!rosteredTime || !actualTime) {
    return null;
  }
  return moment(rosteredTime).diff(moment(actualTime), 'minutes');
}


/**
 * Given a DOM element and some content, add the content as
 * a child
 * 
 * @param {object} element 
 * @param {string} content 
 * @param {string} date value to be added to the data-date attribute of the element
 */
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


/**
 * Adds the time difference to the list of stats
 * Updates the stats global array
 * 
 * @param {string} displayString 
 * @param {number} timeDifference 
 */
function addToStats(displayString, timeDifference) {
  switch (displayString) {
    case 'on time':
      stats.punctual.push(Math.abs(timeDifference));
      break;
    case 'started late':
      stats.arrivedLate.push(Math.abs(timeDifference));
      break;
    case 'left early':
      stats.leftEarly.push(Math.abs(timeDifference));
      break;
  }
}


/**
 * Creates a td element the new table tr
 * 
 * @param {string} content value that should displayed in the td
 * @param {string} dateFormat should be a valid date format specified by moment.js
 * @returns {object} The td DOM node
 */
function getTd(content, dateFormat) {
  const td = document.createElement('td');
  const friendlyDateValue = dateFormat ? getFriendlyDate(content, dateFormat) : '';
  const contentNode = document.createTextNode(friendlyDateValue);
  td.appendChild(contentNode);
  td.setAttribute('data-date', content);
  return td;
}


/**
 * Uses moment.js to return a friendly looking date
 * 
 * @param {string} dateStr 
 * @param {string} format Should be a valid date format specified by moment.js
 * @returns 
 */
function getFriendlyDate(dateStr, format) {
  return moment(dateStr).format(format);
}


/**
 * Handler for when the user changes the text in the minutes text box
 * 
 * @param {*} e 
 */
const handlePunctualErrorMarginInputEvent = (e) => {
  const val = e.target.value;
  if (isNaN(val)) {
    return;
  }
  displayStats(val);
}

/**
 * Updates the circular percentage graphic
 * 
 * @param {number} percentage 
 */
function updateProgressBar(percentage) {
  const progressBarDegrees = percentage / 100 * 360;

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

/**
 * Helper function to update the circular percentage graphic.
 * This sets the attributes increase or decrease the pie chart colour
 * 
 * @param {number} setDegrees 
 */
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

/**
 * Helper function to set multiple styles for a given element
 * 
 * @param {object} element 
 * @param {array} listOfStyles 
 */
function setStyles(element, listOfStyles) {
  listOfStyles.forEach(style => element.setAttribute('style', style));
}

/**
 * Add the event listener for the text input
 * Allows the user to update the punctual +/- minutes
 */
document.getElementById("punctualErrorMargin").addEventListener('input', handlePunctualErrorMarginInputEvent);

// Could try adding both lists to an array and then manipulating it so I only need to loop through once
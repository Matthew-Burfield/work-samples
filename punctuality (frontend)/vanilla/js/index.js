function updateProgressBar(percentage) {
  var progressBarDegrees = percentage * 360;

  if (progressBarDegrees > 180) {
    document.querySelector(".pie-wrapper .pie .right-side").setAttribute("style", "display: block");
    document.querySelector(".pie-wrapper .pie").setAttribute("style", "clip: rect(auto, auto, auto, auto)");
    document.querySelector(".pie-wrapper .pie .right-side").setAttribute("style", "-webkit-transform: rotate(180deg)");
    document.querySelector(".pie-wrapper .pie .right-side").setAttribute("style", "transform: rotate(180deg)");
  } 
  if (progressBarDegrees <= 180) {
    document.querySelector(".pie-wrapper .pie .right-side").setAttribute("style", "display: none");
    document.querySelector(".pie-wrapper .pie .right-side").setAttribute("style", "-webkit-transform: rotate(0deg)");
    document.querySelector(".pie-wrapper .pie .right-side").setAttribute("style", "transform: rotate(0deg)");
    document.querySelector(".pie-wrapper .pie").setAttribute("style", "clip: ''");
  } 
  document.querySelector(".pie-wrapper .pie .left-side").setAttribute("style", "-webkit-transform: rotate(" + progressBarDegrees + "deg)");
  document.querySelector(".pie-wrapper .pie .left-side").setAttribute("style", "transform: rotate(" + progressBarDegrees + "deg)");
};

const URL_SHIFTS = 'http://localhost:4567/shifts/2013-01-15/2015-09-15';
const URL_ROSTERS = 'http://localhost:4567/rosters/2013-01-15/2015-09-15';
const stats = {
  arrivedLate: 0,
  punctual: 0,
  leftEarly: 0,
};

(function getData() {
  fetch(URL_ROSTERS, { method: 'GET' })
    .then(response => response.json())
    .then(data => handleRosterData(data));
})();

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

function handleShiftData(data) {
  data.forEach(item => {
    const tr = document.getElementById(item.date);
    if (tr) {
      const startTimeStatus = compareDateWithColumn(tr, item.start, 1, true);
      addToStats(startTimeStatus);
      appendContentToElement(tr.children[2], startTimeStatus, item.start);
      
      const finishTimeStatus = compareDateWithColumn(tr, item.finish, 3, false);
      addToStats(finishTimeStatus);
      appendContentToElement(tr.children[4], finishTimeStatus, item.finish);
    }
  });
  displayStats();
  addDataTable();
}

function addDataTable() {
  $('.body-table table').DataTable( {
    "pagingType": "simple",
    "dom": '<t><"table-page"lp><"table-info"i>'
  } );
}

function displayStats() {
  const percentage = stats.punctual / (stats.arrivedLate + stats.punctual + stats.leftEarly);
  document.getElementById('arrivedLate').innerHTML = stats.arrivedLate;
  document.getElementById('punctual').innerHTML = stats.punctual;
  document.getElementById('leftEarly').innerHTML = stats.leftEarly;
  document.querySelector('.pie-wrapper .label').innerHTML = percentage * 100 + '';
  document.querySelector('.body-text span').innerHTML = percentage * 100 + '';
  updateProgressBar(percentage);
}

function compareDateWithColumn(tr, date, colNum, isStartTime) {
  const colDate = moment(new Date(tr.children[colNum].getAttribute('data-date')));
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
  return moment(new Date(dateStr)).format(format);
}

// Could try adding both lists to an array and then manipulating it so I only need to loop through once
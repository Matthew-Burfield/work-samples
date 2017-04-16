(function updateProgressBar() {
  var progressBarDegrees = 0.95 * 360;

  if (progressBarDegrees > 180) {
    document.querySelector(".pie-wrapper.countdown-timer .pie .right-side").setAttribute("style", "display: block");
    document.querySelector(".pie-wrapper.countdown-timer .pie").setAttribute("style", "clip: rect(auto, auto, auto, auto)");
    document.querySelector(".pie-wrapper.countdown-timer .pie .right-side").setAttribute("style", "-webkit-transform: rotate(180deg)");
    document.querySelector(".pie-wrapper.countdown-timer .pie .right-side").setAttribute("style", "transform: rotate(180deg)");
  } 
  if (progressBarDegrees <= 180) {
    document.querySelector(".pie-wrapper.countdown-timer .pie .right-side").setAttribute("style", "display: none");
    document.querySelector(".pie-wrapper.countdown-timer .pie .right-side").setAttribute("style", "-webkit-transform: rotate(0deg)");
    document.querySelector(".pie-wrapper.countdown-timer .pie .right-side").setAttribute("style", "transform: rotate(0deg)");
    document.querySelector(".pie-wrapper.countdown-timer .pie").setAttribute("style", "clip: ''");
  } 
  document.querySelector(".pie-wrapper.countdown-timer .pie .left-side").setAttribute("style", "-webkit-transform: rotate(" + progressBarDegrees + "deg)");
  document.querySelector(".pie-wrapper.countdown-timer .pie .left-side").setAttribute("style", "transform: rotate(" + progressBarDegrees + "deg)");
})();

const URL = 'http://localhost:4567/shifts/2013-01-15/2015-09-15';
function getData(URL) {
  const data = fetch(URL, { method: 'GET' })
                .then(response => response.json())
                .then(data => {
                  const tbody = document.querySelector('.body-table table tbody');
                  data.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.appendChild(getTd(moment(new Date(item.date)).format('MMMM Do YYYY')));
                    tr.appendChild(getTd("")); // Roster start time
                    tr.appendChild(getTd(item.start));
                    tr.appendChild(getTd(""));
                    tr.appendChild(getTd(item.finish));
                    tbody.appendChild(tr);
                  });
                });
}

function getTd(content) {
  const td = document.createElement('td');
  const contentNode = document.createTextNode(content)
  td.appendChild(contentNode);
  return td;
}

getData(URL);
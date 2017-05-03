import React from 'react'

const Stats = () =>
  <div>
    <div className="body-text">
      For clock ins and outs within <input id="punctualErrorMargin" type="text" value="30" /> minutes of his roster,
      Sully is punctual <span></span>% of the time. Time saved: 9 mins.
    </div>
    <div className="body-stats-container">
      <div className="body-stat">
        <span>arrived late</span><span id="arrivedLate"></span>
      </div>
      <div className="body-stat">
        <span>punctual</span><span id="punctual">0</span>
      </div>
      <div className="body-stat">
        <span>left early</span><span id="leftEarly">0</span>
      </div>
    </div>
  </div>;

export default Stats
import React from 'react'
import PropTypes from 'prop-types'
import PieChart from './PieChart'

const { arrayOf, number } = PropTypes

const countNumberOfTimesLeftEarly = (timeDiffs, punctualErrorMargin) => {
  return timeDiffs.reduce((count, time) => {
    return time > punctualErrorMargin ? count += 1 : count
  }, 0)
}

const countNumberOfTimesArrivedLate = (timeDiffs, punctualErrorMargin) => {
  return timeDiffs.reduce((count, time) => {
    return time < punctualErrorMargin ? count += 1 : count
  }, 0)
}

const Stats = ({punctualErrorMargin, startTimeDiffs, finishTimeDiffs}) => {
  const numTimesArrivedLate = countNumberOfTimesArrivedLate(startTimeDiffs, punctualErrorMargin)
  const numTimesLeftEarly = countNumberOfTimesLeftEarly(finishTimeDiffs, punctualErrorMargin)
  const totalTimes = startTimeDiffs.length + finishTimeDiffs.length
  const totalTimesNotPunctual = numTimesArrivedLate + numTimesLeftEarly
  const numTimesPunctual = Math.round((totalTimes - totalTimesNotPunctual) / totalTimes * 100)
  return (
    <div>
      <PieChart numTimesPunctual={numTimesPunctual} />
      <div className="body-text">
        For clock ins and outs within <input id="punctualErrorMargin" type="text" /> minutes of his roster,
        Sully is punctual <span>{numTimesPunctual}</span>% of the time. Time saved: 9 mins.
      </div>
      <div className="body-stats-container">
        <div className="body-stat">
          <span>arrived late</span> <b>{numTimesArrivedLate}</b>
        </div>
        <div className="body-stat">
          <span>punctual</span> <b>{numTimesPunctual}</b>
        </div>
        <div className="body-stat">
          <span>left early</span> <b>{numTimesLeftEarly}</b>
        </div>
      </div>
    </div>
  )
}

Stats.propTypes = {
  punctualErrorMargin: number,
  startTimeDiffs: arrayOf(number),
  finishTimeDiffs: arrayOf(number)
}

Stats.defaultProps = {
  startTimeDiffs: [],
  finishTimeDiffs: []
}

export default Stats
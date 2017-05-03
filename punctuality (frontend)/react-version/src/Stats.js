import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import PieChart from './PieChart'

const { arrayOf, number, func, shape, string } = PropTypes

const diff = (time1, time2) => {
  return time1.diff(time2, 'minutes')
}

const countNumberOfTimesLeftEarly = (data, punctualErrorMargin) => {
  return data.reduce((count, day) => {
    return diff(moment(day.rosteredFinish), moment(day.actualFinish)) > punctualErrorMargin ? count += 1 : count
  }, 0)
}

const countNumberOfTimesArrivedLate = (data, punctualErrorMargin) => {
  return data.reduce((count, day) => {
    return diff(moment(day.rosteredStart), moment(day.actualStart)) < punctualErrorMargin * -1 ? count += 1 : count
  }, 0)
}

const Stats = ({data, punctualErrorMargin, updatePunctualErrorMargin}) => {
  const numTimesArrivedLate = countNumberOfTimesArrivedLate(data, punctualErrorMargin)
  const numTimesLeftEarly = countNumberOfTimesLeftEarly(data, punctualErrorMargin)
  const totalTimesNotPunctual = numTimesArrivedLate + numTimesLeftEarly
  const numTimesPunctual = data.length * 2 - totalTimesNotPunctual
  const punctualPercentage = Math.round((numTimesPunctual - totalTimesNotPunctual) / numTimesPunctual * 100)
  const input = <input id="punctualErrorMargin" type="text" value={punctualErrorMargin} onChange={updatePunctualErrorMargin} />
  return (
    <div>
      <PieChart punctualPercentage={punctualPercentage} />
      <div className="body-text">
        For clock ins and outs within {input} minutes of his roster,
        Sully is punctual <span>{punctualPercentage}</span>% of the time. Time saved: 9 mins.
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
  updatePunctualErrorMargin: func,
  data: arrayOf(shape({
    date: string,
    rosteredStart: string,
    rosteredFinish: string,
    actualStart: string,
    actualFinish: string
  })),
}

Stats.defaultProps = {
  data: []
}

export default Stats
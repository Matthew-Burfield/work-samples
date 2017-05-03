import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'

const { arrayOf, shape, string } = PropTypes

const diff = (time1, time2) => {
  return time1.diff(time2, 'minutes')
}

const getTimeValue = (rosteredTime, actualTime, punctualErrorMargin) => {
  return function (startOrFinish, notPunctualMessage) {
    if (actualTime === 'Invalid time') {
      return `no ${startOrFinish} time`
    }
    const time1 = startOrFinish === 'start' ? rosteredTime : actualTime
    const time2 = startOrFinish === 'start' ? actualTime : rosteredTime
    if (diff(time1, time2) < punctualErrorMargin) {
      return notPunctualMessage
    }
    return 'on time'
  }
}

// const getStartValue = (rosteredStart, actualStart, punctualErrorMargin) => {
//   if (actualStart === 'Invalid time') {
//     return 'no start time'
//   }
//   if (rosteredStart.diff(actualStart, 'minutes') < punctualErrorMargin) {
//     return 'started late'
//   }
//   return 'on time'
// }

// const getFinishTime = (rosteredFinish, actualFinish, punctualErrorMargin) => {
//   if (actualFinish === 'Invalid time') {
//     return 'no finish time'
//   }
//   if (rosteredFinish.diff(actualFinish, 'minutes') > punctualErrorMargin) {
//     return 'left early'
//   }
//   return 'on time'
// }



const DataTable = ({data, punctualErrorMargin}) => {
  return (
    <div className="body-table">
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Rostered Start</th>
            <th>Actual Start</th>
            <th>Rostered Finish</th>
            <th>Actual Finish</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 && data.map(day => {
            const rosteredStart = moment(day.rosteredStart)
            const rosteredFinish = moment(day.rosteredFinish)
            const actualStart = moment(day.actualStart)
            const actualFinish = moment(day.actualFinish)
            const startDiff = diff(actualStart, rosteredStart)
            const finishDiff = diff(rosteredFinish, actualFinish)
            const getStartText = getTimeValue(rosteredStart, actualStart, punctualErrorMargin)
            const getFinishText = getTimeValue(rosteredFinish, actualFinish, punctualErrorMargin)
            return (
              <tr key={day.date}>
                <td>{moment(day.date).format('MMMM Do YYYY')}</td>
                <td>{rosteredStart.format('LT')}</td>
                <td>
                  {getStartText('start', 'started late')}
                  <div className='hover-box'>{actualStart.format('LT')}</div>
                  {startDiff > 0 && <div className='time-diff-tag'>{startDiff} minutes</div>}
                </td>
                <td>{rosteredFinish.format('LT')}</td>
                <td>
                  {getFinishText('finish', 'left early')}
                  <div className='hover-box'>{actualFinish.format('LT')}</div>
                  {finishDiff > 0 && <div className='time-diff-tag'>{finishDiff} minutes</div>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {data.length === 0 && <img src='/images/loading_spinner.gif' alt='loading spinner' />}
    </div>
  )
}

DataTable.propTypes = {
  data: arrayOf(shape({
    date: string,
    finish: string,
    start: string
  })),
}

DataTable.defaultProps = {
  data: []
}

export default DataTable
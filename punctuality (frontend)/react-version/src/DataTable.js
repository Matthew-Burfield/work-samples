import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'

const { arrayOf, shape, string } = PropTypes

const getStartValue = (rosteredTime, actualTime, punctualErrorMargin) => {
  if (moment(rosteredTime).diff(moment(actualTime)) < punctualErrorMargin) {
    return 'started late'
  }
  return 'on time'
}

const getFinishTime = (rosteredTime, actionTime, punctualErrorMargin) => {
  if (moment(rosteredTime).diff(moment(actionTime)) > punctualErrorMargin) {
    return 'left early'
  }
  return 'on time'
}

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
            return (
              <tr key={day.date}>
                <td>{moment(day.date).format('MMMM Do YYYY')}</td>
                <td>{moment(day.rosteredStart).format('LT')}</td>
                <td>{getStartValue(day.rosteredStart, day.actualStart, punctualErrorMargin)}<div className='hover-box'>{moment(day.actualStart).format('LT')}</div></td>
                <td>{moment(day.rosteredFinish).format('LT')}</td>
                <td>{getFinishTime(day.rosteredFinish, day.actualFinish, punctualErrorMargin)}<div className='hover-box'>{moment(day.actualFinish).format('LT')}</div></td>
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
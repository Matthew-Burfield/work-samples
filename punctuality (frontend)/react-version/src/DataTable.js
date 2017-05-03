import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'

const { arrayOf, shape, string } = PropTypes

const checkAllDataHasLoaded = (numShifts, numRosters) => {
  if (numShifts > 0 && numRosters > 0) {
    return true
  }
  return false
}

const DataTable = ({shiftData, rosterData}) => {
  const allDataLoaded = checkAllDataHasLoaded(shiftData.length, rosterData.length)
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
          {allDataLoaded && rosterData.map(roster => {
            const shift = shiftData.find(shift => shift.date === roster.date) || { start: '', finish: '' }
            return (
              <tr key={roster.date}>
                <td>{moment(roster.date).format('MMMM Do YYYY')}</td>
                <td>{moment(roster.start).format('LT')}</td>
                <td>{moment(shift.start).format('LT')}</td>
                <td>{moment(roster.finish).format('LT')}</td>
                <td>{moment(shift.finish).format('LT')}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {!allDataLoaded && <img src='/images/loading_spinner.gif' alt='loading spinner' />}
    </div>
  )
}

DataTable.propTypes = {
  shiftData: arrayOf(shape({
    date: string,
    finish: string,
    start: string
  })),
  rosterData: arrayOf(shape({
    date: string,
    finish: string,
    start: string
  })),
}

DataTable.defaultProps = {
  shiftData: [],
  rosterData: []
}

export default DataTable
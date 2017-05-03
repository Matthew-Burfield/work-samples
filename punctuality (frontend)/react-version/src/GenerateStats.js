import moment from 'moment'
import PropTypes from 'prop-types'

const { arrayOf, shape, string, func } = PropTypes

const getTimeDifference = (time1, time2) => {
  if (time1 && time2) {
    return moment(time1).diff(moment(time2), 'minutes');
  }
}

const checkAllDataHasLoaded = (numShifts, numRosters) => {
  if (numShifts > 0 && numRosters > 0) {
    return true
  }
  return false
}

const GenerateStats = ({shiftData, rosterData, updateStats}) => {
  const allDataHasLoaded = checkAllDataHasLoaded(shiftData.length, rosterData.length)

  if (allDataHasLoaded) {
    const startTimeDiffs = []
    const finishTimeDiffs = []
    rosterData.forEach(roster => {
      const shift = shiftData.find(shift => shift.date === roster.date) || {}
      if (shift.start && roster.start) {
        startTimeDiffs.push(getTimeDifference(roster.start, shift.start))
      }
      if (shift.finish && roster.finish) {
        startTimeDiffs.push(getTimeDifference(roster.finish, shift.finish))
      }
    })

    updateStats(startTimeDiffs, finishTimeDiffs)
  }

  return null
}

GenerateStats.propTypes = {
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
  updateStats: func
}

GenerateStats.defaultProps = {
  shiftData: [],
  rosterData: []
}

export default GenerateStats

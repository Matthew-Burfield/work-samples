import React from 'react'
import moment from 'moment'
import ReactTable from 'react-table'
import PropTypes from 'prop-types'
import 'react-table/react-table.css'

const { arrayOf, shape, string } = PropTypes

const diff = (time1, time2) => {
  return time1.diff(time2, 'minutes')
}

const getTimeValue = (timeDiff, punctualErrorMargin) => {
  return function (startOrFinish, notPunctualMessage) {
    if (isNaN(timeDiff)) {
      return 'no time recorded'
    }
    if (timeDiff > punctualErrorMargin) {
      return notPunctualMessage
    }
    return 'on time'
  }
}



const DataTable = ({data, punctualErrorMargin}) => {
  const tableData = data.map(day => {
    const rosteredStart = moment(day.rosteredStart)
    const rosteredFinish = moment(day.rosteredFinish)
    const actualStart = moment(day.actualStart)
    const actualFinish = moment(day.actualFinish)
    const startDiff = diff(actualStart, rosteredStart)
    const finishDiff = diff(rosteredFinish, actualFinish)
    const startText = getTimeValue(startDiff, punctualErrorMargin)('start', 'started late')
    const finishText = getTimeValue(finishDiff, punctualErrorMargin)('finish', 'left early')
    return {
      date: moment(day.date).format('MMMM Do YYYY'),
      rosteredStart: rosteredStart.format('LT'),
      actualStart: {
        startText: startText,
        startTime: actualStart.format('LT'),
        startDiff: startDiff
      },
      rosteredFinish: rosteredFinish.format('LT'),
      actualFinish: {
        finishText: finishText,
        finishTime: actualFinish.format('LT'),
        finishDiff: finishDiff
      }
    }
  })

  const columns = [{
      header: 'Day',
      accessor: 'date',
    }, {
      header: 'Rostered Start',
      accessor: 'rosteredStart'
    }, {
      header: 'Actual Start',
      accessor: 'actualStart',
      render: d => {
        return (
          <div>
            {d.value.startText}
            <div className='hover-box'>{d.value.startTime}</div>
            {d.value.startDiff > 0 && <div className='time-diff-tag'>{d.value.startDiff} minutes</div>}
          </div>
        )
      }
    }, {
      header: 'Rostered Finish',
      accessor: 'rosteredFinish'
    }, {
      header: 'Actual Finish',
      accessor: 'actualFinish',
      render: d => {
        return (
          <div>
            {d.value.finishText}
            <div className='hover-box'>{d.value.finishTime}</div>
            {d.value.finishDiff > 0 && <div className='time-diff-tag'>{d.value.finishDiff} minutes</div>}
          </div>
        )
      }
    }]
  return (
    <div className="body-table">
      <ReactTable
        data={tableData}
        columns={columns}
        defaultPageSize={10}
      />
      {data.length === 0 && <img src='/images/loading_spinner.gif' alt='loading spinner' />}
    </div>
  )
}

DataTable.propTypes = {
  data: arrayOf(shape({
    date: string,
    rosteredStart: string,
    rosteredFinish: string,
    actualStart: string,
    actualFinish: string
  })),
}

DataTable.defaultProps = {
  data: []
}

export default DataTable
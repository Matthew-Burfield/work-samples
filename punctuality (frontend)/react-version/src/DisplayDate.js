import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'

const { string, bool } = PropTypes

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

const DisplayDate = ({value, hoverBox, timeDiffTag, actualTime}) => {
  return (
    <div>
      {getStartValue(day.rosteredStart, day.actualStart, punctualErrorMargin)}<div className='hover-box'>{moment(day.actualStart).format('LT')}</div>
    </div>
  )
}

DisplayDate.propTypes = {
  date: string,
  hoverBox: bool,
  timeDiffTag: bool
}
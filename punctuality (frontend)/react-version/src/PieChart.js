import React from 'react'
import PropTypes from 'prop-types'

const getPieWrapperRightSideStyles = (progressBarDegrees) => {
  const transformVal = progressBarDegrees > 180 ? 180 : 0
  return {
    display: progressBarDegrees > 180 ? 'block' : 'none',
    WebkitTransform: `rotate(${transformVal}deg)`,
    transform: `rotate(${transformVal}deg)`
  }
}

const PieChart = ({punctualPercentage}) => {
  const progressBarDegrees = punctualPercentage / 100 * 360
  const pieStyles = progressBarDegrees > 180 ? { clip: 'rect(auto, auto, auto, auto)' } : { clip: '' }
  const pieRightSideStyles = getPieWrapperRightSideStyles(progressBarDegrees)
  return (
    <div className="pie-wrapper">
      <span className="label">{punctualPercentage}</span>
      <div className="pie" style={pieStyles}>
        <div className="left-side half-circle" style={{ WebkitTransform: `rotate(${progressBarDegrees}deg)`, transform: `rotate(${progressBarDegrees}deg)`}}></div>
        <div className="right-side half-circle" style={pieRightSideStyles}></div>
      </div>
    </div>
  )
}

PieChart.propTypes = {
  punctualPercentage: PropTypes.number
}

export default PieChart
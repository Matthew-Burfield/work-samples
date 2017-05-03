import React, { Component } from 'react';
import axios from 'axios'
import moment from 'moment'
import Header from './Header'
import Stats from './Stats'
import DataTable from './DataTable'
import './style.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'Sully',
      punctualErrorMargin: 0
    }
  }

  componentDidMount() {
    const URL_SHIFTS = 'http://localhost:4567/shifts/2013-01-15/2015-09-15'
    const URL_ROSTERS = 'http://localhost:4567/rosters/2013-01-15/2015-09-15'
    axios.all([this.getData(URL_SHIFTS), this.getData(URL_ROSTERS)])
      .then(axios.spread((shifts, rosters) => {
        const data = rosters.data.map(roster => {
          const shift = shifts.data.find(shift => shift.date === roster.date) || { start: '', finish: ''}
          return {
            date: roster.date,
            rosteredStart: roster.start,
            actualStart: shift.start,
            rosteredFinish: roster.finish,
            actualFinish: shift.finish
          }
        })

        const timeDiffs = this.generateStats(data)
        this.setState({
          data,
          startTimeDiffs: timeDiffs[0],
          finishTimeDiffs: timeDiffs[1]
        })
      }));
  }

  getData(url) {
    return axios.get(url)
  }

  getTimeDifference(time1, time2) {
    if (time1 && time2) {
      return moment(time1).diff(moment(time2), 'minutes');
    }
  }

  generateStats(data) {
    const startTimeDiffs = []
    const finishTimeDiffs = []
    data.forEach(day => {
      if (day.rosteredStart && day.actualStart) {
        startTimeDiffs.push(this.getTimeDifference(day.rosteredStart, day.actualStart))
      }
      if (day.rosteredFinish && day.actualFinish) {
        finishTimeDiffs.push(this.getTimeDifference(day.rosteredFinish, day.actualFinish))
      }
    })
    return [startTimeDiffs, finishTimeDiffs]
  }

  render() {
    return (
      <div className="outer-container">
        <Header name={this.state.name} />
        <div className="body-container">
          <Stats
            punctualErrorMargin={this.state.punctualErrorMargin}
            startTimeDiffs={this.state.startTimeDiffs}
            finishTimeDiffs={this.state.finishTimeDiffs}
          />
          <DataTable data={this.state.data} punctualErrorMargin={this.state.punctualErrorMargin} />
        </div>
        <div className="footer-container">
        </div>
      </div>
    );
  }
}

export default App;

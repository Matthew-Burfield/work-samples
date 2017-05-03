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
    this.updatePunctualErrorMargin = this.updatePunctualErrorMargin.bind(this)
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
        this.setState({
          data
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

  updatePunctualErrorMargin(e) {
    let value = Number.parseInt(e.target.value, 10)
    if (isNaN(value)) {
      value = '';
    }
    this.setState({
      punctualErrorMargin: value
    })
  }

  render() {
    return (
      <div className="outer-container">
        <Header name={this.state.name} />
        <div className="body-container">
          <Stats
            data={this.state.data}
            punctualErrorMargin={this.state.punctualErrorMargin}
            updatePunctualErrorMargin={this.updatePunctualErrorMargin}
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

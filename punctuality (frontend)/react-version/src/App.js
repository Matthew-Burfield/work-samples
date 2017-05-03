import React, { Component } from 'react';
import axios from 'axios'
import Header from './Header'
import PieChart from './PieChart'
import Stats from './Stats'
import DataTable from './DataTable'
import './style.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'Sully',
      shifts: {},
      roster: {},
      stats: {
        arrivedLate: [],
        punctual: [],
        leftEarly: []
      }
    }
  }

  componentDidMount() {
    const URL_SHIFTS = 'http://localhost:4567/shifts/2013-01-15/2015-09-15'
    const URL_ROSTERS = 'http://localhost:4567/rosters/2013-01-15/2015-09-15'
    axios.get(URL_ROSTERS)
         .then(response => {
           this.setState({
             roster: response
           })
         })
    axios.get(URL_SHIFTS)
         .then(response => {
           this.setState({
             shifts: response
           })
         })
  }

  render() {
    return (
      <div className="outer-container">
        <Header />
        <div className="body-container">
          <PieChart />
          <Stats />
          <DataTable shiftData={this.state.shifts.data} rosterData={this.state.roster.data} />
        </div>
        <div className="footer-container">
        </div>
      </div>
    );
  }
}

export default App;

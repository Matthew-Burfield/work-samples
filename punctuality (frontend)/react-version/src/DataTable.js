import React from 'react'

const DataTable = (shiftData, rosterData) =>
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
      </tbody>
    </table>
    {!shiftData && !rosterData && <img src='/images/loading_spinner.gif' alt='loading spinner' />}
  </div>;

export default DataTable
import React from "react";
import {DateTime} from "luxon";

function groupSamplesByDay(samples) {
    // Assumes that all samples are already in chronological order.
    var samplesbyday = [];
    var samplesforcurrentday = [];
    var currentdt = null;

    if (samples[0]) {
        currentdt = samples[0].time;
    }

    for (const sample of samples) {
        const sampledt = sample.time;
        if (sampledt.day !== currentdt.day)
        {
            samplesbyday.push({datestr: currentdt.toLocaleString(DateTime.DATE_FULL), samples: samplesforcurrentday});
            samplesforcurrentday = [];
            currentdt = sampledt;
        }

        samplesforcurrentday.push(sample);
    }

    if (samples[0]) {
        samplesbyday.push({datestr: currentdt.toLocaleString(DateTime.DATE_FULL), samples: samplesforcurrentday});
    }
    return samplesbyday;
}

export function SamplesTable(props) {
    const samplesbyday = groupSamplesByDay(props.samples);
    let daytables = [];

    for (const daysamples of samplesbyday) {
        daytables.push(
            <DayTable key={daysamples.datestr} heading={daysamples.datestr} samples={daysamples.samples} />
        );
    }

    return (
        <div>
            {daytables}
        </div>
    );
}

function DayTable(props) {
    var tablerows = [];

    for (const sample of props.samples) {
        tablerows.push(<TableRow key={sample.time.toLocaleString(DateTime.TIME_24_SIMPLE)} time={sample.time.toLocaleString(DateTime.TIME_24_SIMPLE)} temp={sample['temp']} rh={sample['rh']} />);
    }
    return (
      <table className="table is-striped">
        <thead>
            <tr>
                <th className="stickyheading" colSpan="3">{props.heading}</th>
            </tr>
            <tr>
                <th>Time</th>
                <th>Temp °C</th>
                <th>RH %</th>
            </tr>
        </thead>
          <tbody>
            {tablerows}
          </tbody>
      </table>
    );
}

function TableRow(props) {
    return (
      <tr>
          <td>{props.time}</td>
          <td>{parseFloat(props.temp).toFixed(2)}</td>
          <td>{parseFloat(props.rh).toFixed(2)}</td>
      </tr>
    );
}
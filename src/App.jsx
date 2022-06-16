import * as d3 from "d3";
import React, { useState, useEffect } from "react";
import "bulma/css/bulma.css";

export default function App() {
  const [data, setData] = useState(null);
  const [xproperty, setXproperty] = useState("sepalLength");
  const [yproperty, setYproperty] = useState("sepalWidth");
  const [shows, setShows] = useState([true, true, true]);
  useEffect(() => {
    fetch("https://assets.codepen.io/2004014/iris.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);
  // console.log(data);

  if (data == null) {
    return <p>loading.....</p>;
  }
  const windowWidth = 500;
  const windowHeight = 400;
  const margin = {
    left: 50,
    right: 90,
    bottom: 50,
    top: 30,
  };
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (flower) => flower[`${xproperty}`]))
    .range([margin.left, windowWidth - margin.right])
    .nice();
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (flower) => flower[`${yproperty}`]))
    .range([windowHeight - margin.bottom, margin.top])
    .nice();
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  const xAxis = xScale.ticks();
  const yAxis = yScale.ticks();
  // console.log(xAxis);
  // console.log(yAxis);
  const flowerSpecies = [
    ...new Set(
      data.map((flower) => {
        return flower.species;
      })
    ),
  ];
  return (
    <div>
      <div className="hero is-small is-info">
        <div className="hero-body">
          <h1 className="title">scatter plot of iris data</h1>
        </div>
      </div>
      <div>
        <div class="field column">
          <label class="label">Xproperty</label>
          <div class="select is-fullwidth">
            <select
              name="x property"
              defaultValue="sepalLength"
              onChange={(event) => {
                event.preventDefault();
                setXproperty(event.target.value);
              }}
            >
              <option value="sepalLength">sepalLength</option>
              <option value="sepalWidth">sepalWidth</option>
              <option value="petalLength">petalLength</option>
              <option value="petalWidth">petalWidth</option>
            </select>
          </div>
        </div>
        <div class="field column">
          <label class="label">Yproperty</label>
          <div class="select is-fullwidth">
            <select
              name="y property"
              defaultValue="sepalWidth"
              onChange={(event) => {
                event.preventDefault();
                setYproperty(event.target.value);
              }}
            >
              <option value="sepalLength">sepalLength</option>
              <option value="sepalWidth">sepalWidth</option>
              <option value="petalLength">petalLength</option>
              <option value="petalWidth">petalWidth</option>
            </select>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: "white" }}>
        <svg width={windowWidth} height={windowHeight}>
          <line
            x1={margin.left}
            x2={windowWidth - margin.right}
            y1={windowHeight - margin.bottom}
            y2={windowHeight - margin.bottom}
            stroke="black"
            strokeWidth="1"
          />
          {xAxis.map((item) => {
            return (
              <g key={`"x"+${item}`}>
                <line
                  x1={xScale(item)}
                  x2={xScale(item)}
                  y1={windowHeight - margin.bottom}
                  y2={windowHeight - margin.bottom + 10}
                  stroke="black"
                  strokeWidth="1"
                />
                <text
                  dominantBaseline="hanging"
                  textAnchor="middle"
                  x={xScale(item)}
                  y={windowHeight - margin.bottom + 10}
                >
                  {item}
                </text>
              </g>
            );
          })}
          <line
            x1={margin.left}
            x2={margin.left}
            y1={margin.top}
            y2={windowHeight - margin.bottom}
            stroke="black"
            strokeWidth="1"
          />
          {yAxis.map((item) => {
            return (
              <g key={`"y"+${item}`}>
                <line
                  x1={margin.left - 10}
                  x2={margin.left}
                  y1={yScale(item)}
                  y2={yScale(item)}
                  stroke="black"
                  strokeWidth="1"
                />
                <text
                  dominantBaseline="middle"
                  textAnchor="end"
                  x={margin.left - 10}
                  y={yScale(item)}
                >
                  {item}
                </text>
              </g>
            );
          })}
          {flowerSpecies.map((flower, index) => {
            // console.log(flower)
            return (
              <g
                key={`${flower}`}
                opacity={shows[index] === true ? 1 : 0.5}
                onClick={() => {
                  setShows(
                    shows.map((show, i) => {
                      return i === index ? !show : show;
                    })
                  );
                }}
                transform={`translate(${windowWidth - margin.right},${
                  margin.top
                })`}
              >
                <rect
                  x={0}
                  y={0 + 13 * index}
                  width={10}
                  height={10}
                  fill={colorScale(flower)}
                />
                <text
                  dominantBaseline="middle"
                  x={12}
                  y={7 + 13 * index}
                  fontSize={10}
                >
                  {flower}
                </text>
              </g>
            );
          })}
          {data.map((flower, index) => {
            let show;
            if (flower.species == "setosa") {
              show = shows[0];
            } else if (flower.species == "versicolor") {
              show = shows[1];
            } else if (flower.species == "virginica") {
              show = shows[2];
            }
            return (
              <circle
                key={`${index}`}
                transform={`translate(${xScale(
                  flower[`${xproperty}`]
                )},${yScale(flower[`${yproperty}`])})`}
                r="3"
                fill={colorScale(flower.species)}
                opacity={show === true ? 1 : 0}
                style={{ transition: "transform 0.5s,opacity 0.5s" }}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

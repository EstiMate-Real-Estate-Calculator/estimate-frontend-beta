import React, { useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import Formatter from './formatterClass';

const LineChart = ({ data }) => {
  const width = 800;
  const height = 400;
  const margin = useMemo(
    () => ({ top: 40, right: 150, bottom: 40, left: 60 }),
    []
  );

  useEffect(() => {
    const svg = d3
      .select('#line-chart')
      .attr('width', width)
      .attr('height', height);

    const x = d3
      .scaleLinear()
      .domain([1, d3.max(data.datasets, (ds) => ds.values.length)]) // Years
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data.datasets, (ds) => d3.max(ds.values))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x((d, i) => x(i + 1)) // Adjust for years starting from 1
      .y((d) => y(d));

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Clear previous content
    svg.selectAll('*').remove();

    // Add lines for each dataset
    data.datasets.forEach((dataset, index) => {
      svg
        .append('path')
        .datum(dataset.values)
        .attr('fill', 'none')
        .attr('stroke', color(index))
        .attr('stroke-width', 2)
        .attr('d', line);

      // Add points for each data point
      dataset.values.forEach((value, i) => {
        svg
          .append('circle')
          .attr('cx', x(i + 1))
          .attr('cy', y(value))
          .attr('r', 4)
          .attr('fill', color(index));
      });
    });

    // Add the x-axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(data.datasets[0].values.length)
          .tickFormat((d) => d)
      );

    // Add the y-axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat((d) => formatFinancial(d)));

    // Add a title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.top)
      .attr('text-anchor', 'middle')
      .style('font-size', '24px')
      .text(data.title);

    // Create a legend
    const legend = svg
      .append('g')
      .attr(
        'transform',
        `translate(${width - margin.right + 20}, ${margin.top})`
      );

    data.datasets.forEach((dataset, index) => {
      legend
        .append('rect')
        .attr('x', 0)
        .attr('y', index * 25) // Space out each legend item
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', color(index));

      legend
        .append('text')
        .attr('x', 30)
        .attr('y', index * 25 + 10) // Center text vertically
        .text(dataset.name);
    });
  }, [data, width, height, margin]);

  const formatFinancial = (value) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}m`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}k`;
    return `$${value}`;
  };

  return <svg id='line-chart'></svg>;
};

const DonutChart = ({ data }) => {
  const width = 200;
  const height = 200;
  const margin = 20;
  const radius = Math.min(width, height) / 2 - margin;

  // Calculate total expenses
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  useEffect(() => {
    const svg = d3
      .select('#pie-chart')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create pie chart layout
    const pie = d3.pie().value((d) => d.value);
    const arc = d3
      .arc()
      .innerRadius(radius * 0.5) // This creates the hole in the middle
      .outerRadius(radius);

    // Clear previous content
    svg.selectAll('*').remove();

    // Create arcs
    const arcs = svg
      .selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i));
  }, [data, width, height, margin, radius]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Monthly Expenses: {Formatter.formatUSD(total)}</h2>
      <svg id='pie-chart'></svg>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '10px',
        }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            style={{ margin: '5px 0', display: 'flex', alignItems: 'center' }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: d3.schemeCategory10[index],
                marginRight: '10px',
              }}
            />
            <span>
              {item.label}: {Formatter.formatUSD(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { LineChart, DonutChart };

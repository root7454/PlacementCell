import React, { useEffect } from "react";
import ApexCharts from "apexcharts";

const PlacementCellHowItWorks = () => {
  useEffect(() => {
    // Initialize ApexCharts
    const reportsChart = new ApexCharts(document.querySelector("#reportsChart"), {
      series: [{
        name: 'Applications',
        data: [45, 52, 38, 57, 62, 95, 75],
      }, {
        name: 'Interviews',
        data: [25, 37, 30, 45, 50, 68, 52]
      }, {
        name: 'Placements',
        data: [15, 28, 20, 35, 40, 55, 42]
      }],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false
        },
      },
      markers: {
        size: 4
      },
      colors: ['#ff9900', '#00cc99', '#003399'],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.4,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        type: 'datetime',
        categories: ["2023-01-19T00:00:00.000Z", "2023-01-19T01:30:00.000Z", "2023-01-19T02:30:00.000Z", "2023-01-19T03:30:00.000Z", "2023-01-19T04:30:00.000Z", "2023-01-19T05:30:00.000Z", "2023-01-19T06:30:00.000Z"]
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
      }
    });
    reportsChart.render();

    // Clean up the ApexCharts instance when the component unmounts
    return () => {
      reportsChart.destroy();
    };
  }, []); // Empty dependency array to run the effect only once after the component mounts

  return (
    <>
      <div id='reportsChart'></div>
    </>
  );
};

export default PlacementCellHowItWorks;

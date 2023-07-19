import React, { useEffect, useState } from 'react'
import Highcharts from 'highcharts'
import HighchartsMap from 'highcharts/modules/map'
import HighchartsReact from 'highcharts-react-official'
import axios from 'axios'
import Navbar from '../Navbar/Navbar'
import './DashBoard.css'

// Load the map module
HighchartsMap(Highcharts)

const DashBoard = () => {
  const [dashboardData, setDashboardData] = useState()
  const [topology, setTopology] = useState(null)

  const fetchDashboardData = async () => {
    try {
      var response = await axios.get(`http://localhost:8000/getdashboarddata`)
      var data = response.data
      setDashboardData(data)
    } catch (error) {
      console.log(`Error at fetching dashboard data : ${error.message}`)
    }
  }

  useEffect(() => {
    ;(async () => {
      fetchDashboardData()
      const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world-continents.topo.json'
      ).then((response) => response.json())
      setTopology(topology)
    })()
  }, [])

  useEffect(() => {
    if (topology && dashboardData) {
      Highcharts.mapChart('map-container', {
        chart: {
          map: topology,
        },

        title: {
          text: 'World Map',
        },

        mapNavigation: {
          enabled: true,

          buttonOptions: {
            verticalAlign: 'bottom',
          },
        },

        colorAxis: {
          min: 0,
        },

        series: [
          {
            data: [
              [
                'as',
                dashboardData !== undefined
                  ? dashboardData.regionSalesValues[0]
                  : 1,
              ],
              [
                'eu',
                dashboardData !== undefined
                  ? dashboardData.regionSalesValues[1]
                  : 1,
              ],
              [
                'oc',
                dashboardData !== undefined
                  ? dashboardData.regionSalesValues[2]
                  : 1,
              ],
              [
                'na',
                dashboardData !== undefined
                  ? dashboardData.regionSalesValues[3]
                  : 1,
              ],
              [
                'af',
                dashboardData !== undefined
                  ? dashboardData.regionSalesValues[4]
                  : 1,
              ],
              [
                'sa',
                dashboardData !== undefined
                  ? dashboardData.regionSalesValues[5]
                  : 1,
              ],
            ],

            name: 'Sales',

            states: {
              hover: {
                color: '#BADA55',
              },
            },

            dataLabels: {
              enabled: true,

              format: '{point.name}',
            },
          },
        ],
      })
    }
  }, [topology, dashboardData])

  const areaChartOptions = {
    chart: {
      type: 'area',
    },
    title: {
      text: 'Area Chart for Category Sales',
    },
    xAxis: {
      categories:
        dashboardData !== undefined ? dashboardData.categorySalesKeys : null,
    },
    yAxis: {
      title: {
        text: 'Sales',
      },
    },
    series: [
      {
        name: 'Sales',
        data:
          dashboardData !== undefined ? dashboardData.categorySalesValues : null,
      },
    ],
  }

  // const barOptions = {
  //   title: {
  //     text: 'Bar Chart',
  //   },
  //   series: [
  //     {
  //       name: 'Bar Data',
  //       type: 'bar',
  //       data: [10, 20, 30, 40, 50], // Example data, replace with your own
  //     },
  //   ],
  // }
  const barOptions = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Bar Chart',
    },
    xAxis: {
      categories:
        dashboardData !== undefined ? dashboardData.categorySalesKeys : null,
      title: {
        text: null,
      },
    },
    yAxis: {
      title: {
        text: 'Sales',
      },
    },
    series: [
      {
        name: 'Data',
        data:
          dashboardData !== undefined ? dashboardData.categorySalesValues : null,
      },
    ],
  }

  // {
  //   title: {
  //     text: 'Bar Chart',
  //   },
  //   series: [
  //     {
  //       name: 'Bar Data',
  //       type: 'bar',
  //       data: [10, 20, 30, 40, 50], // Example data, replace with your own
  //       labels: {
  //         enabled: true, // Enable data labels
  //         formatter: function () {
  //           return dashboardData; // Display the data value as the label
  //         },
  //       },
  //     },
  //   ],
  // };

  const donutOptions = {
    chart: {
      type: 'pie',
      plotShadow: false,
    },
    title: {
      text: 'Continent Chart',
    },
    plotOptions: {
      pie: {
        innerSize: '50%',
        depth: 45,
        // dataLabels: {
        //   enabled: true, // Display data labels
        //   format: '{point.name}: {point.percentage:.1f}%', // Format the label as name: percentage
        // }
        // dataLabels: dashboardData != undefined ? dashboardData.categorySalesKeys: null,
      },
    },
    series: [
      {
        name: 'Sales',
        type: 'pie',
        data: [
          [
            'Asia',
            dashboardData !== undefined ? dashboardData.regionSalesValues[0] : 0,
          ],
          [
            'Europe',
            dashboardData !== undefined ? dashboardData.regionSalesValues[1] : 1,
          ],
          [
            'Australia',
            dashboardData !== undefined ? dashboardData.regionSalesValues[2] : 2,
          ],
          [
            'North America',
            dashboardData !== undefined ? dashboardData.regionSalesValues[3] : 3,
          ],
          [
            'South America',
            dashboardData !== undefined ? dashboardData.regionSalesValues[4] : 4,
          ],
          [
            'Africa',
            dashboardData !== undefined ? dashboardData.regionSalesValues[5] : 5,
          ],
        ], // Example data, replace with your own
      },
    ],
  }

  // Generate random data for the boxes
  const boxData = [
    {
      title: 'Top Region',
      value: 'Asia',
    },
    {
      title: 'Top Region Sales',
      value:
        dashboardData !== undefined
          ? `$ ` + dashboardData.regionSalesValues[0]
          : null,
    },
    {
      title: 'Total Sales',
      value: dashboardData !== undefined ? `$ ` + dashboardData.totalSum : null,
    },
    {
      title: 'Top Category',
      value: 'Sports and Fitness',
    },
    {
      title: 'Top Category Sales',
      value:
        dashboardData !== undefined
          ? `$ ` + dashboardData.categorySalesValues[1]
          : null,
    },
  ]

  return (
    <>
      <Navbar />
      <div className='dashboard-container'>
        <div className='boxes-container'>
          {boxData.map((box, index) => (
            <div key={index} className='box'>
              <h3>{box.title}</h3>
              <p>{box.value}</p>
            </div>
          ))}
        </div>
        <div className='separator'></div>
        <div className='charts-container'>
          <div className='chart-box'>
            <HighchartsReact highcharts={Highcharts} options={donutOptions} />
          </div>
          {topology ? (
            <div className='chart-box'>
              <div id='map-container'></div>
            </div>
          ) : (
            'Loading topology data...'
          )}
          <div className='chart-box'>
            <HighchartsReact
              highcharts={Highcharts}
              options={areaChartOptions}
            />
          </div>
          <div className='chart-box'>
            <HighchartsReact highcharts={Highcharts} options={barOptions} />
          </div>
        </div>
      </div>
    </>
  )
}

export default DashBoard

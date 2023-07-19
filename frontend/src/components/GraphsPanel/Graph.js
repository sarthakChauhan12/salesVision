import React, { useState, useEffect, useCallback } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import AccessibilityModule from 'highcharts/modules/accessibility'
import axios from 'axios'
import './Graph.css'

AccessibilityModule(Highcharts)

const Graph = (props) => {
  const [data, setData] = useState([])
  const [chartOptions, setChartOptions] = useState({
    title: {
      text: 'Forecast',
    },
    xAxis: {
      title: {
        text: 'Date',
      },
      crosshair: {
        color: 'grey',
        width: 0.5,
        dashStyle: 'Dash',
      },
    },
    yAxis: {
      title: {
        text: 'Sales',
      },
      crosshair: {
        color: 'grey',
        width: 0.5,
        dashStyle: 'Dash',
      },
    },
    series: [
      {
        name: 'Forecasted Data',
        data: [5, 10, 15, 20, 25],
      },
    ],
  })

  const updateGraphData = (props) => {
    var actualSales = []
    var forecastedSales = []
    if (props.value === 60) {
      for (let i = 0; i < 60; i++) {
        actualSales.push(props.data[i])
        forecastedSales.push(null)
      }
      for (let i = 60; i < props.data.length; i++) {
        forecastedSales.push(props.data[i])
      }
    } else if (props.value === 8) {
      for (let i = 0; i < 8; i++) {
        actualSales.push(props.data[i])
        forecastedSales.push(null)
      }
      actualSales.push(props.data[8])
      for (let i = 8; i < props.data.length; i++) {
        forecastedSales.push(props.data[i])
      }
    } else {
      for (let i = 0; i < 2; i++) {
        actualSales.push(props.data[i])
        forecastedSales.push(null)
      }
      actualSales.push(props.data[2])
      actualSales.push(props.data[8])
      for (let i = 2; i < props.data.length; i++) {
        forecastedSales.push(props.data[i])
      }
    }

    setChartOptions({
      series: [
        // { data: props.data },
        {
          data: actualSales, // First data series
          name: 'Actuals',
          color: 'red', // Set color for the first data series
        },
        {
          data: forecastedSales, // Second data series
          name: 'Forecasted',
          color: 'blue', // Set color for the second data series
        },
      ],
      xAxis: {
        categories: props.labels,
        plotLines: [
          {
            color: 'black',
            width: 3,
            value: props.value,
            label: {
              text: 'Today',
              verticalAlign: 'top',
              rotation: 0,
            },
            zIndex: -1,
          },
        ],
      },
    })
  }

  const handleFrequencyChange = useCallback(
    (event) => {
      if (data.length === 0) {
        return
      }
      if (event.target.value === 'daily') {
        const today = new Date()
        const dateLabels = []

        for (let i = -60; i <= 120; i++) {
          const date = new Date()
          date.setDate(today.getDate() + i)
          dateLabels.push(date.toLocaleDateString())
        }
        updateGraphData({ data: data, value: 60, labels: dateLabels })
      } else if (event.target.value === 'weekly') {
        const newAverageArray = []
        const previousAverageArray = []
        for (let i = 0; i < 56; i += 7) {
          const range = data.slice(i, i + 7)
          const sum = range.reduce((acc, num) => acc + num, 0)
          previousAverageArray.push(sum)
        }
        for (let i = 60; i < 179; i += 7) {
          const range = data.slice(i, i + 7)
          const sum = range.reduce((acc, num) => acc + num, 0)
          newAverageArray.push(sum)
        }
        newAverageArray.unshift(...previousAverageArray)
        const today = new Date()
        const dateLabels = []

        for (let i = -60; i <= 120; i++) {
          const startDate = new Date()
          startDate.setDate(today.getDate() + i * 7) // Multiply by 7 to get weekly interval

          const startDateLabel = startDate.toLocaleDateString()
          dateLabels.push(startDateLabel)
        }
        updateGraphData({ data: newAverageArray, value: 8, labels: dateLabels })
      } else if (event.target.value === 'monthly') {
        const newMonthlyArray = []
        for (let i = 0; i < 180; i += 30) {
          const range = data.slice(i, i + 30)
          const sum = range.reduce((acc, num) => acc + num, 0)
          newMonthlyArray.push(sum)
        }
        const today = new Date()
        const currentMonth = today.getMonth()
        const monthLabels = []

        function getMonthName(monthIndex) {
          const monthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ]
          return monthNames[monthIndex]
        }

        for (let i = currentMonth - 2; i <= currentMonth + 4; i++) {
          const monthIndex = (i + 12) % 12 // Ensure the index stays within 0-11 range
          monthLabels.push(getMonthName(monthIndex))
        }
        updateGraphData({
          data: newMonthlyArray,
          value: 2,
          labels: monthLabels,
        })
      }
    },
    [data]
  )

  const handleGenerateClick = async () => {
    if (props.selectedOptions.length === 0) {
      console.warn('Choose an option first')
      window.alert('Choose an option first')
      return
    }
    const selectedAlgorithm = document.getElementById('algorithm').value
    try {
      const response = await axios.post(
        `http://localhost:5000/prediction`,
        {
          algorithm: selectedAlgorithm,
          options: props.selectedOptions,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      setData(response.data)
    } catch (error) {
      console.warn(error.message)
    }
  }

  useEffect(() => {
    const selectedFrequency = document.getElementById('frequency').value
    handleFrequencyChange({ target: { value: selectedFrequency } })
  }, [data, handleFrequencyChange])

  return (
    <div className='graph-container'>
      <div className='dropdown-container'>
        <select className='styled-dropdown' id='algorithm'>
          <option value='Smoothing' title='For less fluctuating data'>
            Smoothing
          </option>
          <option value='Arima' title='For more fluctuating data'>
            Arima
          </option>
          <option value='Sarima' title='For mildly fluctuating data'>
            Sarima
          </option>
          <option value='Prophet' title='Jai Shree Ram'>
            Prophet
          </option>
        </select>
        <select
          className='styled-dropdown'
          id='frequency'
          onChange={handleFrequencyChange}
        >
          <option value='daily'>Daily</option>
          <option value='weekly'>Weekly</option>
          <option value='monthly'>Monthly</option>
        </select>
        <button className='right-panel-button' onClick={handleGenerateClick}>
          Generate
        </button>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  )
}

export default Graph

// [100, 103, 109, 106, 112, 114, 119, 116, 122, 125, 128, 131, 137, 133, 135, 143, 140, 146, 149, 155, 152, 158, 161, 167, 164, 169, 172, 178, 175, 181, 184, 188, 185, 191, 194, 200, 197, 203, 206, 210, 208, 214, 217, 223, 220, 226, 229, 235, 232, 238, 241, 247, 244, 250, 253, 257, 255, 261, 264, 270, 267, 273, 276, 282, 279, 285, 288, 294, 291, 297, 300, 304, 301, 307, 310, 316, 313, 319, 322, 328, 325, 331, 334, 340, 337, 343, 346, 352, 349, 355, 358, 364, 361, 367, 370, 376, 373, 379, 382, 388, 385, 391, 394, 400, 397, 400, 403, 406, 409, 412, 415, 418, 421, 424, 427, 430, 433, 436, 439, 442, 445, 448, 451, 454, 457, 460, 463, 466, 469, 472, 475, 478, 481, 484, 487, 490, 493, 496, 499, 502, 505, 508, 511, 514, 517, 520, 523, 526, 529, 532, 535, 538, 541, 544, 547, 550, 553, 556, 559, 562, 565, 568, 571, 574, 577, 580, 583, 586, 589, 592, 595, 598, 601, 604, 607, 610, 613, 616, 619, 622, 625, 628, 631, 634, 637, 640, 643, 646, 649, 652, 655, 658, 661, 664, 667, 670, 673, 676, 679, 682, 685, 688, 691, 694, 697, 700, 703, 706, 709, 712, 715, 718, 721, 724, 727, 730, 733, 736, 739, 742, 745, 748, 751, 754, 757, 760, 763, 766, 769, 772, 775, 778, 781, 784, 787, 790, 793, 796, 799, 802, 805, 808, 811, 814, 817, 820, 823, 826, 829, 832, 835, 838, 841, 844, 847, 850, 853, 856, 859, 862, 865, 868, 871, 874, 877, 880, 883, 886, 889, 892, 895, 898, 901, 904, 907, 910, 913, 916, 919, 922, 925, 928, 931, 934, 937, 940, 943, 946, 949, 952, 955, 958, 961, 964, 967, 970, 973, 976, 979, 982, 985, 988, 991, 994, 997, 1000]
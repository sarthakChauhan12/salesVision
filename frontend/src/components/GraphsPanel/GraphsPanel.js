import React, { useState, useEffect } from 'react'
import Graph from './Graph'
import Navbar from '../Navbar/Navbar'
import axios from 'axios'
import './GraphsPanel.css'

const GraphsPanel = () => {
  const [selectedOptions, setSelectedOptions] = useState([])
  const [filterText, setFilterText] = useState('')
  const [options, setOptions] = useState(['Option 1', 'Option 2'])

  const fetchOptionsData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/getoptions`)
      setOptions(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchOptionsData()
  }, [])

  const handleOptionChange = (event) => {
    const optionId = event.target.id
    if (event.target.checked) {
      setSelectedOptions([...selectedOptions, optionId])
    } else {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId))
    }
  }

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(filterText.toLowerCase())
  )

  const handleSelectAll = () => {
    if (selectedOptions.length === options.length) {
      // If all options are already selected, deselect all options
      setSelectedOptions([])
    } else {
      // Otherwise, select all options
      setSelectedOptions(options)
    }
  }

  const handleClearAll = () => {
    setSelectedOptions([])
  }

  const handleFileDataUpload = (productName) => {
    setOptions((prevOptions) => [...prevOptions, productName])
  }

  return (
    <div className='graphs-panel'>
      <Navbar onFileDataUpload={handleFileDataUpload} />

      <div className='container'>
        <div className='left-half'>
          <div className='sidebar'>
            <h3>Select Options:</h3>
            <input
              type='text'
              placeholder='Filter options'
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <div className='select-all-clear-all-buttons'>
              <button className='select-all-button' onClick={handleSelectAll}>
                {selectedOptions.length === options.length
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
              <button className='clear-all-button' onClick={handleClearAll}>
                Clear
              </button>
            </div>
            <div className='scrollable-div'>
              {filteredOptions.map((option) => (
                <label
                  htmlFor={option}
                  key={option}
                  className='checkbox-label'
                  style={{ cursor: 'pointer' }}
                >
                  <span
                    className={`custom-checkbox ${
                      selectedOptions.includes(option) ? 'checked' : ''
                    }`}
                  />
                  {option}
                  <input
                    type='checkbox'
                    id={option}
                    checked={selectedOptions.includes(option)}
                    onChange={handleOptionChange}
                    style={{ display: 'none' }}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className='divider-gap'>
        </div>
        <div className='right-half'>
          <Graph selectedOptions={selectedOptions} />
        </div>
      </div>
    </div>
  )
}

export default GraphsPanel

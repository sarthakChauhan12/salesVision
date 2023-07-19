// import React, { useRef } from 'react'
// import './FileUploadModal.css'
// import * as XLSX from 'xlsx'
// import { toast } from 'react-toastify'
// import axios from 'axios'

// const FileUploadModal = ({ onClose, onFileUpload }) => {
//   const fileInputRef = useRef(null)
//   const supportedExtensions = ['xlsx', 'xls', 'csv']
//   const acceptExtensions = supportedExtensions
//     .map((extension) => `.${extension}`)
//     .join(',')
//   const handleAddFileClick = () => {
//     fileInputRef.current.click()
//   }

//   const handleFileChange = (file) => {
//     const reader = new FileReader()
//     reader.onload = async (e) => {
//       const data = new Uint8Array(e.target.result)
//       const workbook = XLSX.read(data, { type: 'array' })
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]]
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

//       // Extract the sales values from the jsonData array
//       const sales = jsonData.slice(2).map((row) => row[0])

//       // Create the resulting object
//       const fileName = file.name.split('.')[0]
//       const result = {
//         category: jsonData[0][0],
//         region: jsonData[1][0],
//         productName: fileName, // Include the file name
//         sales: sales.map(Number),
//       }
//       try {
//         var response = await axios.post(
//           `http://localhost:5000/save`,
//           {
//             category : result.category,
//             region: result.region,
//             productName: result.productName,
//             sales: result.sales
//           },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         )
//         console.log('response: ',response)
//       } catch (error) {
//         console.log(`Error at file upload : ${error.message}`)
//       }

//       try {
//         var response = await axios.post(
//           `http://localhost:8000/dashboard`,
//           {
//             category : result.category,
//             region: result.region,
//             sales: result.sales
//           },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         )
//         console.log('response: ',response)
//       } catch (error) {
//         console.log(`Error at sending sales data to dashboard : ${error.message}`)
//       }

//       onFileUpload(result)
//       onClose()
//       toast.success('File added!', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 2000,
//       })
//     }
//     reader.readAsArrayBuffer(file)
//   }

//   const handleDragOver = (event) => {
//     event.preventDefault()
//   }

//   const handleDrop = (event) => {
//     event.preventDefault()
//     const file = event.dataTransfer.files[0]
//     const fileExtension = file.name.split('.').pop().toLowerCase()

//     if (supportedExtensions.includes(fileExtension)) {
//       // Handle supported file types (Excel, CSV)
//       handleFileChange(file)
//     } else {
//       // Handle unsupported file types
//       toast.error(`Unsupported file type: .${fileExtension}`, {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 2000,
//       })
//     }
//   }

//   return (
//     <div className='file-upload-modal'>
//       <div className='file-upload-modal-content'>
//         <span className='close-button' onClick={onClose}>
//           &times;
//         </span>
//         <div className='file-upload-container'>
//           <div
//             className='drag-drop-area'
//             onDragOver={handleDragOver}
//             onDrop={handleDrop}
//             onClick={handleAddFileClick}
//           >
//             <div className='drag-drop-message'>
//               <p>Drag and drop file here</p>
//             </div>
//             <div className='file-extension-info'>
//               <p>Supported file extensions:</p>
//               <p>
//                 {supportedExtensions
//                   .map((extension) => `.${extension}`)
//                   .join(', ')}
//               </p>
//             </div>
//           </div>
//           <div className='file-upload-options'>
//             <button onClick={handleAddFileClick}>Add File</button>
//             <input
//               type='file'
//               ref={fileInputRef}
//               style={{ display: 'none' }}
//               accept={acceptExtensions}
//               onChange={(e) => handleFileChange(e.target.files[0])}
//             />
//             <button onClick={onClose}>Close</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default FileUploadModal

import React, { useRef } from 'react'

import './FileUploadModal.css'

import * as XLSX from 'xlsx'

import { toast } from 'react-toastify'

import axios from 'axios'

const FileUploadModal = ({ onClose, onFileUpload }) => {
  const fileInputRef = useRef(null)

  const supportedExtensions = ['xlsx', 'xls', 'csv']

  const acceptExtensions = supportedExtensions

    .map((extension) => `.${extension}`)

    .join(',')

  const handleAddFileClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]

    const fileExtension = file.name.split('.').pop().toLowerCase()

    if (supportedExtensions.includes(fileExtension)) {
      const reader = new FileReader()

      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result)

        const workbook = XLSX.read(data, { type: 'array' })

        const worksheet = workbook.Sheets[workbook.SheetNames[0]]

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        // Extract the sales values from the jsonData array

        const sales = jsonData.slice(2).map((row) => row[0])

        // Create the resulting object

        const fileName = file.name.split('.')[0]

        const result = {
          category: jsonData[0][0],

          region: jsonData[1][0],

          productName: fileName, // Include the file name

          sales: sales.map(Number),
        }

        try {
          var response = await axios.post(
            `http://localhost:5000/save`,

            {
              category: result.category,

              region: result.region,

              productName: result.productName,

              sales: result.sales,
            },

            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )

          console.log('response: ', response)
        } catch (error) {
          console.log(`Error at file upload : ${error.message}`)
        }

        try {
          var response = await axios.post(
            `http://localhost:8000/dashboard`,

            {
              category: result.category,

              region: result.region,

              sales: result.sales,
            },

            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )

          console.log('response: ', response)
        } catch (error) {
          console.log(
            `Error at sending sales data to dashboard : ${error.message}`
          )
        }

        onFileUpload(result)

        onClose()

        toast.success('File uploaded successfully', {
          position: toast.POSITION.TOP_RIGHT,

          autoClose: 1000,
        })
      }

      reader.readAsArrayBuffer(file)
    } else {
      toast.error(`Unsupported file type: .${fileExtension}`, {
        position: toast.POSITION.TOP_RIGHT,

        autoClose: 2000,
      })
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event) => {
    event.preventDefault()

    const file = event.dataTransfer.files[0]

    const fileExtension = file.name.split('.').pop().toLowerCase()

    if (supportedExtensions.includes(fileExtension)) {
      // Handle supported file types (Excel, CSV)

      handleFileChange(file)
    } else {
      // Handle unsupported file types

      toast.error(`Unsupported file type: .${fileExtension}`, {
        position: toast.POSITION.TOP_RIGHT,

        autoClose: 2000,
      })
    }
  }

  return (
    <div className='file-upload-modal'>
      <div className='file-upload-modal-content'>
        <span className='close-button' onClick={onClose}>
          &times;
        </span>

        <div className='file-upload-container'>
          <div
            className='drag-drop-area'
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleAddFileClick}
          >
            <div className='drag-drop-message'>
              <p>Drag and drop file here</p>
            </div>

            <div className='file-extension-info'>
              <p>Supported file extensions:</p>

              <p>
                {supportedExtensions

                  .map((extension) => `.${extension}`)

                  .join(', ')}
              </p>
            </div>
          </div>

          <div className='file-upload-options'>
            <button
              className='file-upload-button button-add'
              onClick={handleAddFileClick}
            >
              Add File
            </button>
            <input
              type='file'
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept={acceptExtensions}
              onChange={handleFileChange}
            />
            <button
              className='file-upload-button button-close'
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileUploadModal

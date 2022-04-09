import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [count, setCount] = useState(0)
  const [trigger, setTrigger] = useState(0)
  const [indent, setIndent] = useState(0)

  const fetchDataAndCount = async (URLPage, URLPageSize, useIndent) => {
    try {
      const firstCall = await fetch(`https://jsonplaceholder.typicode.com/photos?_page=${URLPage}&_limit=${URLPageSize}`)
      const firstData = await firstCall.json()
      let allData = []
      for (let i = useIndent; i < firstData.length; i++) {
        allData.push(firstData[i])
      }

      if (useIndent) {
        const secondCall = await fetch(`https://jsonplaceholder.typicode.com/photos?_page=${URLPage+1}&_limit=${URLPageSize}`)
        const secondData = await secondCall.json()
        for (let i = 0; i < useIndent; i++) {
          allData.push(secondData[i])
        }
      }
      setData([...data, ...allData])
      setCount(count + firstData.length)

    } catch (error) {
      console.log(error)
    }
  }

  const handleSelectPageSize = (e) => {
    setPageSize(parseInt(e.target.value))
  }

  const handleTrigger = (e) => {
    const nextPage = Math.floor((count + pageSize) / pageSize)
    const indent = count % pageSize
    setPage(nextPage)
    setIndent(indent)
    setTrigger(trigger + 1)
  }

  useEffect(() => {
    fetchDataAndCount(page, pageSize, indent)
  }, [trigger])

  return (
    <div className='container'>
      <div className="header">
        <h1>Fetch Data</h1>
        <p>Current List size: {count}</p>
        <p>Next List: {count}+{pageSize}; next count = {count + pageSize}</p>
        <p>Next page: {(count+pageSize)/pageSize}</p>
      </div>

      <div className="list-container">
        {data.map((item) => (
          <div key={item.id}>{item.id}</div>
        ))}
      </div>

      <div className="selector-container">
        <select defaultValue={pageSize} selected="selected" onChange={handleSelectPageSize}>
          <option value="5">Fetch 5 Image</option>
          <option value="10">Fetch 10 Image</option>
          <option value="30">Fetch 30 Image</option>
        </select>
        <button onClick={handleTrigger}>Test</button>
      </div>
    </div>
  )
}

export default App

import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {

  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
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

  const handleLazyLoad = () => {
    const imageObserver = new IntersectionObserver((images) => images.forEach((image) => {
        if (image.isIntersecting) {
          const img = image.target
          img.src = img.dataset.src
          imageObserver.unobserve(img)
        }
      })
    )
    document.querySelectorAll('.lazy').forEach((elm) => imageObserver.observe(elm))
  }


  useEffect(() => {
    fetchDataAndCount(page, pageSize, indent)
  }, [trigger])
  handleLazyLoad()


  return (
    <div className='container'>
      <div className='header'>
        <div className='info'>
          <h1>Fetch Image</h1>
          <p>Current List size: {count}</p>
        </div>
        <div className='selector-container'>
          <select defaultValue={pageSize} selected='selected' onChange={handleSelectPageSize}>
            <option value='5'>Fetch 5 Image</option>
            <option value='10'>Fetch 10 Image</option>
            <option value='30'>Fetch 30 Image</option>
          </select>
          <button onClick={handleTrigger}>Fetch</button>
        </div>
      </div>

      <div className='list-container'>
        {data.map((item) => (
          <div>
            <div key={item.id} className='image-item'>
              <div className='id'>{item.id}</div>
              <div className='image'>
                <span className="loading">Loading...</span>
                <img className='lazy' data-src={item.url} alt='' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App

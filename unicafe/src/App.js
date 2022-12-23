import { useState } from 'react'

const StatisticLine = ({text, value}) => {
  return (
    <>
      
        <tr>
          <td>{text}</td>
          <td>{value}</td>
        </tr>
      
    </>
  )
}


const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  const avg = (good - bad) / (all)
  const pos = (good / (all)) * 100
  if (good == 0 && neutral == 0 && bad == 0) {
    return <><p>No feedback given</p></>
  }
  return (
    <>
      <table>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={avg} />
        <StatisticLine text="positive" value={pos + " %"} />
      </table> 
    </>
  )
}

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const updateGood = () => setGood(good + 1)
  const updateNeutral = () => setNeutral(neutral + 1)
  const updateBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={updateGood} text="good" />
      <Button onClick={updateNeutral} text="neutral" />
      <Button onClick={updateBad} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App

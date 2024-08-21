import { useState } from 'react';
import './App.css';

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
);

const StatisticsLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad, totalFeedback, averageScore, positivePercentage }) => {
  return (
    <div>
      {totalFeedback === 0 ? (
        <p>No feedback given</p>
      ) : (
        <table>
          <tbody>
            <StatisticsLine text="Good" value={good} />
            <StatisticsLine text="Neutral" value={neutral} />
            <StatisticsLine text="Bad" value={bad} />
            <StatisticsLine text="Total" value={totalFeedback} />
            <StatisticsLine text="Average" value={averageScore.toFixed(1)} />
            <StatisticsLine text="Positive" value={`${positivePercentage.toFixed(1)}%`} />
          </tbody>
        </table>
      )}
    </div>
  );
};

const App = () => {
    
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const increaseGood = () => {
    setGood(good + 1);
    console.log('Good feedback incremented:', good + 1);
  };

  const increaseNeutral = () => {
    setNeutral(neutral + 1);
    console.log('Neutral feedback incremented:', neutral + 1);
  };

  const increaseBad = () => {
    setBad(bad + 1);
    console.log('Bad feedback incremented:', bad + 1);
  };

  const totalFeedback = good + neutral + bad;
  console.log('Total feedback:', totalFeedback);

  const averageScore = totalFeedback ? (good - bad) / totalFeedback : 0;
  console.log('Average score:', averageScore.toFixed(1));

  const positivePercentage = totalFeedback ? (good / totalFeedback) * 100 : 0;
  console.log('Positive feedback percentage:', positivePercentage.toFixed(1) + '%');

  return (
    <div>
      <h2>Give feedback</h2>
      <Button onClick={increaseGood} text="Good" />
      <Button onClick={increaseNeutral} text="Neutral" />
      <Button onClick={increaseBad} text="Bad" />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        totalFeedback={totalFeedback}
        averageScore={averageScore}
        positivePercentage={positivePercentage}
      />
    </div>
  );
};
export default App;
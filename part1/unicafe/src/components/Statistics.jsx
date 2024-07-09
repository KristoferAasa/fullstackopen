import StatisticLine from "./StatisticLine";

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = ((good - bad) / total).toFixed(1);
  const positive = ((good / total) * 100).toFixed(1);

  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive + " %"} />
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;

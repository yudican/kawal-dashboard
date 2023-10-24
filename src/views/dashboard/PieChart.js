import Chart from 'chart.js/auto'
import { Pie } from 'react-chartjs-2'

const PieChart = ({ values, labels }) => {
  // Sample data for the line chart
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ['red', 'blue', 'yellow', 'green', 'purple']
      }
    ]
  }

  // Configuration options for the chart
  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <div style={{ height: 410, width: '100%' }}>
      {/* <h2>Line Chart Example</h2> */}
      <Pie data={data} options={options} />
    </div>
  )
}

export default PieChart

import Chart from 'chart.js/auto'
import { Line } from 'react-chartjs-2'

const LineChart = ({ values, labels, label = 'Data Rumah Yang Sudah di Kunjungi' }) => {
  console.log(values, labels)
  // Sample data for the line chart
  const data = {
    labels,
    datasets: [
      {
        label,
        data: values, // Replace with your data
        fill: false, // Fill area under the line
        borderColor: 'rgba(75, 192, 192, 1)' // Line color
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
    <div>
      {/* <h2>Line Chart Example</h2> */}
      <Line data={data} options={options} />
    </div>
  )
}

export default LineChart

import Chart from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'

const BarChart = ({ labels, values, title, label = 'Data Rumah Yang Sudah di Kunjungi' }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.4)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
        data: values
      }
    ]
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <div>
      {title && <p>{title}</p>}
      <Bar data={data} options={options} />
    </div>
  )
}

export default BarChart

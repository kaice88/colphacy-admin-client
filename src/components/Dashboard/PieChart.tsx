import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      display: true,
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    title: {
      display: true,
      text: 'Số lượng đơn hàng theo trạng thái',
    },
  },
};
export default function PieChart({ pieData }) {
  const data = {
    labels: [
      'Chờ xác nhận',
      'Chờ vận chuyển',
      'Đang giao',
      'Đã giao',
      'Đã hủy',
    ],
    datasets: [
      {
        label: 'Số lượng',
        data: [
          pieData.PENDING,
          pieData.CONFIRMED,
          pieData.SHIPPING,
          pieData.DELIVERED,
          pieData.CANCELLED,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  return <Pie data={data} options={options} />;
}

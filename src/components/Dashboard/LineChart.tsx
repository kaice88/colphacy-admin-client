import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
// import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Doanh thu và tiền nhập nhập hàng',
    },
    // scales: {
    //   x: {
    //     display: true,
    //     title: {
    //       display: true,
    //       text: 'Month',
    //       color: '#911',
    //       font: {
    //         family: 'Comic Sans MS',
    //         size: 20,
    //         weight: 'bold',
    //         lineHeight: 1.2,
    //       },
    //       //   padding: { top: 20, left: 0, right: 0, bottom: 0 },
    //     },
    //   },
    //   y: {
    //     display: true,
    //     title: {
    //       display: true,
    //       text: 'Value',
    //       color: '#191',
    //       font: {
    //         family: 'Times',
    //         size: 20,
    //         style: 'normal',
    //         lineHeight: 1.2,
    //       },
    //       padding: { top: 0, left: 0, right: 0, bottom: 0 },
    //     },
    //   },
    // },
  },
};

const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export default function LineChart({ lineData }) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Doanh thu',
        data: lineData.map((item) => item.revenue),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 1,
      },
      {
        label: 'Nhập hàng',
        data: lineData.map((item) => item.importAmount),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderWidth: 1,
      },
    ],
  };
  return <Line options={options} data={data}></Line>;
}

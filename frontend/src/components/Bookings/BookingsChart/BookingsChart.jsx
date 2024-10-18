import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import './BookingsChart.css'; // Import the CSS file

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BOOKINGS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 100,
  },
  Normal: {
    min: 100,
    max: 200,
  },
  Expensive: {
    min: 200,
    max: 10000000,
  },
};

const BookingsChart = (props) => {
  const chartData = {
    labels: [],
    datasets: [
      {
        label: "Number of Bookings",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        data: [],
      },
    ],
  };

  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.game.price > BOOKINGS_BUCKETS[bucket].min &&
        current.game.price < BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);

    chartData.labels.push(bucket);
    chartData.datasets[0].data.push(filteredBookingsCount);
  }

  return (
    <div className="chart-container">
      <Bar data={chartData} />
    </div>
  );
};

export default BookingsChart;

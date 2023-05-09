import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
Chart.register(CategoryScale);
const Histogram = ({ ratings }) => {
    const data = {
      labels: ['0-1', '1-2', '2-3' , '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10'],
      datasets: [
        {
          label: 'IMDb Ratings',
          backgroundColor: '#007bff',
          borderColor: '#007bff',
          borderWidth: 1,
          hoverBackgroundColor: '#007bff',
          hoverBorderColor: '#007bff',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // initialize all counts to 0
        },
      ],
    };
  
    // bin the ratings and count the number of ratings in each bin
    ratings.forEach(rating => {
        if (rating >= 0 && rating < 1) {
            data.datasets[0].data[0]++;
        } else if (rating >= 1 && rating < 2) {
            data.datasets[0].data[1]++;
        } else if (rating >= 2 && rating < 3) {
            data.datasets[0].data[2]++;
        } else if (rating >= 3 && rating < 4) {
            data.datasets[0].data[3]++;
        } else if (rating >= 4 && rating < 5) {
            data.datasets[0].data[4]++;
        } else if (rating >= 5 && rating < 6) {
            data.datasets[0].data[5]++;
        } else if (rating >= 6 && rating < 7) {
            data.datasets[0].data[6]++;
        } else if (rating >= 7 && rating < 8) {
            data.datasets[0].data[7]++;
        } else if (rating >= 8 && rating < 9) {
            data.datasets[0].data[8]++;
        } else if (rating >= 9 && rating <= 10) {
            data.datasets[0].data[9]++;
        }
    });
  
    const options = {
      responsive: true,
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    };
  
    return (
      <div>
        <h2>IMDb Ratings Chart</h2>
        <Bar data={data} options={options} />
      </div>
    );
  };
  
  export default Histogram;
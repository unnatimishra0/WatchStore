import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Container, Card, Spinner } from 'react-bootstrap';
import 'chartjs-plugin-datalabels'; // For data labels

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// For Chart.js 3D effect
ChartJS.defaults.plugins.tooltip = {
  backgroundColor: '#333',
  titleColor: '#fff',
  bodyColor: '#fff',
};

const Analytics = () => {
  const [pieChartData, setPieChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPieChartData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('/pieChart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setPieChartData({
          labels: ['In Stock', 'Out of Stock'],
          datasets: [
            {
              data: data,
              backgroundColor: ['#36A2EB', '#FF6384'],
              borderColor: '#fff',
              borderWidth: 2,
              hoverOffset: 4,
              shadowBlur: 10, // 3D shadow effect
              shadowColor: 'rgba(0, 0, 0, 0.3)', // 3D shadow effect color
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPieChartData();
  }, []);

  return (
    <Container className="my-4">
      <Card className="shadow-lg border-0 rounded-3">
        <Card.Body>
          <Card.Title className="text-center mb-4">Product Stock Analytics</Card.Title>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading chart data...</p>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <div className="chart-container" style={{ width: '100%', maxWidth: '600px', height: '400px' }}>
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          font: {
                            size: 16,
                          },
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value}`;
                          },
                        },
                      },
                      datalabels: {
                        display: true,
                        color: '#fff',
                        anchor: 'end',
                        align: 'top',
                        formatter: (value) => `${value}%`,
                      },
                    },
                    layout: {
                      padding: 20,
                    },
                    animation: {
                      animateRotate: true,
                      animateScale: true,
                    },
                  }}
                />
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Analytics;

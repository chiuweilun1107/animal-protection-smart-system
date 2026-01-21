document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Chart.js Default Config for White Dashboard Charts
    Chart.defaults.color = 'rgba(255, 255, 255, 0.8)';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // Chart 1: Line Chart (Today's Reports)
    const ctx1 = document.getElementById('chart1').getContext('2d');
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'],
            datasets: [{
                data: [15, 28, 42, 35, 50, 48, 62],
                borderColor: '#ffffff',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    });

    // Chart 2: Bar Chart (Monthly Resolved)
    const ctx2 = document.getElementById('chart2').getContext('2d');
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                data: [40, 65, 30, 85, 45, 70, 95],
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: 4,
                barThickness: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    });
});

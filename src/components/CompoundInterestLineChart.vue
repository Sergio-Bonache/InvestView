<template>
    <canvas ref="lineRef"></canvas>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import {
    Chart,
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';

// Registramos los controladores y elementos necesarios
Chart.register(
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

// Props: etiquetas (labels) y dos series de datos
const props = defineProps({
    labels: { type: Array, required: true },
    aportaciones: { type: Array, required: true },
    totalConInteres: { type: Array, required: true }
});

const lineRef = ref(null);
let chartInstance = null;

const renderChart = () => {
    if (!lineRef.value) return;
    const ctx = lineRef.value.getContext('2d');
    if (!ctx) return;

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: props.labels,
            datasets: [
                {
                    label: 'Total Aportado',
                    data: props.aportaciones,
                    fill: false,
                    tension: 0.3,
                    borderColor: '#3b82f6',
                    backgroundColor: 'transparent',
                    pointRadius: 4
                },
                {
                    label: 'Aportado + Intereses',
                    data: props.totalConInteres,
                    fill: false,
                    tension: 0.3,
                    borderColor: '#ED6A5A',
                    backgroundColor: 'transparent',
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'Años' }
                },
                y: {
                    title: { display: true, text: 'Cantidad (€)' },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
};

onMounted(renderChart);
watch(
    () => [props.labels, props.aportaciones, props.totalConInteres],
    renderChart
);
</script>

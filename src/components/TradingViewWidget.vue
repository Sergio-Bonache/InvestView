<script setup>
import { onMounted, watch, ref } from "vue";

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
});

const widgetContainerId = `tv-widget-${Math.random().toString(36).substring(2, 10)}`;

onMounted(() => {
  loadWidget();
});

function loadWidget() {
  const container = document.getElementById(widgetContainerId);
  if (!container) return;

  // Limpiar contenido anterior (en caso de reusos)
  container.innerHTML = `
    <div class="tradingview-widget-container__widget"></div>
    <div class="tradingview-widget-copyright">
      <a href="https://es.tradingview.com/" rel="noopener nofollow" target="_blank">
        
      </a>
    </div>
  `;

  const script = document.createElement("script");
  script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
  script.async = true;
  script.innerHTML = JSON.stringify({
    symbols: [[props.symbol]],
    chartOnly: false,
    width: "100%",
    height: 400,
    locale: "es",
    colorTheme: "light",
    autosize: false,
    showVolume: false,
    showMA: false,
    hideDateRanges: false,
    hideMarketStatus: true,
    hideSymbolLogo: true,
    scalePosition: "right",
    scaleMode: "Normal",
    fontFamily: "Trebuchet MS, sans-serif",
    fontSize: "15",
    noTimeScale: false,
    valuesTracking: "1",
    changeMode: "price-and-percent",
    chartType: "area",
    maLineColor: "#2962FF",
    maLineWidth: 1,
    maLength: 9,
    headerFontSize: "large",
    lineWidth: 2,
    lineType: 1,
    dateRanges: [
      "1d|1",
      "1m|30",
      "3m|60",
      "12m|1D",
      "60m|1W",
      "all|1M",
    ],
  });

  container.querySelector(".tradingview-widget-container__widget")?.appendChild(script);
}
</script>

<template>
  <div :id="widgetContainerId" class="h-[400px]"></div>
</template>

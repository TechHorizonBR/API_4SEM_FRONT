<template>
    <div class="map-wrap">
        <div class="map" ref="mapContainer">
            <div id="buttonConfig">
                <LightDarkToggle />
                <button @click="adicionarGeoJson" class="buttonConfig">
                    Add rota
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { Map, MapStyle, Marker, config } from "@maptiler/sdk";
import { shallowRef, onMounted, onUnmounted, markRaw, watch } from "vue";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import LightDarkToggle from "./LightDarkToggle.vue";
import axios from "axios";
import { useMapModeStore } from "@/stores/useMapMode";

const mapContainer = shallowRef(null);
const map = shallowRef(null);
const mapModeStore = useMapModeStore();
let dados;

onMounted(() => {
    config.apiKey = "tF1lf7jSig6Ou8IuaLtw";
    inicializarMapa();
    
    (async () => {
        let allPoints = await getPontos();
        if (allPoints) {
            dados = allPoints
            plotPontos(dados);
            // plotWay(allPoints);
        }
    })();
});


onUnmounted(() => {
    if (map.value) {
        map.value.remove();
    }
});

function inicializarMapa() {
    const initialState = { lng: -45.79513, lat: -23.162272, zoom: 15 };

    map.value = markRaw(
        new Map({
            container: mapContainer.value,
            style: mapModeStore.isDarkMode
                ? MapStyle.STREETS.DARK
                : MapStyle.STREETS,
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom,
        })
    );
}

async function getPontos() {
    try {
        // Link mockado, corrigir quando endpoint estiver pronto
        const req = await axios.get(`https://pontos.free.beeceptor.com`);
        if (req) {
            return req.data.points;
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function plotPontos(allPoints) {
    for (let i = 0; i < allPoints.length; i++) {
        if(i == 0 || i == allPoints.length -1){
            let el = document.createElement("div");
            let img = document.createElement("img");
            let son = document.createElement("div");
    
            son.textContent = `Long: ${allPoints[i].lng}, Lat: ${allPoints[i].lat}`;
            son.style.backgroundColor = "#FFF";
            son.style.display = "block";
            son.style.opacity = "0";
            son.style.width = "max-content";
            son.style.position = "absolute";
            son.style.bottom = "25px";
            son.style.left = "50%";
            son.style.zIndex = "1";
            son.style.transform = "translate(-50%, -50%)";
            son.style.padding = "5px";
            son.style.borderRadius = "10px";
            son.style.border = "1px solid black";
            son.style.transition = "opacity 0.3s ease-in-out";
    
            img.src = `${i == 0 ? "start" : "finish"}.png`;
            img.style.width = `25px`;
            img.style.height = `25px`;
            img.style.filter = "drop-shadow(0px 0px 2px #000000)";
    
            el.appendChild(img);
            el.appendChild(son);
    
            el.addEventListener("mouseover", () => {
                son.style.opacity = "1";
            });
    
            el.addEventListener("mouseout", () => {
                son.style.opacity = "0";
            });
    
            new Marker({ element: el })
                .setLngLat([allPoints[i].lng, allPoints[i].lat])
                .addTo(map.value);
        }
    }
}

function plotWay(allPoints) {
    
}

function actualLocation(allPoints, count = 1) {
    if (count === allPoints.length - 1) return;
    let el = document.createElement("div");
    let img = document.createElement("img");
    let son = document.createElement("div");

    son.textContent = `Long: ${allPoints[count].lng}, Lat: ${allPoints[count].lat}`;
    son.style.backgroundColor = "#FFF";
    son.style.display = "block";
    son.style.opacity = "0";
    son.style.width = "max-content";
    son.style.position = "absolute";
    son.style.bottom = "25px";
    son.style.left = "50%";
    son.style.zIndex = "1";
    son.style.transform = "translate(-50%, -50%)";
    son.style.padding = "5px";
    son.style.borderRadius = "10px";
    son.style.border = "1px solid black";
    son.style.transition = "opacity 0.3s ease-in-out";

    img.src = `marker_0.png`;
    img.style.width = `25px`;
    img.style.height = `25px`;
    img.style.filter = "drop-shadow(0px 0px 2px #000000)";

    el.appendChild(img);
    el.appendChild(son);

    el.addEventListener("mouseover", () => {
        son.style.opacity = "1";
    });

    el.addEventListener("mouseout", () => {
        son.style.opacity = "0";
    });

    const mark = new Marker({ element: el })
        .setLngLat([allPoints[count].lng, allPoints[count].lat])
        .addTo(map.value);

    setTimeout(() => {
        mark.remove();
        actualLocation(allPoints, count + 1);
    }, 100);
}


watch(
    () => mapModeStore.isDarkMode,
    (isDarkMode) => {
        if (map.value) {
            map.value.setStyle(
                isDarkMode ? MapStyle.STREETS.DARK : MapStyle.STREETS
            );
        }
    }
);

async function adicionarGeoJson() {
    if (map.value) {
        try {
            const response = await axios.get(
                "https://pontos.free.beeceptor.com/caminho"
            );
            const geojson = response.data;

            map.value.addSource("gps_tracks", {
                type: "geojson",
                data: geojson,
            });

            map.value.addLayer({
                id: "grand_teton",
                type: "line",
                source: "gps_tracks",
                layout: {},
                paint: {
                    "line-color": "#e11",
                    "line-width": 4,
                },
            });
        } catch (error) {
            console.error("Erro ao carregar o GeoJSON:", error);
        }
        actualLocation(dados);
    }
}
</script>

<style>
.map-wrap {
    position: relative;
}

.map {
    width: 100%;
    height: 100vh;
}

.maplibregl-ctrl-top-right {
    right: 0;
    bottom: 6em !important;
    top: auto !important;
}

.maplibregl-ctrl button .maplibregl-ctrl-icon {
    background-color: #9e73bfd4;
    border-radius: 5px;
}

.mapboxgl-ctrl .mapboxgl-ctrl-icon,
.maplibregl-ctrl .maplibregl-ctrl-icon {
    transition: transform 0.5s ease;
}

.mapboxgl-ctrl .mapboxgl-ctrl-icon:hover,
.maplibregl-ctrl .maplibregl-ctrl-icon:hover {
    filter: none !important;
    transform: scale(1.1);
}

.maplibregl-ctrl-group {
    background: transparent !important;
}

#buttonConfig {
    position: absolute;
    z-index: 2;
    bottom: 20px;
    right: 10px;
    display: inline-flex;
    flex-direction: row-reverse;
    align-items: center;
}
</style>

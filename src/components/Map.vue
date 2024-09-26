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
let geojson;
let mark;

onMounted(() => {
    config.apiKey = "tF1lf7jSig6Ou8IuaLtw";
    inicializarMapa();

    (async () => {
        dados = await getPontos();
        geojson = await getTrack();
        if (dados && geojson) {
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
    const initialState = { lng:  -73.973110, lat: 40.764240, zoom: 15 };

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
        const req = await axios.get(`https://plots.free.beeceptor.com`);
        if (req) {
            return req.data.points;
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function getTrack() {
    try {
        // Link mockado, corrigir quando endpoint estiver pronto
        const req = await axios.get(
            `https://plots.free.beeceptor.com/caminho`
        );
        if (req) {
            return req.data;
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function plotPontos(allPoints) {
    for (let i = 0; i < allPoints.length; i++) {
        if (i == 0 || i == allPoints.length - 1) {
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

function plotWay(allPoints) {}

function actualLocation(allPoints, data, count = 0) {
    if (count === allPoints.length){
        return;
    }

    if(count + 1 === allPoints.length - 1){
        
    }
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

    if (count + 1 === allPoints.length) {
        mark = new Marker({ element: el })
            .setLngLat([allPoints[count].lng, allPoints[count].lat]);
    } else {
            mark = new Marker({ element: el })
        .setLngLat([allPoints[count].lng, allPoints[count].lat])
        .addTo(map.value);
    }

    map.value.addSource(`gps_track${count}`, {
        type: "geojson",
        data: data,
    });

    map.value.addLayer({
        id: `grand_teton${count}`,
        type: "line",
        source: `gps_track${count}`,
        layout: {},
        paint: {
            "line-color": "#e11",
            "line-width": 3,
        },
    });

    setTimeout(() => {
        mark.remove();
        data.features[0].geometry.coordinates.push(geojson.features[0].geometry.coordinates[count + 1]);
        actualLocation(allPoints, data, count + 1);
    }, 1000);
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
        let newgeo = JSON.parse(JSON.stringify(geojson));
        newgeo.features[0].geometry.coordinates =
            newgeo.features[0].geometry.coordinates.slice(0, 1);
        actualLocation(dados, newgeo);
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

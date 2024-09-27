<template>
    <div class="map-wrap">
        <div class="map" ref="mapContainer">
            <div id="buttonConfig">
                <LightDarkToggle />
                <button @click="adicionarGeoJson" class="buttonConfig">
                    Add rota
                </button>
            </div>

            <Nav @toggleFilter="toggleFilter" />

            <Filter
                @search="handleSearch"
                v-if="showFilter"
                :isDarkMode="mapModeStore.isDarkMode"
            />
        </div>
    </div>
</template>
<script setup>
import { Map, MapStyle, config, Marker } from "@maptiler/sdk";
import { shallowRef, onMounted, onUnmounted, markRaw, watch } from "vue";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import LightDarkToggle from "./LightDarkToggle.vue";
import Filter from "./Filter.vue";
import RegistrosService from "../services/registros"
import Nav from "./Nav.vue";

import { useMapModeStore } from "@/stores/useMapMode";

const mapContainer = shallowRef(null);
const map = shallowRef(null);
const mapModeStore = useMapModeStore();
let dados;
let geojson = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: [],
            },
            id: "e4ed0594-6428-4d2b-9634-975b1055ae79",
            properties: {},
        },
    ],
};
let mark;
let places;
const showFilter = shallowRef(true);

onMounted(() => {
    config.apiKey = "tF1lf7jSig6Ou8IuaLtw";
    inicializarMapa();
});

const toggleFilter = () => {
    showFilter.value = !showFilter.value;
};

const handleSearch = (searchParams) => {
    getPoints(searchParams.userCode);
};

const getPoints = async (id) => {
    try {
        const req = await RegistrosService.getRegistros(id);
        if(req){
            transformData(req);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

function transformData(data) {
    if (data) {
        dados = data;
        geojson.features[0].geometry.coordinates = dados.map((point) => [
            point.longitude,
            point.latitude,
        ]);
        console.log(geojson);
        plotPontos(dados);
    }
}

onUnmounted(() => {
    if (map.value) {
        map.value.remove();
    }
});

function inicializarMapa() {
    const initialState = { lng: -60.6714, lat: 2.81954, zoom: 18 };

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

async function plotPontos(allPoints) {
    const fin = allPoints.length - 1;
    console.log(allPoints[fin].latitude)
    
    let el_start = createMarkerElement(
        allPoints[0].longitude,
        allPoints[0].latitude,
        "start.png"
    );

    let el_finish = createMarkerElement(
        allPoints[fin].longitude,
        allPoints[fin].latitude,
        "finish.png"
    );

    new Marker({ element: el_start })
        .setLngLat([allPoints[0].longitude, allPoints[0].latitude])
        .addTo(map.value);

    new Marker({ element: el_finish })
        .setLngLat([allPoints[fin].longitude, allPoints[fin].latitude])
        .addTo(map.value);

    adicionarGeoJson();
}

function createMarkerElement(lng, lat, imgSrc) {
    let el = document.createElement("div");
    let img = document.createElement("img");
    let son = document.createElement("div");

    son.textContent = `Long: ${lng}, Lat: ${lat}`;
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

    img.src = imgSrc;
    img.style.width = `25px`;
    img.style.height = `25px`;
    img.style.filter = "drop-shadow(0px 0px 2px #000000)";

    el.appendChild(img);
    el.appendChild(son);

    el.addEventListener("mouseover", () => (son.style.opacity = "1"));
    el.addEventListener("mouseout", () => (son.style.opacity = "0"));

    return el;
}

function actualLocation(allPoints, data, count = 0) {
    if (count === allPoints.length) {
        return;
    }

    let el = createMarkerElement(
        allPoints[count].longitude,
        allPoints[count].latitude,
        "marker_0.png"
    );

    if (count + 1 === allPoints.length) {
        mark = new Marker({ element: el }).setLngLat([
            allPoints[count].longitude,
            allPoints[count].latitude,
        ]);
    } else {
        mark = new Marker({ element: el })
            .setLngLat([allPoints[count].longitude, allPoints[count].latitude])
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
        console.log(allPoints[count + 1]);
        data.features[0].geometry.coordinates.push(allPoints[count + 1]);
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

function adicionarGeoJson() {
    if (map.value) {
        geojson.features[0].geometry.coordinates =
            geojson.features[0].geometry.coordinates.slice(0, 1);

        actualLocation(dados, geojson);
    }
}
</script>

<style scoped>
.map-wrap {
    position: relative;
}

.map {
    width: 100%;
    height: 100vh;
}

.nav-container {
    position: absolute;
    bottom: 2;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1500;
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

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

onMounted(() => {
    config.apiKey = "tF1lf7jSig6Ou8IuaLtw";
    inicializarMapa();
});

const getPoints = async() => {
    try{
        // const req = getPontos();
        // if(req){
        //     transformData(req.data);
        // }
    }catch(error){
        console.error("Error:", error)
    }
}

function transformData(data) {
    if (data) {
        dados = data;
        geojson.features[0].geometry.coordinates = dados.points.map((point) => [
            point.lng,
            point.lat,
        ]);
        plotPontos(dados);
    }
}

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
        allPoints[count].lng,
        allPoints[count.lat],
        "marker_0.png"
    );

    if (count + 1 === allPoints.length) {
        mark = new Marker({ element: el }).setLngLat([
            allPoints[count].lng,
            allPoints[count].lat,
        ]);
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
        data.features[0].geometry.coordinates.push(places[count + 1]);
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
        geojson.features[0].geometry.coordinates =
            geojson.features[0].geometry.coordinates.slice(0, 1);

        actualLocation(dados, geojson);
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

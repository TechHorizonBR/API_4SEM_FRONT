Map.vue

<template>
    <div :class="{'dark-controls': mapModeStore.isDarkMode, 'light-controls': !mapModeStore.isDarkMode}" class="map-wrap">
        <div class="map" ref="mapContainer" >

            <div id="buttonConfig">
                <LightDarkToggle />
                <!--<button @click="adicionarMarcadores" class="buttonConfig">
                    Add pontos
                </button>-->
            </div>
            <img
                v-if="loading"
                src="/loading.gif"
                id="loading"
                alt="Loading..."
            />

            <Nav @toggleFilter="toggleFilter" :isDark="mapModeStore.isDarkMode" />

            <transition
                name="fade"
                @before-enter="beforeEnter"
                @before-leave="beforeLeave"
            >
                <Filter
                    v-show="showFilter"
                    @search="handleSearch"
                    :isDark="mapModeStore.isDarkMode"
                />
            </transition>
        </div>
    </div>
</template>

<script setup>
import { Map, MapStyle, config, Marker } from "@maptiler/sdk";
import { shallowRef, onMounted, onUnmounted, markRaw, watch } from "vue";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import LightDarkToggle from "./LightDarkToggle.vue";
import Filter from "./Filter.vue";
import RegistrosService from "../services/registros";
import Nav from "./Nav.vue";
import { useMapModeStore } from "@/stores/useMapMode";

const mapContainer = shallowRef(null);
const map = shallowRef(null);
const mapModeStore = useMapModeStore();
let dados;
const all_markers = shallowRef([]);
const loading = shallowRef(false);
const showFilter = shallowRef(true);

onMounted(() => {
    config.apiKey = "tF1lf7jSig6Ou8IuaLtw";
    inicializarMapa();

    const controlElements = document.getElementsByClassName('maplibregl-ctrl-top-right');
    for (let element of controlElements) {
        element.style.top = 'auto';
        element.style.bottom = '80px';
        element.style.right = '10px';
    }
});

const toggleFilter = () => {
    showFilter.value = !showFilter.value;
};

const changeLoading = () => {
    loading.value = !loading.value;
};

const handleSearch = (searchParams) => {
    all_markers.value.forEach((marker) => marker.remove());
    all_markers.value = [];
    changeLoading();
    getPoints(searchParams.userCode, searchParams.dataInicio, searchParams.dataFim);
};

const getPoints = async (id, dataInicio, dataFim) => {
    try {
        const firstReq = await RegistrosService.getRegistros(id, 0, dataInicio, dataFim);
        
        if (firstReq) {
            const allPages = firstReq.totalPages;
            transformData(firstReq.registers, 0, allPages);
            for(let page = 1; page <= allPages; page++){
                const req = await RegistrosService.getRegistros(id, page, dataInicio, dataFim);
                if(req){
                    transformData(req.registers, page, allPages);
                }
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

function transformData(data, page, totalpages) {
    if (data) {
        dados = data;
        plotPontos(dados, page, totalpages);
    }
}

onUnmounted(() => {
    if (map.value) {
        map.value.remove();
    }
});

function inicializarMapa() {
    const initialState = { lng: -60.6714, lat: 2.81954, zoom: 1 };

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

async function plotPontos(allPoints, page, totalpages) {
    const fin = allPoints.length - 1;

    // Criar e adicionar marcadores para o ponto inicial e final
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

    if(page === 1){
        let startMark = new Marker({ element: el_start })
            .setLngLat([allPoints[0].longitude, allPoints[0].latitude])
            .addTo(map.value);
        all_markers.value.push(startMark);
    }

    if(page === totalpages - 1){
        let finishMark = new Marker({ element: el_finish })
            .setLngLat([allPoints[fin].longitude, allPoints[fin].latitude])
            .addTo(map.value);
        all_markers.value.push(finishMark);
        changeLoading();
    }

    allPoints.forEach((point, index) => {
            let el_point = createMarkerElement(
                point.longitude,
                point.latitude,
                "pin.png"
            );
            let defaultMark = new Marker({ element: el_point })
                .setLngLat([point.longitude, point.latitude])
                .addTo(map.value);
            all_markers.value.push(defaultMark);
    });
}

// Função para criar um elemento de marcador personalizado
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
    img.style.filter = "drop-shadow(0px 0px 2px #fff)";

    el.appendChild(img);
    el.appendChild(son);

    el.addEventListener("mouseover", () => (son.style.opacity = "1"));
    el.addEventListener("mouseout", () => (son.style.opacity = "0"));

    return el;
}

watch(
    () => mapModeStore.isDarkMode,
    (isDarkMode) => {
        if (map.value) {
            map.value.setStyle(
                isDarkMode ? MapStyle.STREETS.DARK : MapStyle.STREETS
            );
            map.value.on('load', () => {
                const attributionControl = document.querySelector('.maplibregl-ctrl-attrib a');
                if (attributionControl) {
                    attributionControl.style.display = 'none';
                }
            });

            const controlElements = document.getElementsByClassName('maplibregl-ctrl');
            for (let element of controlElements) {
                if (isDarkMode) {
                    element.style.backgroundColor = '#0a0012e3';
                    element.style.color = '#fff'
                } else {
                    element.style.backgroundColor = '#fff';
                    element.style.color = '#000'
                }
            }

            const controlIcons = document.getElementsByClassName('maplibregl-ctrl-icon');
            for (let icon of controlIcons){
                if(isDarkMode){
                    icon.style.filter = 'invert(100%)'
                }else{
                    icon.style.filter = 'none'
                }
            }
        }
    }
);

function adicionarMarcadores() {
    if (dados) {
        plotPontos(dados);
    }
}
</script>

<style scoped>
.maplibregl-ctrl-attrib a {
    display: none;
}
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

#buttonConfig {
    position: absolute;
    z-index: 2;
    bottom: 20px;
    right: 10px;
    display: inline-flex;
    flex-direction: row-reverse;
    align-items: center;
}

#loading {
    position: absolute;
    z-index: 1600;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.maplibregl-ctrl-attrib a {
    display: none;
}



</style>

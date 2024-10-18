<template>
    <div :class="{
        'dark-controls': mapModeStore.isDarkMode,
        'light-controls': !mapModeStore.isDarkMode,
    }" class="map-wrap">
        <div class="map" ref="mapContainer">
            <div id="buttonConfig">
                <LightDarkToggle />
            </div>
            <img v-if="loading" src="/loading.gif" id="loading" alt="Loading..." />

            <Nav @toggleFilter="toggleFilter" :isDark="mapModeStore.isDarkMode" />

            <transition name="fade" @before-enter="beforeEnter" @before-leave="beforeLeave">
                <Filter v-show="showFilter" @search="handleSearch" @removeUser="handleDelete"
                    :isDark="mapModeStore.isDarkMode" />
            </transition>
        </div>
    </div>
</template>

<script setup>
import { Map, MapStyle, config, Marker } from "@maptiler/sdk";
import { shallowRef, onMounted, onUnmounted, markRaw, watch, ref } from "vue";
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
const actualUser = ref(0);

onMounted(() => {
    config.apiKey = "tF1lf7jSig6Ou8IuaLtw";
    inicializarMapa();

    const controlElements = document.getElementsByClassName(
        "maplibregl-ctrl-top-right",
    );
    for (let element of controlElements) {
        element.style.top = "auto";
        element.style.bottom = "80px";
        element.style.right = "10px";
    }
});

const toggleFilter = () => {
    showFilter.value = !showFilter.value;
};

const changeLoading = () => {
    loading.value = !loading.value;
};

const handleSearch = (searchParams) => {
    changeLoading();
    getPoints(searchParams);
};

const handleDelete = (deleteParams) => {
    all_markers.value[deleteParams].forEach((marker) => marker.remove());
    all_markers.value.splice(deleteParams, 1);

    if (actualUser.value > deleteParams) {
        actualUser.value--;
    } else if (actualUser.value === deleteParams) {
        actualUser.value = Math.max(0, actualUser.value - 1);
    }

    console.log(`Usuário no índice ${deleteParams} deletado.`);
};


const getPoints = async (searchParams) => {
    try {
        const firstReq = await RegistrosService.getRegistros(searchParams.userCode, 0, searchParams.dataInicio, searchParams.dataFim);

        if (firstReq) {
            const allPages = firstReq.totalPages;
            transformData(firstReq.registers, 0, allPages, searchParams);
            map.value.fitBounds([
                [firstReq.maxMinCoordinates.minLongitude - 1, firstReq.maxMinCoordinates.minLatitude - 1],
                [firstReq.maxMinCoordinates.maxLongitude + 1, firstReq.maxMinCoordinates.maxLatitude + 1]
            ]);

            for (let page = 1; page <= allPages; page++) {
                const req = await RegistrosService.getRegistros(searchParams.userCode, page, searchParams.dataInicio, searchParams.dataFim);

                if (req) {
                    transformData(req.registers, page, allPages, searchParams);
                }

            }

        }


    } catch (error) {
        console.error("Error:", error);
    }
};

function transformData(data, page, totalpages, elementData) {
    if (data) {
        dados = data;
        plotPontos(dados, page, totalpages, elementData);
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
            style: mapModeStore.isDarkMode ? MapStyle.STREETS.DARK : MapStyle.STREETS,
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom,
        }),
    );
}

async function plotPontos(allPoints, page, totalpages, elementData) {
    if (map.value.getLayer("route")) {
        map.value.removeLayer("route");
    }
    if (map.value.getSource("route")) {
        map.value.removeSource("route");
    }

    const coordinates = allPoints.map((point) => [
        point.longitude,
        point.latitude,
    ]);

    console.log("COORDINATES:", coordinates)

    //GEOJSON
    map.value.addSource("route", {
        type: "geojson",
        data: {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: coordinates,
            },
        },
    });

    // LINHA DA ROTA
    map.value.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
            "line-join": "round",
            "line-cap": "round",
        },
        paint: {
            "line-color": "#0074D9",
            "line-width": 4,
            "line-dasharray": [5, 5],
        },
    });

    if (!all_markers.value[actualUser.value]) {
        all_markers.value[actualUser.value] = [];
    }
    const fin = allPoints.length - 1;
    const [firstName, secondName] = elementData.fullName.split(' ');
    const iniciais = firstName[0] + secondName[0];

    let el_start = createMarkerElement(
        elementData.fullName,
        createPin(elementData.cicleColor, "START")
    );

    let el_finish = createMarkerElement(
        elementData.fullName,
        createPin(elementData.cicleColor, "FINISH")
    );

    allPoints.forEach((point, index) => {
        let el_point = createMarkerElement(
            elementData.fullName,
            createPin(elementData.cicleColor, iniciais)
        );
        const defaultMark = new Marker({ element: el_point })
            .setLngLat([point.longitude, point.latitude])
            .addTo(map.value);
        all_markers.value[actualUser.value].push(defaultMark);
    });

    if (page === 0) {
        let startMark = new Marker({ element: el_start })
            .setLngLat([allPoints[0].longitude, allPoints[0].latitude])
            .addTo(map.value);
        all_markers.value[actualUser.value].push(startMark);
    }
    // Se tiver ponto desenha a linha se n tiver mantem o mapa limpo
    if (!allPoints || allPoints.length === 0) {
        console.log("Nenhum ponto disponível para este usuário.");
        return;
    }

    if (page === totalpages - 1) {
        let finishMark = new Marker({ element: el_finish })
            .setLngLat([allPoints[fin].longitude, allPoints[fin].latitude])
            .addTo(map.value);
        all_markers.value[actualUser.value].push(finishMark);
        actualUser.value++;
        changeLoading();
    }
}


function createPin(color, name) {
    let user_pin = document.createElement("div");

    if (name == "START" || name == "FINISH") {
        // user_pin.style.border = "1px solid black"
        user_pin.style.borderRadius = "3px";
        user_pin.style.height = `10px`;
        user_pin.style.paddingInline = "5px";
        user_pin.style.paddingBlock = "2px";
        user_pin.style.zIndex = "5";
    } else {
        user_pin.style.borderRadius = "50%";
        user_pin.style.height = `25px`;
    }

    user_pin.style.minWidth = `25px`;
    user_pin.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);"
    user_pin.style.backgroundColor = color;
    user_pin.style.color = "black";
    user_pin.style.display = "flex";
    user_pin.style.alignItems = "center";
    user_pin.style.justifyContent = "center";
    user_pin.innerHTML = name;

    return user_pin;
}

function createImg(imgSrc) {
    let img = document.createElement("img");
    img.src = imgSrc;
    img.style.width = `25px`;
    img.style.height = `25px`;
    img.style.filter = "drop-shadow(0px 0px 2px #fff)";

    return img;
}

// Função para criar um elemento de marcador personalizado
function createMarkerElement(name, element) {
    let el = document.createElement("div");

    let son = document.createElement("div");


    son.textContent = `${name}`;
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

    el.appendChild(element);
    el.appendChild(son);

    el.addEventListener("mouseover", () => (son.style.opacity = "1"));
    el.addEventListener("mouseout", () => (son.style.opacity = "0"));

    return el;
}

watch(
    () => mapModeStore.isDarkMode,
    (isDarkMode) => {
        if (map.value) {
            map.value.setStyle(isDarkMode ? MapStyle.STREETS.DARK : MapStyle.STREETS);
            map.value.on("load", () => {
                const attributionControl = document.querySelector(
                    ".maplibregl-ctrl-attrib a",
                );
                if (attributionControl) {
                    attributionControl.style.display = "none";
                }
            });

            const controlElements =
                document.getElementsByClassName("maplibregl-ctrl");
            for (let element of controlElements) {
                if (isDarkMode) {
                    element.style.backgroundColor = "#0a0012e3";
                    element.style.color = "#fff";
                } else {
                    element.style.backgroundColor = "#fff";
                    element.style.color = "#000";
                }
            }

            const controlIcons = document.getElementsByClassName(
                "maplibregl-ctrl-icon",
            );
            for (let icon of controlIcons) {
                if (isDarkMode) {
                    icon.style.filter = "invert(100%)";
                } else {
                    icon.style.filter = "none";
                }
            }
        }
    },
);
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
    pointer-events: none;
}

.maplibregl-ctrl-attrib a {
    display: none;
}
</style>

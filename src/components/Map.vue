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

            <Nav @toggleFilter="toggleFilter" @resetMap="resetMap" :isDark="mapModeStore.isDarkMode" />

            <transition name="fade">
                <Filter
                    v-show="showFilter"
                    @search="handleSearch"
                    @removeUser="handleDelete"
                    :isDark="mapModeStore.isDarkMode"
                    :messageEmpty="messageEmpty"
                    :showMessageEmpty="showMessageEmpty"
                />
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
let allCoords = [];
const all_markers = shallowRef([]);
const loading = shallowRef(false);
const showFilter = shallowRef(false);
const actualUser = ref(0);
const messageEmpty = shallowRef('');
const showMessageEmpty = shallowRef(false);

const initialState = { lng: -60.6714, lat: 2.81954, zoom: 1 };

onMounted(() => {
    config.apiKey = "tF1lf7jSig6Ou8IuaLtw";
    inicializarMapa();

    const controlElements = document.getElementsByClassName("maplibregl-ctrl-top-right");
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

const handleDelete = (deleteParams, idUser) => {
    all_markers.value[deleteParams].forEach((marker) => marker.remove());
    all_markers.value.splice(deleteParams, 1);

    const routeId = `route${idUser}`;

    if (map.value.getLayer(routeId)) {
        map.value.removeLayer(routeId);
    }

    if (map.value.getSource(routeId)) {
        map.value.removeSource(routeId);
    }

    if (actualUser.value > deleteParams) {
        actualUser.value--;
    } else if (actualUser.value === deleteParams) {
        actualUser.value = Math.max(0, actualUser.value - 1);
    }
};

const getPoints = async (searchParams) => {
    try {
        const firstReq = await RegistrosService.getRegistros(searchParams.userCode, 0, searchParams.dataInicio, searchParams.dataFim);

        if (firstReq.registers.length != 0) {
            const allPages = firstReq.totalPages;
            allCoords.push(firstReq.registers);
            transformData(firstReq.registers, 0, allPages, searchParams);
            map.value.fitBounds([
                [firstReq.maxMinCoordinates.minLongitude - 1, firstReq.maxMinCoordinates.minLatitude - 1],
                [firstReq.maxMinCoordinates.maxLongitude + 1, firstReq.maxMinCoordinates.maxLatitude + 1]
            ]);

            for (let page = 1; page <= allPages; page++) {
                const req = await RegistrosService.getRegistros(searchParams.userCode, page, searchParams.dataInicio, searchParams.dataFim);
                if (req) {
                    allCoords.push(req.registers);
                    transformData(req.registers, page, allPages, searchParams);
                }
            }
        } else {
            changeLoading();
            messageEmpty.value = 'This user has not registers in this period.';
            showMessageEmpty.value = true;
            setTimeout(() => {
                showMessageEmpty.value = false;
                messageEmpty.value = '';
            }, 3000);
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
    map.value = markRaw(
        new Map({
            container: mapContainer.value,
            style: mapModeStore.isDarkMode ? MapStyle.STREETS.DARK : MapStyle.STREETS,
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom,
        }),
    );
}

const resetMap = () => {
    if (map.value) {
        map.value.flyTo({
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom,
            essential: true,
        });
    }
};

async function plotPontos(allPoints, page, totalpages, elementData) {
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
            createPin(elementData.cicleColor, iniciais, point.isStopped)
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
    if (!allPoints || allPoints.length === 0) {
        return;
    }

    if (page === totalpages - 1) {
        let finishMark = new Marker({ element: el_finish })
            .setLngLat([allPoints[fin].longitude, allPoints[fin].latitude])
            .addTo(map.value);

        all_markers.value[actualUser.value].push(finishMark);

        let flattenedCoords = allCoords.flat();
        let formattedCoords = flattenedCoords.map(coord => [coord.longitude, coord.latitude]);

        const routeId = `route${elementData.userCode}`;
        map.value.addSource(routeId, {
            type: "geojson",
            data: {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: formattedCoords,
                },
            },
        });

        map.value.addLayer({
            id: routeId,
            type: "line",
            source: routeId,
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": elementData.cicleColor,
                "line-width": 2,
                "line-dasharray": [1, 1],
            },
        });

        formattedCoords = null;
        allCoords = [];

        actualUser.value++;
        changeLoading();
    }
}

function createPin(color, name, isStopped) {
    let user_pin = document.createElement("div");
    user_pin.style.borderRadius = name == "START" || name == "FINISH" ? "3px" : "50%";
    user_pin.style.height = name == "START" || name == "FINISH" ? `10px` : `25px`;
    user_pin.style.minWidth = `25px`;
    user_pin.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);"
    user_pin.style.backgroundColor = color;
    user_pin.style.color = "black";
    user_pin.style.display = "flex";
    user_pin.style.alignItems = "center";
    user_pin.style.justifyContent = "center";
    user_pin.style.fontWeight = "bold";
    user_pin.innerHTML = name;

    if (isStopped) {
        user_pin.style.backgroundColor = "gray";
    }

    return user_pin;
}

function createMarkerElement(fullName, pinElement) {
    let element = document.createElement("div");
    element.className = "marker";
    element.appendChild(pinElement);

    const userName = document.createElement("span");
    userName.innerHTML = fullName;
    element.appendChild(userName);
    
    return element;
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

<template>
    <div
        :class="{
            'dark-controls': mapModeStore.isDarkMode,
            'light-controls': !mapModeStore.isDarkMode,
        }"
        class="map-wrap"
    >
        <div class="map" ref="mapContainer">
            <div id="buttonConfig">
                <LightDarkToggle />
            </div>
            <img
                v-if="loading"
                src="/loading.gif"
                id="loading"
                alt="Loading..."
            />

            <Nav @toggleFilter="toggleFilter" @resetMap="resetMap" @setPolygon="plotPolygon" @deleteArea="deletePolygon" :isDark="mapModeStore.isDarkMode" :map="map" v-if="map" />


            <transition
                name="fade"
            >
                <Filter
                    v-show="showComponentsMode.filter"
                    @search="handleSearch"
                    @removeUser="handleDelete"
                    @send-id="receiveId"
                    :isDark="mapModeStore.isDarkMode"
                    :messageEmpty="messageEmpty"
                    :showMessageEmpty="showMessageEmpty"
                />
            </transition>
        </div>
        <transition
            name="fade">
            <HistoricoLocalicao :isDark="mapModeStore.isDarkMode" :locations="locations" v-if="showComponentsMode.history" :id="idUsuario" />
        </transition>
    </div>
</template>

<script setup lang="ts">
import { Map, MapStyle, config, Marker } from "@maptiler/sdk";
import { shallowRef, onMounted, onUnmounted, markRaw, watch, ref, toRaw } from "vue";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import LightDarkToggle from "./LightDarkToggle.vue";
import Filter from "./Filter.vue";
import RegistrosService from "../services/registros";
import Nav from "./Nav.vue";
import { useMapModeStore } from "@/stores/useMapMode";;
import { type User, type Coordinate, type Location } from '../interfaces/types';
import { selectedUsers } from "@/stores/selectedUsers";
import HistoricoLocalicao from "./HistoricoLocalicao.vue";
import { showComponents } from "@/stores/showComponents";

const showComponentsMode = showComponents();
const mapContainer = shallowRef(null);
const map = shallowRef<Map | null>(null);
const mapModeStore = useMapModeStore();
const allCoords = ref<any[]>([]);
const all_markers = shallowRef<Marker[][]>([]);
const loading = shallowRef(false);
const showFilter = shallowRef(false);
const actualUser = ref(0);
const messageEmpty = shallowRef('');
const showMessageEmpty = shallowRef(false);
const locations = ref<Location[]>([]);
const initialState = { lng: -60.6714, lat: 2.81954, zoom: 1 };
const idUsuario = ref<string>('');

interface SearchParams {
    fullName: string;
    codeDevice: string;
    userCode: number;
    dataInicio: string;
    dataFim: string;
    selectedDate: string;
    cicleColor: string;
}

const receiveId = (idUser : string) => {
    idUsuario.value = idUser;
}
const addSelectedUsersStore = (registers: any, userCode: number, fullName : string) => {
  const selectedUserStore = selectedUsers();
  const user = ref<User>({
    id: userCode,
    coordenadas: [],
    nome: fullName
  });

  for (let register of registers) {
    const coordenada = ref<Coordinate>({
      lat: register.latitude,
      lng: register.longitude,
      data: register.dataHora
    });
    user.value.coordenadas.push(coordenada.value);
  }
  selectedUserStore.addUser(user.value);
};

const addCoordenadasSelectedUsersStore = (coordenadas : any, userCode: number) => {
  const selectedUsersStore = selectedUsers();
  const registersToAdd = ref<Coordinate[]>([]);

  for (let register of coordenadas) {
    const coordenada = ref<Coordinate>({
      lat: register.latitude,
      lng: register.longitude,
      data: register.dataHora
    });
    registersToAdd.value.push(coordenada.value);
  }
  selectedUsersStore.addCoordenadas(userCode, registersToAdd.value);
};



onMounted(() => {
    config.apiKey = "tF1lf7jSig6Ou8IuaLtw";
    inicializarMapa();

    const controlElements = document.getElementsByClassName(
        "maplibregl-ctrl-top-right"
    );
    for (let element of Array.from(controlElements) as HTMLElement[]) {
        element.style.top = "auto";
        element.style.bottom = "80px";
        element.style.right = "10px";
    }
});

const toggleFilter = () => {
    if(showComponentsMode.filter == true){
        showComponentsMode.esconderComponents()
    }else{
        showComponentsMode.showFilter();
    }
};

const changeLoading = () => {
    loading.value = !loading.value;
};

const handleSearch = (searchParams: SearchParams) => {
    changeLoading();
    getPoints(searchParams);
};

const handleDelete = (deleteParams: number, idUser: number) => {
    all_markers.value[deleteParams].forEach((marker) => marker.remove());
    all_markers.value.splice(deleteParams, 1);

    const routeId = `route${idUser}`;

    if (map.value?.getLayer(routeId)) {
        map.value.removeLayer(routeId);
    }

    if (map.value?.getSource(routeId)) {
        map.value.removeSource(routeId);
    }

    if (actualUser.value > deleteParams) {
        actualUser.value--;
    } else if (actualUser.value === deleteParams) {
        actualUser.value = Math.max(0, actualUser.value - 1);
    }
};

const getPoints = async (searchParams: SearchParams) => {
    try {
        const firstReq: any = await RegistrosService.getRegistros(
            searchParams.userCode,
            0,
            searchParams.dataInicio,
            searchParams.dataFim
        );
        if (firstReq.registers.length != 0) {
            const allPages = firstReq.totalPages;
            allCoords.value.push(firstReq.registers);
            transformData(firstReq.registers, 0, allPages, searchParams);
            map.value?.fitBounds([
                [
                    firstReq.maxMinCoordinates.minLongitude - 0.05,
                    firstReq.maxMinCoordinates.minLatitude - 0.05,
                ],
                [
                    firstReq.maxMinCoordinates.maxLongitude + 0.05,
                    firstReq.maxMinCoordinates.maxLatitude + 0.05,
                ],
            ]);
            addSelectedUsersStore(firstReq.registers, searchParams.userCode, searchParams.fullName);   

            for (let page = 1; page <= allPages; page++) {
                const req = await RegistrosService.getRegistros(
                    searchParams.userCode,
                    page,
                    searchParams.dataInicio,
                    searchParams.dataFim
                );
                if (req) {
                    allCoords.value.push(req.registers);
                    transformData(req.registers, page, allPages, searchParams);
                    addCoordenadasSelectedUsersStore(req.registers, searchParams.userCode);
                }
            }
        } else {
            changeLoading();
            messageEmpty.value = "This user has not registers in this period.";
            showMessageEmpty.value = true;
            setTimeout(() => {
                showMessageEmpty.value = false;
                messageEmpty.value = "";
            }, 3000);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

function transformData(
    data: any,
    page: number,
    totalpages: number,
    elementData: any
) {
    if (data) {
        plotPontos(data, page, totalpages, elementData);
    }
}

onUnmounted(() => {
    if (map.value) {
        map.value.remove();
    }
});

function inicializarMapa() {
    const initialState = { lng: -60.6714, lat: 2.81954, zoom: 1 };

    if (mapContainer.value) {
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


    const drawControls = document.querySelectorAll(".mapboxgl-ctrl-group.mapboxgl-ctrl");
    drawControls.forEach((elem) => {
        elem.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group');
    });
    } else {
        console.warn("mapContainer is not available");
    }
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

function plotPolygon(coordinates: number[][], user_id: number) {
    const sourceId = `area_${user_id}`;
    const layer = map.value?.getLayer(sourceId);

    if (layer) {
        const currentVisibility = map.value?.getLayoutProperty(sourceId, 'visibility');
        const newVisibility = currentVisibility === 'visible' ? 'none' : 'visible';
        map.value?.setLayoutProperty(sourceId, 'visibility', newVisibility);
    } else {
        const filtredCoordinates = toRaw(coordinates) as number[][];

        map.value?.addSource(sourceId, {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [filtredCoordinates]
                },
                'properties': {}
            }
        });

        map.value?.addLayer({
            'id': sourceId,
            'type': 'fill',
            'source': sourceId,
            'layout': {
                'visibility': 'visible'
            },
            'paint': {
                'fill-color': '#ff00007c',
                'fill-opacity': 0.5
            }
        });
    }
}

function deletePolygon(user_id: number) {
    const sourceId = `area_${user_id}`;

    if (map.value?.getLayer(sourceId)) {
        map.value?.removeLayer(sourceId);
    }

    if (map.value?.getSource(sourceId)) {
        map.value?.removeSource(sourceId);
    }
}


async function plotPontos(
    allPoints: any,
    page: number,
    totalpages: number,
    elementData: any
) {
    if (!all_markers.value[actualUser.value]) {
        all_markers.value[actualUser.value] = [];
    }
    const fin = allPoints.length - 1;
    const [firstName, secondName] = elementData.fullName.split(" ");
    const iniciais = firstName[0] + secondName[0];

    let el_start = createMarkerElement(
        elementData.fullName,
        createPin('green', "START", false)
    );

    let el_finish = createMarkerElement(
        elementData.fullName,
        createPin('red', "FINISH", false)
    );

    allPoints.forEach((point: any, index: number) => {
        if (point.isStopped) {
            let el_point = createMarkerElement(
                elementData.fullName,
                createPin(elementData.cicleColor, iniciais, point.isStopped)
            );

            if (map.value) {
                const defaultMark = new Marker({ element: el_point })
                    .setLngLat([point.longitude, point.latitude])
                    .addTo(map.value);
                all_markers.value[actualUser.value].push(defaultMark);
            } else {
                console.warn("Map is not initialized");
            }
        }
    });

    if (page === 0) {
        if (map.value) {
            let startMark = new Marker({ element: el_start })
                .setLngLat([allPoints[0].longitude, allPoints[0].latitude])
                .addTo(map.value);
            all_markers.value[actualUser.value].push(startMark);
        } else {
            console.warn("Map not initialized");
        }
    }
    if (!allPoints || allPoints.length === 0) {
        return;
    }

    if (page === totalpages - 1) {
        if (map.value) {
            let finishMark = new Marker({ element: el_finish })
                .setLngLat([allPoints[fin].longitude, allPoints[fin].latitude])
                .addTo(map.value);

            all_markers.value[actualUser.value].push(finishMark);
        }

        let flattenedCoords = allCoords.value.flat();
        let formattedCoords: any[][] | null = flattenedCoords.map((coord) => [
            coord.longitude,
            coord.latitude,
        ]);

        const routeId = `route${elementData.userCode}`;
        map.value?.addSource(routeId, {
            type: "geojson",
            data: {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: formattedCoords,
                },
            },
        });

        map.value?.addLayer({
            id: routeId,
            type: "line",
            source: routeId,
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": "#0f53ff",
                "line-width": 4,
            },
        });

        formattedCoords = null;
        allCoords.value = [];

        actualUser.value++;
        changeLoading();
    }
}

// function walkPoints(allPoints) {
//     allPoints.forEach((point, index) => {
//         let el_point = createMarkerElement(
//             elementData.fullName,
//             createPin("#000", ":)", false)
//         );
//         const defaultMark = new Marker({ element: el_point })
//             .setLngLat([point.longitude, point.latitude])
//             .addTo(map.value);
//         all_markers.value[actualUser.value].push(defaultMark);
//         setTimeout(()=>{

//         },1000);
//     });
// }

function createPin(color: string, name: string, isStopped: boolean) {
    let user_pin = document.createElement("div");

    if (name == "START" || name == "FINISH") {
        user_pin.style.borderRadius = "3px";
        user_pin.style.height = `13px`;
        user_pin.style.paddingInline = "5px";
        user_pin.style.paddingBlock = "2px";
        user_pin.style.zIndex = "5";
    } else {
        user_pin.style.borderRadius = "50%";
        user_pin.style.height = `25px`;
    }

    user_pin.style.minWidth = `25px`;
    user_pin.style.boxShadow =
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);";
    user_pin.style.backgroundColor = color;
    user_pin.style.color = "white";
    user_pin.style.display = "flex";
    user_pin.style.alignItems = "center";
    user_pin.style.justifyContent = "center";
    user_pin.style.fontWeight = "bold";
    user_pin.innerHTML = name;
    user_pin.style.border  = "1px solid black"

    if (isStopped) {
        user_pin.style.backgroundColor = "yellow";
        user_pin.style.color = "black";
    }

    return user_pin;
}

function createImg(imgSrc: string) {
    let img = document.createElement("img");
    img.src = imgSrc;
    img.style.width = `25px`;
    img.style.height = `25px`;
    img.style.filter = "drop-shadow(0px 0px 2px #fff)";

    return img;
}

function createMarkerElement(name: string, element: HTMLElement) {
    let el = document.createElement("div");

    let son = document.createElement("div");

    son.textContent = `${name}`;
    son.style.backgroundColor = "#FFF";
    son.style.display = "block";
    son.style.opacity = "0";
    son.style.width = "max-content";
    son.style.position = "absolute";
    son.style.bottom = "15px";
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
            map.value.setStyle(
                isDarkMode ? MapStyle.STREETS.DARK : MapStyle.STREETS
            );
            map.value.on("load", () => {
                const attributionControl = document.querySelector(
                    ".maplibregl-ctrl-attrib a"
                ) as HTMLElement;
                if (attributionControl) {
                    attributionControl.style.display = "none";
                }
            });

            const controlElements =
                document.getElementsByClassName("maplibregl-ctrl");
            for (let element of controlElements) {
                const htmlElement = element as HTMLElement;
                if (isDarkMode) {
                    htmlElement.style.backgroundColor = "#0a0012e3";
                    htmlElement.style.color = "#fff";
                } else {
                    htmlElement.style.backgroundColor = "#fff";
                    htmlElement.style.color = "#000";
                }
            }

            const controlIcons = document.getElementsByClassName(
                "maplibregl-ctrl-icon"
            );
            for (let icon of controlIcons) {
                const iconHtml = icon as HTMLElement;
                if (isDarkMode) {
                    iconHtml.style.filter = "invert(100%)";
                } else {
                    iconHtml.style.filter = "none";
                }
            }
        }
    }
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

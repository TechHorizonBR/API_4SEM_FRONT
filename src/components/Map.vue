<template>
    <div class="map-wrap">
        <div class="map" ref="mapContainer"></div>
    </div>
</template>

<script setup>
import { Map, MapStyle, Marker, config } from "@maptiler/sdk";
import { shallowRef, onMounted, onUnmounted, markRaw } from "vue";
import "@maptiler/sdk/dist/maptiler-sdk.css";

const mapContainer = shallowRef(null);
const map = shallowRef(null);

onMounted(() => {
    config.apiKey = "tF1lf7jSig6Ou8IuaLtw";

    const initialState = { lng: -45.79513, lat: -23.162272, zoom: 15 };

    let points = [
        {
            lat: -10.9111,
            lng: -37.0717,
        },
        {
            lat: -1.4558,
            lng: -48.5044,
        },
        {
            lat: -19.9208,
            lng: -43.9378,
        },
        {
            lat: 2.8197,
            lng: -60.6733,
        },
        {
            lat: -15.7797,
            lng: -47.9297,
        },
        {
            lat: -20.4428,
            lng: -54.6464,
        },
        {
            lat: -15.5961,
            lng: -56.0967,
        },
        {
            lat: -25.4278,
            lng: -49.2731,
        },
        {
            lat: -27.5967,
            lng: -48.5492,
        },
        {
            lat: -3.7172,
            lng: -38.5431,
        },
        {
            lat: -16.6786,
            lng: -49.2539,
        },
        {
            lat: -7.115,
            lng: -34.8631,
        },
        {
            lat: 0.0389,
            lng: -51.0664,
        },
        {
            lat: -9.6658,
            lng: -35.7353,
        },
        {
            lat: -3.1019,
            lng: -60.025,
        },
        {
            lat: -5.795,
            lng: -35.2094,
        },
        {
            lat: -10.2139,
            lng: -48.3603,
        },
        {
            lat: -30.0331,
            lng: -51.23,
        },
        {
            lat: -8.7619,
            lng: -63.9039,
        },
        {
            lat: -8.0539,
            lng: -34.8811,
        },
        {
            lat: -9.9747,
            lng: -67.81,
        },
        {
            lat: -22.9028,
            lng: -43.2075,
        },
        {
            lat: -12.9711,
            lng: -38.5108,
        },
        {
            lat: -2.5297,
            lng: -44.3028,
        },
        {
            lat: -23.5475,
            lng: -46.6361,
        },
        {
            lat: -5.0892,
            lng: -42.8019,
        },
        {
            lat: -20.3194,
            lng: -40.3378,
        },
    ];

    map.value = markRaw(
        new Map({
            container: mapContainer.value,
            style: MapStyle.OPENSTREETMAP,
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom,
        })
    );

    for (let i = 0; i < points.length; i++) {
    let el = document.createElement('div');
    let img = document.createElement('img');
    let son = document.createElement('div');
    
    son.textContent = `Long: ${points[i].lng}, Lat: ${points[i].lat}`;
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

    img.src = `marker_${i%2 == 0 ? "1" : "2"}.png`;
    img.style.width = `25px`;
    img.style.height = `25px`;
    img.style.filter = "drop-shadow(0px 0px 2px #000000)";

    el.appendChild(img);
    el.appendChild(son);

    el.addEventListener('mouseover', () => {
        son.style.opacity = "1";
    });

    el.addEventListener('mouseout', () => {
        son.style.opacity = "0";
    });

    new Marker({ element: el })
        .setLngLat([points[i].lng, points[i].lat])
        .addTo(map.value);
}


    // for(let x = 0; x < 5; x++){
    //   new Marker({color:"#FF000"})
    //     .setLngLat([x, x])
    //     .addTo(map.value);
    // }

    map.on("load", async function () {
        const geojson = await maptilersdk.data.get(
            "https://api.maptiler.com/data/4dff6bfe-3e00-4393-9d52-036da416144f/features.json?key=tF1lf7jSig6Ou8IuaLtw"
        );
        map.addSource("gps_tracks", {
            type: "geojson",
            data: geojson,
        });
    });
    new Marker({ color: "#00FF00" })
        .setLngLat([-45.79513, -23.162272])
        .addTo(map.value);

    //marker.togglePopup(); // toggle popup open or closed
}),
    onUnmounted(() => {
        map.value?.remove();
    });
</script>

<style scoped>
.map-wrap {
    position: relative;
    width: 100%;
    height: calc(
        100vh - 77px
    ); /* calculate height of the screen minus the heading */
}

.map {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>

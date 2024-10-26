<template>
    <div class="container-block" :class="{ 'container-dark-block': isDark, 'container-light-block': !isDark }">
        <div class="first-block">
            <font-awesome-icon :icon="['fas', 'map-location-dot']" class="icons" />
            <h4>596.61km</h4>

            <font-awesome-icon :icon="['fas', 'clock']" class="icons clock-icon" />
            <h4>74m</h4>
        </div>

        <div class="locations">
            <div class="inicio-jornada">
                <div class="container-icon-data">
                    <font-awesome-icon :icon="['fas', 'map-pin']" class="icons icon-inicio" />
                    <h3 class="datas">2024-10-23 20:47:00</h3>
                </div>
                <p class="endereco" :class="{ 'endereco-dark': isDark, 'endereco-light': !isDark }">Rua José do Benedito
                    Aparecido - Bairro João Clevus - Caçapava /SP - Brazil</p>
            </div>

            <div class="fim-jornada">
                <div class="container-icon-data">
                    <font-awesome-icon :icon="['fas', 'map-pin']" class="icons icon-chegada" />
                    <h3 class="datas">2024-10-23 20:47:00</h3>
                </div>
                <p class="endereco" :class="{ 'endereco-dark': isDark, 'endereco-light': !isDark }">Rua José do Benedito
                    Aparecido - Bairro João Clevus - Caçapava /SP - Brazil</p>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
    isDark: boolean
}>();

</script>

<style scoped>
.container-block {
    padding: 15px 20px;
    border-radius: 10px;
    max-width: 19.5vw;
    min-width: 17vw;
    margin: 0 3% 3% 0;
}

.container-dark-block {
    background-color: #383838;
}

.container-light-block {
    background-color: white;
}

.first-block {
    display: flex;
    border-bottom: solid rgba(128, 128, 128, 0.744) 0.9px;
    margin: 0 0 3% 0;
    padding: 0 0 3% 0;
    justify-content: center;
}

.icons {
    font-size: 1.5em;
    margin: 0 3%;
}

h4,
h3 {
    margin: 0
}

.container-icon-data {
    display: flex
}

.endereco {
    margin: 0 0 0 10%;
}

.inicio-jornada {
    margin: 0 0 3% 0;
}

.linha-pontilhada {
    border-left: 2px dashed rgba(128, 128, 128, 0.744);
    height: 38px;
    margin: 0 auto;
    width: 2px;
    margin-left: 25px;
    position: absolute;
    top: 3.5vh;
    left: -1.3vw;
}

.icon-inicio {
    color: #00FF00
}

.icon-chegada {
    color: #FF0000
}

.locations {
    position: relative;
}

.datas {
    font-weight: bold;
    font-size: 1.0em;
}

.endereco-dark {
    color: #8d8d8d;
}

.endereco-light {
    color: #565656;
}
</style>
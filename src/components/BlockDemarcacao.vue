<template>

    <div class="container">
        <h4>{{ name }}</h4>
    </div>
</template>

<script setup lang="ts">

const props = defineProps<{
    isDark: boolean,
    name: string
}>();

</script>

<style scoped>
</style>
<template>
  <div class="filter">
    <div class="data-list">
      <h3>Áreas Salvas:</h3>
      <ul>
        <li v-for="(item, index) in savedData" :key="index">{{ item }}</li>
      </ul>
    </div>
    <!-- Título "Nova Área" -->
     <div class="title2">
      <h3>Nova Área</h3>
     </div>
    
    <!-- Campo para digitar o nome da nova área -->
    <div class="input-group">
      <label for="area-name">Nome da Nova Área:</label>
      <input type="text" id="area-name" v-model="areaName" />
    </div>
    <!-- Campo para digitar o nome do usuário vinculado -->
    <div class="input-group">
      <label for="user-name">Nome do Usuário Vinculado:</label>
      <input type="text" id="user-name" v-model="userName" />
    </div>
    <!-- Botão "Selecionar Área" -->
    <button @click="selectArea">Selecionar Área</button>
    <!-- Botão "Salvar" -->
    <button @click="saveData">Salvar</button>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import 'flatpickr/dist/flatpickr.css';

const savedData = ref(['Dado 1', 'Dado 2', 'Dado 3']);
const areaName = ref('');
const userName = ref('');

const selectArea = () => {
  console.log('Área selecionada:', areaName.value);
};

const saveData = () => {
  console.log('Dados salvos:', areaName.value, userName.value);
  // Adicione a lógica de salvar aqui
};
</script>

<style scoped>
  .filter {
    position: absolute;
    width: 330px;
    height: 450px;
    top: 3vh;
    left: 3vw;
    padding: 20px 20px;
    background-color: #f7f7f7cd;
    border-radius: 20px;
    z-index: 1000;
    box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
    animation: fadeInOut 3s ease-in-out;
  }

  .data-list {
    height: 33%;
    overflow-y: auto;
    margin-bottom: 10px;
  }

  .title2{
    text-align: center;
  }

  .input-group {
    margin-bottom: 15px;
  }

  button {
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #35005d;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  button:hover {
    background-color: #3c0564;
  }

  .labelDark {
      color: white;
    }
    .labelLight {
      color: black;
    }

  .fade-enter-active {
    animation: fadeInUp 0.3s ease-out;
  }

  .fade-leave-active {
    animation: fadeOutDown 0.3s ease-in forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeOutDown {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(20px);
    }
  }
</style>
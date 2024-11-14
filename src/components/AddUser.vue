<template>
  <div class="container">
    <div class="box">
      <h1 class="title">Adicionar Usuário</h1>
      <div class="button-container">
        <button class="button">Salvar</button>
        <button class="button">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "AddUser",
};
</script>

<style scoped>
/* Estilos para centralizar o retângulo */
.container {
  display: flex;
    justify-content: center;
    height: 89%;
    width: 100%;
    position: absolute;
    z-index: 10000;
    top: 0vh;
    align-items: center;
}

.box {
  width: 75%;
    height: 72%;
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    top: 28px;
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

/* Título no canto superior esquerdo */
.title {
  font-size: 24px;
  margin: 0;
}

/* Container para os botões */
.button-container {
  margin-top: 10px;
}

/* Estilos dos botões */
.button {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  background-color: #4b0076;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

.button:hover {
  background-color: #7d009b;
}
</style>

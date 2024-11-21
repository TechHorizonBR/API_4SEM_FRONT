<template>
  <div class="body-content">
    <div class="header">
      <img src="@/assets/logo-techhorizon.png" alt="Logo techHorizon" />
    </div>
    <div class="login-content" @keydown.enter="fetchLogin">
      <div class="input-group">
        <div class="image-input">
          <img src="@/assets/logo_escrita.png" alt="Logo LocalTracket" />
        </div>
      </div>
      <div class="input-group">
        <div class="image-input"></div>
        <div class="input-login">
          <input
            type="text"
            id="username"
            class="inputs"
            placeholder="Username"
            v-model="usuario"
          />
        </div>
        <div class="input-login">
          <input
            type="password"
            class="inputs"
            placeholder="Password"
            v-model="senha"
          />
        </div>
      </div>
      <div>
        <button class="login-button" @click="fetchLogin">GET STARTED</button>
      </div>
      <p class="rights-reserved">© Copyright - All Rights Reserved - Tech Horizon 2024</p>
    </div>
    <Alerts :message="messageAlert" :show="showMessage" v-if="showMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoginService from '@/services/login';
import Alerts from './Alerts.vue';
import { tokenStore } from '@/stores/token';
import { useRouter } from 'vue-router';

const router = useRouter();
const usuario = ref<string>("");
const senha = ref<string>("");
const messageAlert = ref<string>('');
const showMessage = ref<boolean>(false);
const tokenStr = tokenStore();
const fetchLogin = async () => {
  try {
    if(usuario.value === ''){
      showAlert("Please enter the username.");
      return;
    }

    if(senha.value === ''){
      showAlert("Please enter the password.");
      return;
    }

    const response = await LoginService.autenticarUsuario(usuario.value, senha.value);
    if (response.status === 200) {
      tokenStr.setToken(response.data.token);
      router.push({path: "/map"});
    }
  } catch (error) {
    showAlert("Credênciais inválidas.");
  }
};

const showAlert = (message: string) => {
  showMessage.value = true;
  messageAlert.value = message;

  setTimeout(() => {
    showMessage.value = false;
    messageAlert.value = '';
  }, 3000);
};
</script>


<style>
body {
  overflow: hidden;
}

.body-content{
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center; 
  height: 80vh; 
  width: 100%;
  position: relative;
}
.header{
  position: absolute;
  top: -20px; 
  left: 20px;
}
.header img {
  width: 100px;
  height: auto;

}
.login-content {
  width: 450px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.rights-reserved{
  color: rgb(111, 111, 111);
  font-size: 0.7em;
  margin: 30px 0 0 0;
}

.inputs::placeholder{
  color: white;
}
.input-group{
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.inputs{
  margin-bottom: 16px;
  border-radius: 20px;
  height: 35px;
  width: 280px;
  background-color: rgba(255,255,255,0.1);
  color: #fff;
  font-weight: 250;
  font-size: medium;
  padding: 10px;
  border: none;
  outline-color: #4b0076;
}
.image-input img {
  width: 250px; 
  height: auto;
  border-radius: 8px;
}


.login-button {
  width: 290px;
  height: 50px;
  background-color: #4b0076;
  color: #fff; 
  border: none; 
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: #26003c;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.login-button:active {
  transform: scale(0.97);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); 
}
</style>
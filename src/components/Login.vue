<template>
  <div class="login-content">
    <div class="input-group">
      <div class="image-input">
        <img src="@/assets/logo_escrita.png" alt="Logo LocalTracket" />
      </div>

    </div>


    <div class="input-group">
      <div class="image-input">
      </div>
      <div class="input-login">
        <input type="text" id="username" class="inputs" placeholder="Username"></input>
      </div>
      <div class="input-login">
        <input type="password"class="inputs" placeholder="Password"></input>
      </div>
    </div>

    <div>

      <button class="login-button">GET STARTED</button>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style>
.login-content {
  width: 450px;
  height: auto;
  background-color: rgba(75, 0, 118, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
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
}
.image-input img {
  width: 250px; 
  height: auto;
  border-radius: 8px;
}


.login-button {
  width: 290px;
  background-color: #4b0076;
  color: #fff; 
  border: none; 
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: #26003c; /* Muda a cor ao passar o mouse */
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15); /* Aumenta a sombra */
}

.login-button:active {
  transform: scale(0.97); /* Dá um efeito de "clique" */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Reduz a sombra */
}
</style>
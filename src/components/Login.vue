<template>
  <div class="body-content">
  <div class="header">
    <img src="@/assets/logo-techhorizon.png" alt="Logo techHorizon"/>
  </div>
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
</div>
</template>

<script setup lang="ts">

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
  height: 100vh; 
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
  padding: 5px;
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
  background-color: #26003c;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.login-button:active {
  transform: scale(0.97);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); 
}
</style>
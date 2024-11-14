<template>
  <div class="login-content">
    <div class="input-group">
      <div class="image-input">
      </div>
      <div class="input-login">
        <input type="text" id="username" class="inputs">Username</input>
      </div>
    </div>


    <div class="input-group">
      <div class="image-input">
      </div>
      <div class="input-login">
        <input type="password"class="inputs">Password</input>
      </div>
    </div>

    <div>

      <button>GET STARTED</button>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style>
.login-content {
  height: 450px;
  width: 600px;
  background-color: rgba(255, 255, 255, 0.4);
}


.input-group{
  padding: 10px;
}

</style>
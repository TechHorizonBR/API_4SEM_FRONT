<template>
    <div class="container" :class="{ 'fundo-dark': isDark, 'fundo-light': !isDark }">
        <div class="box" :class="{ containerDark: isDark, containerLight: !isDark }">
            <div class="side-bar">
                <div class="container-title">
                    <div class="quadrado">
                        <font-awesome-icon icon="fa-solid fa-gear" />
                    </div>
                    <h1 class="title">About me</h1>
                </div>

                <ur class="options-sidebar" :class="{ 'side-bar-dark': isDark, 'side-bar-light': !isDark }">
                    <li><a id="button-create-user" class="button-page" :class="{ 'button-page-dark': isDark }"
                            @click="swapIsInformation">
                            <font-awesome-icon :icon="['fas', 'circle-info']" class="icone-button-close" />
                            Information</a></li>
                    <li><a id="button-see-all-users" class="button-page" :class="{ 'button-page-dark': isDark }"
                            @click="swapIsReset">
                            <font-awesome-icon :icon="['fas', 'lock']" class="icone-button-close" />
                            Reset Password</a></li>
                    <li><a class="button-page" :class="{ 'button-page-dark': isDark }" @click="closeComponent"
                            >
                            <font-awesome-icon :icon="['fas', 'xmark']" class="icone-button-close" />
                            Close</a></li>
                </ur>
            </div>





            <div v-if="isInformation" class="container-reset">
                <div class="block0">
                    <div class="block2">
                        <div class="container-information">
                            <h3 class="title-pages">Information about me</h3>
                            
                            <div class="fline2">
                                
                                <div class="info-item">
                                    <label>ID:</label>
                                    <span>{{
                                        userStr.user.id
                                            ? userStr.user.id
                                            : "ID not available"
                                    }}</span>
                                </div>
                                <div class="info-item">
                                    <label>Name:</label>
                                    <span>{{
                                        userStr.user.name
                                            ? userStr.user.name
                                            : "Name not available"
                                    }}</span>
                                </div>
                                <div class="info-item">
                                    <label>Role:</label>
                                    <span>{{
                                        userStr.user.role
                                            ? userStr.user.role
                                            : "Role not available"
                                    }}</span>
                                </div>
                                <div class="info-item">
                                    <label>Username:</label>
                                    <span>{{
                                        userStr.user.username
                                            ? userStr.user.username
                                            : "Username not available"
                                    }}</span>
                                </div>
                            </div>
                            <div class="fline1" :class="{
                                blockDark: isDark,
                                blockLight: !isDark,
                            }">
                                <div class="info-item">
                                    <label>Creation Date:</label>
                                    <span>{{
                                        userStr.user.createdAt
                                            ? userStr.user.createdAt
                                            : "Date not available"
                                    }}</span>
                                </div>
                                <div class="info-item">
                                    <label>Created By:</label>
                                    <span>{{
                                        userStr.user.createdBy
                                            ? userStr.user.createdBy
                                            : "Information not available"
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isReset" class="container-reset">
                
                <div class="block0">

                    <div class="block2_pass">
                        <div class="all_pass">
                            <h3 class="title-pages">Change Password</h3>
                            <div class="pass_input">
                                <label>Type your new password</label>
                                <input type="password" v-model="password" name="password" id="inp_pass"
                                    placeholder="New password" @input="verifyStrong"   :class="{ 'input-dark': isDark }"/>
                            </div>
                            <div class="pass_input">
                                <label>Confirm your new password</label>
                                <input type="password" v-model="confirmPassword" name="confirm_password"
                                    id="inp_confirm_pass" placeholder="Confirm password"   :class="{ 'input-dark': isDark }"/>
                                    <span v-if="(password.length > 0) && (password !== confirmPassword)"
                                        style="color: red; font-size: small">Passwords aren't the same</span>
                            </div>
                            

                                <div class="strong_rules">
                            <span style="font-size: 0.9em;">
                                Your password must have:
                            </span>
                            <div class="all_rules">
                                <span :class="strongRules.minChar
                                    ? 'icon-check'
                                    : 'icon-error'
                                    ">
                                    Minimum 8 characters
                                </span>
                                <span :class="strongRules.lowerCase
                                    ? 'icon-check'
                                    : 'icon-error'
                                    ">
                                    At least one lowercase letter
                                </span>
                                <span :class="strongRules.upperCase
                                    ? 'icon-check'
                                    : 'icon-error'
                                    ">
                                    At least one uppercase letter
                                </span>
                                <span :class="strongRules.number
                                    ? 'icon-check'
                                    : 'icon-error'
                                    ">
                                    At least one number
                                </span>
                                <span :class="strongRules.specialChar
                                    ? 'icon-check'
                                    : 'icon-error'
                                    ">
                                    At least one special character
                                </span>
                            </div>
                        </div>
                        
                            <button class="pass-button" @click="changePassword()">
                                Change
                            </button>
                        </div>
                        
                    </div>
                </div>

            </div>
        </div>

    </div>
    <Alerts :message="messageAlert" :show="showMessage" v-if="showMessage" />
</template>

<script>
import { userStore } from "@/stores/token";
import RegistrosService from "@/services/registros";
import Alerts from '@/components/Alerts.vue';
import { showComponents } from "@/stores/showComponents";


export default {
    props: {
        isVisible: Boolean,
        isDark: Boolean
    },
    components: {
        Alerts,
    },
    data() {
        return {
            userStr: userStore(),
            showMessage: false,
            isReset: false,
            isInformation: true,
            messageAlert: "",
            password: "",
            confirmPassword: "",
            showComponent: showComponents(),
            strongRules: {
                minChar: false,
                lowerCase: false,
                upperCase: false,
                number: false,
                specialChar: false,
            },
            isStrong: false,
        };
    },
    methods: {
        closeComponent(){
            this.showComponent.esconderComponents();
        },
        swapIsReset() {
            this.isInformation = false
            this.isReset = true;
        },
        swapIsInformation(){
            this.isReset = false;
            this.isInformation = true;
        },

        verifyStrong() {
            const password = this.password;

            this.strongRules.minChar = password.length >= 8;
            this.strongRules.lowerCase = /[a-z]/.test(password);
            this.strongRules.upperCase = /[A-Z]/.test(password);
            this.strongRules.number = /[0-9]/.test(password);
            this.strongRules.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(
                password
            );

            this.isStrong = Object.values(this.strongRules).every(
                (rule) => rule === true
            );
        },
        async changePassword() {
            if (this.password !== this.confirmPassword) {
                this.showAlert("Passwords aren't the same");
                return;
            }

            if (!this.isStrong) {
                this.showAlert("There are rules not being followed.")
                return;
            }

            const dataPass = {
                id: (this.userStr).user?.id,
                password: this.password,
                passwordConfirmation: this.confirmPassword
            }
            try {
                const changed = await RegistrosService.resetPassword(dataPass);
                if(changed.status){
                    this.showAlert("Password changed successfully!");
                    this.password = "";
                    this.confirmPassword = "";
                }else{
                    this.showAlert("An error occurred to change the password");
                }
            } catch (error) {
                console.error("Error resetting password:", error);
            }
        },
        showAlert(message) {
            this.showMessage = true;
            this.messageAlert = message;

            setTimeout(() => {
                this.showMessage = false;
                this.messageAlert = '';
            }, 3000);
        }
    }
};
</script>

<style scoped>
/* Estilos para centralizar o retângulo */
.fundo-light {
    background-color: #ffffff42;
}

.fundo-dark {
    background-color: #1e013542;
}

.container {
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: 10000;
    top: 0;
    align-items: flex-start;
}

input:focus,
select:focus {
    outline: none;
    border-color: #6f00ff;
    box-shadow: 0 0 3px rgba(145, 16, 226, 0.636);
}

.containerDark {
    background: #0a0012;
    color: white;
}

.containerLight {
    background-color: white;
}

.blockForm {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 80%;
}
.container-information{
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    text-align: center;
}

.fline1,
.fline2 {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

.info-item {
    display: flex;
    flex-direction: column;
    text-align: left;
    min-width: 100px;
    /* Ajuste conforme necessário */
}

.info-item label {
    font-weight: bold;
}

.blockDark {
    background-color: #333;
    color: #fff;
    padding: 1rem;
    border-radius: 5px;
}

.blockLight {
    background-color: #f9f9f9;
    color: #000;
    padding: 1rem;
    border-radius: 5px;
}

.usernameDark {
    background-color: rgb(56, 56, 56);
    color: rgb(255, 255, 255);
    border: 1px solid rgb(41, 41, 41);
}

.box {
display: flex;
  min-width: 70vw;
  height: 70vh;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  top: 8vh;

}

/* Título no canto superior esquerdo */
.title {
    font-size: 1.2em;
    margin: 0;
}

.block0 {
    display: flex;
    flex-direction: row;
}


.block2 {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
}

.block2_pass {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: 30px;
}

.case1 {
    display: flex;
    flex-direction: column;
}

.case2 {
    display: flex;
    flex-direction: column;
}

.case3 {
    display: flex;
    flex-direction: column;
}
.input-dark {
  color: white;
  background-color: #383838;
  border: none
}
.case4 {
    display: flex;
    flex-direction: column;
}

.container-reset{
    margin-top: 25px;
    margin-left: 15px;
    width: 100%;
    display: flex
;
    justify-content: center;
}
.title-pages{
  font-weight: bold;
}
.tableDark {
    border: 1px solid rgba(211, 210, 210, 0.703);
}

.side-bar {
  padding-right: 20px;
  width: 15vw;
  border-right: #a2a2a29d 1px solid;
  height: 70vh;
}
.options-sidebar {
  margin: 20px 0 0 0;
}
.container-title {
  display: flex;
  align-items: center;
  font-size: 1em;
  gap: 5px
}

.quadrado {
  background-color: #5c0ea3;
  color: white;
  padding: 8px;
  border-radius: 3px;
}

.title {
  font-size: 1em;
  margin: 0
}

ur {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 250px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}


ur li {
  margin: 0;
  padding: 0;
}


.button-page {
  display: flex;
  align-items: center;
  padding: 15px 0;
  text-decoration: none;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
}


.button-page .fa-icon {
  margin-right: 10px;
}


.button-page:hover {
  background-color: #4007961d;
  color: #5c38ff;
}

.button-page-dark:hover {
  color: white
}
.forms-search{
  display: flex;
  flex-direction: column;
}

.icone-button-close {
  margin-right: 10px;
}



.options-sidebar {
  margin: 20px 0 0 0;
}
.function{
  display: flex;
}

.sidebar-button {
    width: 100%;
    padding: 10px;
    margin-bottom: 25%;
    border: none;
    cursor: pointer;
    font-size: 14px;
    margin-top: 12%;
    display: block;
    background-color: #35005d;
    color: white;
    border-radius: 8px;
    cursor: pointer;
}

.pass-button {
    width: 100%;
    padding: 10px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    margin-top: 12%;
    display: block;
    background-color: #35005d;
    color: white;
    border-radius: 8px;
    cursor: pointer;
}

.sidebar-button:hover {
    background-color: #5c0ea3;
}

label {
    margin-bottom: 5px;
}

input,
select {
    outline: none;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid rgb(156, 156, 156);
}

table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid rgba(0, 0, 0, 0.265);
}

th {
    background-color: #000;
    border: 1px solid #fff;
    padding: 8px;
    text-align: left;
    color: white;
}

td {
    padding: 8px;
    text-align: left;
}

#bClose {
    margin-top: 105%;
}

.pass_input {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    width: 300px;
}

.all_pass {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.strong_rules,
.all_rules {
    display: flex;
    flex-direction: column;
    font-size: 0.9em;
}

.strong_rules {
    width: 300px;
}

.all_rules {
    margin-left: 20px;
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

.all_rules span::before {
    content: "";
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    background-size: contain;
    background-repeat: no-repeat;
}

.icon-check {
    color: green;
}

.icon-error {
    color: red;
}

/* Ícone de check */
.icon-check::before {
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>');
}

/* Ícone de erro */
.icon-error::before {
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>');
}
</style>

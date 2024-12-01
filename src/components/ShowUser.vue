<template>
    <div class="container">
        <div
            class="box"
            :class="{ containerDark: isDark, containerLight: !isDark }"
        >
            <template v-if="!isReset">
                <h1 class="title">User Information</h1>
                <div class="block0">
                    <div class="block1">
                        <button class="sidebar-button" @click="swapIsReset()">
                            Reset Password
                        </button>
                    </div>

                    <div class="block2">
                        <div class="blockForm">
                            <div
                                class="fline1"
                                :class="{
                                    blockDark: isDark,
                                    blockLight: !isDark,
                                }"
                            >
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
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <h1 class="title">Change Password</h1>
                <div class="block0">
                    <div class="block1">
                        <button class="sidebar-button" @click="swapIsReset()">
                            User information
                        </button>
                    </div>

                    <div class="block2_pass">
                        <div class="all_pass">
                            <div class="pass_input">
                                <span>Type your new password</span>
                                <input
                                    type="password"
                                    v-model="password"
                                    name="password"
                                    id="inp_pass"
                                    placeholder="New password"
                                    @input="verifyStrong"
                                />
                            </div>
                            <div class="pass_input">
                                <span>Confirm your new password</span>
                                <input
                                    type="password"
                                    v-model="confirmPassword"
                                    name="confirm_password"
                                    id="inp_confirm_pass"
                                    placeholder="Confirm password"
                                />
                            </div>
                            <span v-if="(password.length > 0) && (password !== confirmPassword)" style="color: red; font-size: small">Passwords aren't the same</span>
                            <button
                                class="pass-button"
                                @click="changePassword()"
                            >
                                Change
                            </button>
                        </div>
                        <div class="strong_rules">
                            <span
                                style="font-size: larger; margin-bottom: 10px"
                            >
                                Your password must have:
                            </span>
                            <div class="all_rules">
                                <span
                                    :class="
                                        strongRules.minChar
                                            ? 'icon-check'
                                            : 'icon-error'
                                    "
                                >
                                    Minimum 8 characters
                                </span>
                                <span
                                    :class="
                                        strongRules.lowerCase
                                            ? 'icon-check'
                                            : 'icon-error'
                                    "
                                >
                                    At least one lowercase letter
                                </span>
                                <span
                                    :class="
                                        strongRules.upperCase
                                            ? 'icon-check'
                                            : 'icon-error'
                                    "
                                >
                                    At least one uppercase letter
                                </span>
                                <span
                                    :class="
                                        strongRules.number
                                            ? 'icon-check'
                                            : 'icon-error'
                                    "
                                >
                                    At least one number
                                </span>
                                <span
                                    :class="
                                        strongRules.specialChar
                                            ? 'icon-check'
                                            : 'icon-error'
                                    "
                                >
                                    At least one special character
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
    <Alerts :message="messageAlert" :show="showMessage" v-if="showMessage" />
</template>

<script>
import { userStore } from "@/stores/token";
import RegistrosService from "@/services/registros";
import Alerts from '@/components/Alerts.vue';


export default {
    props: {
        isVisible: Boolean,
    },
    components: {
        Alerts,
    },
    data() {
        return {
            userStr: userStore(),
            showMessage: false,
            isReset: false,
            messageAlert: "",
            password: "",
            confirmPassword: "",
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
        swapIsReset() {
            this.isReset = !this.isReset;
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

            if(!this.isStrong){
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
        showAlert(message){
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

.containerDark {
    background: #0a0012e3;
    color: white;
}

.containerLight {
    background-color: #f7f7f7cd;
}

.blockForm {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 15px;
    width: 80%;
}

.fline1,
.fline2 {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

.fline2 {
    margin-top: 50px;
}

.info-item {
    display: flex;
    flex-direction: column;
    text-align: left;
    min-width: 100px; /* Ajuste conforme necessário */
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
    width: 75%;
    height: 72%;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    top: 28px;
    box-shadow:
        0 1px 2px rgba(60, 64, 67, 0.3),
        0 2px 6px 2px rgba(60, 64, 67, 0.15);
}

/* Título no canto superior esquerdo */
.title {
    font-size: 1.2em;
    margin: 0;
}

.block0 {
    display: flex;
    flex-direction: row;
    width: 102%;
    height: 98%;
}

.block1 {
    width: 20%;
    margin-top: 2%;
}

.block2 {
    display: flex;
    flex-direction: row;
    margin-left: 100px;
    width: 100%;
    justify-content: space-around;
}

.block2_pass {
    display: flex;
    flex-direction: row;
    margin-left: 100px;
    width: 90%;
    justify-content: space-around;
    align-items: center;
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

.case4 {
    display: flex;
    flex-direction: column;
}

.tableDark {
    border: 1px solid rgba(211, 210, 210, 0.703);
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
    width: 150px;
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
}

.strong_rules {
    width: 300px;
    margin-bottom: 100px;
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

<template>
    <div class="container">
        <div
            class="box"
            :class="{ containerDark: isDark, containerLight: !isDark }"
        >
            <h1 class="title">User Information</h1>
            <div class="block0">
                <div class="block1">
                    <button class="sidebar-button">Reset Password</button>
                    <button class="sidebar-button" id="bClose">Close</button>
                </div>

                <div class="block2">
                    <div class="blockForm">
                        <div
                            class="fline1"
                            :class="{ blockDark: isDark, blockLight: !isDark }"
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
        </div>
    </div>
</template>

<script>
import { userStore } from "@/stores/token";
export default {
    props: {
        isVisible: Boolean,
    },
    data() {
        return {
            userStr: userStore(),
        };
    },
    methods: {},
    mounted() {},
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
    flex-direction: column;
    margin-left: 8%;
    width: 67%;
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

.blockForm {
    margin-bottom: 15px;
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

.sidebar-button:hover {
    background-color: #5c0ea3;
}

label {
    margin-bottom: 5px;
}

input,
select {
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

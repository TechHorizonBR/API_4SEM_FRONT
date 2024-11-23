<template>
  <div class="container">
    <div class="box">
      <h1 class="title">User System Manager</h1>
      <div class="block0">
        <div class="block1">
          <button @click="findUser" class="sidebar-button">
            Find By Username
          </button>
          <button @click="createUser" class="sidebar-button">
            Create User
          </button>
          <button @click="closeAddUser" class="sidebar-button" id="bClose">
            Close
          </button>
        </div>

        <div class="block2">
          <div class="blockForm">
            <div class="fline1">
              <div class="case1">
                <label for="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Type the username"
                  v-model="user.username"
                />
              </div>
              <div class="case2">
                <label for="role">Role:</label>
                <select id="role" v-model="user.role">
                  <option disabled selected>Select One Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>

            <div class="fline2">
              <div class="case3">
                <label for="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Type the password"
                  v-model="user.password"
                />
              </div>
              <div class="case3">
                <label for="confirm-password">Confirm the Password:</label>
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm the password"
                  v-model="confirmPassword"
                />
              </div>
            </div>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Role</th>
                  <th>CreatedAt</th>
                  <th>ModifiedAt</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.username">
                  <td>{{ user.username }}</td>
                  <td>{{ user.password }}</td>
                  <td>{{ user.role }}</td>
                  <td>{{ user.CreatedAt }}</td>
                  <td>{{ user.ModifiedAt }}</td>
                  <td><button @click="deleteUser(user.username)">Remover</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/services/axiosConfig.ts';
export default {
  props: {
    isVisible: Boolean,
  },
  data() {
    return {
      user: {
        username: "",
        password: "",
        role: "",
      },
      confirmPassword: "",
    };
  },
  methods: {
    async deleteUser(username) {
      if (!confirm(`Are you sure you want to remove user "${username}"?`)) {
        return;
      }

      try {
        await apiClient.delete(`/usersys/delete/${username}`);
        alert(`User "${username}" removed successfully!`);

        this.users = this.users.filter((user) => user.username !== username);
      } catch (error) {
        console.error("Error deleting user:", error);

        if (error.response && error.response.status === 401) {
          alert("Unauthorized! Please check your credentials.");
        } else if (error.response && error.response.status === 404) {
          alert(`User "${username}" not found.`);
        } else {
          alert("Failed to delete user. Please try again.");
        }
      }
    },
    async createUser() {
      if (this.user.password !== this.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      if (!this.user.username || !this.user.password || !this.user.role) {
        alert("All fields are required!");
        return;
      }

      try {
        const response = await apiClient.post("/usersys/create", this.user);
        alert("User created successfully!");

        this.resetForm();
      } catch (error) {
        console.error("Error creating user:", error);

        if (error.response && error.response.status === 401) {
          alert("Unauthorized! Please check your credentials.");
        } else {
          alert("Failed to create user. Please try again.");
        }
      }
    },
    resetForm() {
      this.user = {
        username: "",
        password: "",
        role: "",
      };
      this.confirmPassword = "";
    },
  },
    closeAddUser() {},
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

.fline1,
.fline2 {
  display: grid;
  grid-template-columns: 2fr 2fr;
  gap: 2rem;
  margin-bottom: 2%;
  margin-top: 3%;
}

.box {
  width: 75%;
  height: 72%;
  background-color: #f7f7f7cd;
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
  border: 1px solid rgba(0, 0, 0, 0.05);
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
  margin-top: 135%;
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

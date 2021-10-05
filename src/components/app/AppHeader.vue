<template>
  <div class="__appHeader">
    <div class="__heading">
      Not DOORS
    </div>
    <div
      class="__user"
      @click="showLogin = true"
    >
      <div
        v-if="activeUser"
        class="__name"
      >
        {{ activeUser.displayName }}
      </div>
      <div
        v-if="activeUser"
        class="__icon"
      >
        <img :src="activeUser.photoURL">
      </div>
      <div
        v-if="!activeUser"
        class="__login"
      >
        Login
      </div>
      <div
        v-if="!activeUser"
        class="__icon"
      >
        <span class="material-icons-outlined">account_circle</span>
      </div>
    </div>
  </div>
  <Modal
    v-if="showLogin"
    @close="showLogin = false"
  >
    <template #body>
      <UserLogin />
    </template>
  </Modal>
</template>

<script>
import UserLogin from '@/components/UserLogin'
import { mapState } from 'vuex'

export default {
  name: 'AppHeader',
  components: {
    UserLogin
  },
  data: function () {
    return {
      showLogin: this.activeUser !== null
    }
  },
  computed: {
    ...mapState('users', ['activeUser'])
  }
}
</script>

<style scoped>
.__appHeader {
  position: relative;
  height: 2rem;
  width: 100%;
  padding: 0 1rem;
  text-align: center;
  background-color: var(--bg-dark2);
}

.__heading {
  font-size: 1rem;
  font-weight: bold;
  line-height: 2rem;
  color: var(--text-light1);
}

.__user {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0 1rem;
  height: 100%;
}

.__user:hover {
  background-color: var(--hover);
  cursor: pointer;
}

.__user > div {
  display: inline-block;
  line-height: 2.1rem;
  font-size: 1rem;
  font-weight: bold;
  vertical-align: top;
  height: 100%;
}

.__icon > img {
  width: 1.5rem;
  margin-left: 1rem;
  height: 100%;
}

.__icon > span {
  line-height: inherit;
  margin-left: 1rem;
}
</style>

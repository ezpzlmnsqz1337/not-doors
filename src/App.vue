<template>
  <AppHeader />
  <AppContent />
  <ActionList />
</template>

<script>
import AppHeader from '@/components/app/AppHeader'
import AppContent from '@/components/app/AppContent'
import ActionList from '@/components/action-list/ActionList'
import { mapActions } from 'vuex'
import { unsubscribeAll } from '@/vuex-firestore-binding'
import { getAuth, onAuthStateChanged } from '@firebase/auth'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppContent,
    ActionList
  },
  mounted: function () {
    const auth = getAuth()
    onAuthStateChanged(auth, () => {
      if (auth.currentUser) {
        this.bindProjects()
        this.bindFolders()
        this.bindDocuments()
        this.bindObjects()
        this.bindColumns()
      } else {
        unsubscribeAll()
      }
    })
    this.bindUsers()
  },
  unmounted: function () {
    unsubscribeAll()
  },
  methods: {
    ...mapActions('objects', ['bindObjects']),
    ...mapActions('documents', ['bindDocuments']),
    ...mapActions('folders', ['bindFolders']),
    ...mapActions('projects', ['bindProjects']),
    ...mapActions('columns', ['bindColumns']),
    ...mapActions('users', ['bindUsers'])
  }
}
</script>

<style>
:root {
  --hover: #2970b6;
  --active: #205b95;
  --text-light1: #ffffff;
  --text-light2: gray;
  --text-dark1: #242424;
  --bg-dark1: #8b8b8b;
  --bg-dark2: #5d5d5d;
  --bg-dark3: #424242;
  --bg-dark4: #3a3a3a;
  --bg-dark5: #242424;
  --bg-light1: #ffffff;
  --bg-light2: #a0a0a0;
  --bg-light3: #707070;
  --border-light1: #ffffff;
  --border-dark1: #424242;
  --anchor: #2183df;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-light1);
  font-size: 12px;
  margin-top: 0;
}

input[type=text], input[type=password], input[type=email] {
  padding: 0.5rem;
  border-radius: 0.3rem;
  border: none;
}

a {
  color: var(--anchor);
}

/* custom scrollbar overrides */
.ps .ps__rail-x:hover, .ps .ps__rail-y:hover, .ps .ps__rail-x:focus, .ps .ps__rail-y:focus, .ps .ps__rail-x.ps--clicking, .ps .ps__rail-y.ps--clicking {
  background-color: transparent !important;
}

.ps__rail-y:hover > .ps__thumb-y, .ps__rail-y:focus > .ps__thumb-y, .ps__rail-y.ps--clicking .ps__thumb-y {
  width: 7px !important;
}
</style>

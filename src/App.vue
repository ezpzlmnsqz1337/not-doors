<template>
  <AppHeader />
  <AppContent />
</template>

<script>
import AppHeader from '@/components/app/AppHeader'
import AppContent from '@/components/app/AppContent'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppContent
  }
}
</script>

<style>
:root {
  --hover: #2970b6;
  --active: #205b95;
  --text-light1: #ffffff;
  --text-light2: gray;
  --text-dark: #ffffff;
  --bg-dark1: #8b8b8b;
  --bg-dark2: #5d5d5d;
  --bg-dark3: #424242;
  --bg-dark4: #3a3a3a;
  --bg-dark5: #242424;
  --bg-light1: #ffffff;
  --bg-light2: #a0a0a0;
  --bg-light3: #707070;
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

.ps .ps__rail-x:hover, .ps .ps__rail-y:hover, .ps .ps__rail-x:focus, .ps .ps__rail-y:focus, .ps .ps__rail-x.ps--clicking, .ps .ps__rail-y.ps--clicking {
  background-color: transparent !important;
}

.ps__rail-y:hover > .ps__thumb-y, .ps__rail-y:focus > .ps__thumb-y, .ps__rail-y.ps--clicking .ps__thumb-y {
  width: 7px !important;
}
</style>

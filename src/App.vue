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
  color: white;
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

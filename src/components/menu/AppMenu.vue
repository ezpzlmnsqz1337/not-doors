<template>
  <div class="__appMenu">
    <div class="__item">Projects</div>
    <div class="__item">Content</div>
  </div>
</template>

<script>
export default {
  name: 'AppMenu'
}
</script>

<style scoped>
.__appMenu {
  position: fixed;
  top: 2rem;
  left: 0;
  bottom: 0;
  width: 4rem;
  background-color: #5d5d5d;
}

.__item {
  width: 100%;
  height: 3rem;
  line-height: 3rem;
  color: white;
}

.__item:hover{
  background-color: #2970b6;
  cursor: pointer;
}

.__item.active {
  background-color: #1a5b9c;
}
</style>

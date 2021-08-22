<template>
  <div class="__appMenu">
    <div class="__item" :class="{__selected: activeMenuContent === 'projects'}" @click="toggle('projects')">Projects</div>
    <div class="__item"  :class="{__selected: activeMenuContent === 'content'}" @click="toggle('content')">Content</div>
  </div>
</template>

<script>
export default {
  name: 'AppMenu',
  methods: {
    toggle: function (type) {
      const active = this.$store.state.activeMenuContent === type ? null : type
      this.$store.setActiveMenuContent(active)
    }
  },
  computed: {
    activeMenuContent: function () {
      return this.$store.state.activeMenuContent
    }
  }
}
</script>

<style scoped>
.__appMenu {
  width: 4rem;
  background-color: #5d5d5d;
  text-align: center;
}

.__item {
  width: 100%;
  height: 3rem;
  line-height: 3rem;
  color: white;
}

.__item:hover, .__item.__selected:hover {
  background-color: #2970b6;
  cursor: pointer;
}

.__item.__selected {
  background-color: #424242;
}
</style>

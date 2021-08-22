<template>
  <div class="__appMenu">
    <div class="__item" v-for="i in items" :key="`item${i.name}`" :class="getItemClass(i.id)" @click="toggle(i.id)">
      <span class="material-icons" :title="i.name">{{ i.icon }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppMenu',
  methods: {
    toggle: function (itemId) {
      const active = this.$store.state.activeMenuContent === itemId ? null : itemId
      this.$store.setActiveMenuContent(active)
    },
    getItemClass (activeItem) {
      return {
        __selected: this.activeMenuContent === activeItem
      }
    }
  },
  computed: {
    items: function () {
      return this.$store.state.menuItems.filter(x => x.activeDocument ? this.$store.state.activeDocument : true)
    },
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
  user-select: none;
  width: 100%;
  height: 3rem;
  color: white;
}

.__item > span {
  line-height: 3rem;
  font-size: 1.5rem;
}

.__item:hover, .__item.__selected:hover {
  background-color: #2970b6;
  cursor: pointer;
}

.__item.__selected {
  background-color: #424242;
}
</style>

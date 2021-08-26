<template>
  <div class="__appMenu">
    <div
      v-for="i in items"
      :key="`item${i.name}`"
      class="__item"
      :class="getItemClass(i.id)"
      @click="toggle(i.id)"
    >
      <span
        class="material-icons"
        :title="i.name"
      >{{ i.icon }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppMenu',
  computed: {
    items: function () {
      return this.$store.state.menuItems.filter(x => x.activeDocument ? this.$store.state.activeDocument : true)
    },
    activeMenuContent: function () {
      return this.$store.state.activeMenuContent
    }
  },
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
  }
}
</script>

<style scoped>
.__appMenu {
  width: 3rem;
  background-color: var(--bg-dark2);
  text-align: center;
}

.__item {
  user-select: none;
  width: 100%;
  height: 3rem;
  color: var(--text-light1);
}

.__item > span {
  line-height: 3rem;
  font-size: 1.5rem;
}

.__item:hover, .__item.__selected:hover {
  background-color: var(--hover);
  cursor: pointer;
}

.__item.__selected {
  background-color: var(--bg-dark4);
}
</style>

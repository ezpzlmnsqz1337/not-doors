<template>
  <div class="__appMenu">
    <div
      v-for="i in items"
      :key="`item${i.name}`"
      class="__item"
      :class="getItemClass(i)"
      @click="toggle(i)"
    >
      <span
        class="material-icons"
        :title="i.name"
      >{{ i.icon }}</span>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'AppMenu',
  computed: {
    ...mapState('documents', ['activeDocument']),
    ...mapState(['activeMenuContent', 'menuItems']),
    items: function () {
      return this.menuItems.filter(x => x.activeDocument ? this.activeDocument : true)
    }
  },
  methods: {
    ...mapMutations(['setActiveMenuContent']),
    toggle: function ({ id }) {
      const active = this.activeMenuContent === id ? null : id
      this.setActiveMenuContent({ type: active })
    },
    getItemClass ({ id }) {
      return {
        __selected: this.activeMenuContent === id
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

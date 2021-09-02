<template>
  <div
    v-if="showActionList"
    class="__wrapper"
  >
    <div class="__actionList">
      <div class="__filter">
        <input
          v-model="filter"
          type="text"
        >
      </div>
      <div
        v-for="(a, index) in actionList"
        :key="index"
        class="__item"
        :class="{__active: index === selectedIndex}"
      >
        {{ a.name }}
      </div>
    </div>
  </div>
</template>

<script>
import Key from '@/constants/Key'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'ActionList',
  data: function () {
    return {
      filter: '',
      selectedIndex: 0
    }
  },
  computed: {
    ...mapState(['actionList']),
    ...mapState('documents', ['documents']),
    showActionList: function () {
      return this.actionList.length > 0
    }
  },
  created: function () {
    document.addEventListener('keydown', e => this.handleKeyDown(e))
  },
  methods: {
    ...mapMutations(['setActionList']),
    ...mapMutations('documents', ['openDocument']),
    handleKeyDown: function (e) {
      if (e.keyCode === Key.KEY_E) this.handleOpenDocument(e)
      if (!this.showActionList) return

      switch (e.keyCode) {
        case Key.ESCAPE: this.closeActionList()
          break
        case Key.ENTER: this.selectItem()
          break
        case Key.ARROW_UP: this.moveUp()
          break
        case Key.ARROW_DOWN: this.moveDown()
          break
      }
    },
    closeActionList: function () {
      this.setActionList({ actions: [] })
    },
    selectItem: function () {
      this.actionList.at(this.selectedIndex).action()
      this.closeActionList()
    },
    moveDown: function () {
      this.selectedIndex = (this.selectedIndex + 1) % (this.actionList.length + 1)
    },
    moveUp: function () {
      this.selectedIndex = (this.selectedIndex - 1) < 0 ? this.actionList.length : (this.selectedIndex - 1)
    },
    handleOpenDocument: function (e) {
      e.preventDefault()
      if (!e.ctrlKey) return
      const al = this.documents.map(x => ({ name: x.name, action: () => this.openDocument({ document: x }) }))
      console.log(al)
      this.setActionList({ actions: al })
    }
  }
}
</script>

<style scoped>
.__wrapper {
  width: 100%;
  position: absolute;
}

.__actionList {
  width: 20rem;
  margin: 0 auto;
  background-color: var(--bg-dark3);
  color: var(--text-light1);
  padding: 0.3rem;
}

.__filter {
  display: flex;
}

.__filter > input{
  flex: 1;
  background-color: var(--bg-dark1);
  color: var(--text-white);
}

.__item {
  line-height: 2rem;
  padding: 0 0.5rem;
}

.__item.__active {
  background-color: var(--active);
}

.__item:hover {
  background-color: var(--hover);
}
</style>

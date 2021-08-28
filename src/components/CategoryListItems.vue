<template>
  <div
    v-for="c in categories"
    :key="`category${c.uid}`"
    class="__item"
    :class="{__bold: bold}"
    @click.stop="toggleCategory({[categoryKey]: c})"
  >
    <div
      class="__category"
      :style="`padding-left: ${level}rem`"
    >
      <span
        class="__arrow"
        :class="{__open: openCategories.includes(c)}"
      >&#8250;</span>
      <span
        v-if="!showCategoryRenameInput || (c.uid !== category.uid)"
        class="__name"
      >{{ c.name }}</span>
      <input
        v-show="showCategoryRenameInput && c.uid === category.uid"
        ref="rename"
        v-model="categoryName"
        class="__rename"
        type="text"
        @keydown="handleKeyDownCategoryRename($event)"
        @click.stop
      >
      <div class="__controls">
        <span
          class="material-icons __control"
          @click.stop="showCategoryRename(true, c)"
        >edit</span>
        <span
          class="material-icons __control"
          @click.stop="onRemove({[categoryKey]: c})"
        >delete</span>
        <span
          class="material-icons __control"
          @click.stop="showSubcategoryTemplate(true, c)"
        >add_box</span>
      </div>
    </div>
    <div
      v-show="showSubcategoryTemplateInput && c.uid === category.uid"
      class="__template"
    >
      <input
        ref="name"
        v-model="subcategoryName"
        type="text"
        @keydown="handleKeyDownSubcategoryCreate($event)"
        @click.stop
      >
      <span
        class="material-icons __control"
        @click.stop="addSubcategory(category)"
      >done</span>
      <span
        class="material-icons __control"
        @click.stop="showSubcategoryTemplate(false)"
      >close</span>
    </div>
    <slot :[categoryKey]="c" />
  </div>
</template>

<script>
import Key from '@/constants/Key'

export default {
  name: 'CategoryListItems',
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    categoryKey: {
      type: String,
      default: 'category'
    },
    openCategories: {
      type: Array,
      default: () => []
    },
    openCategory: {
      type: Function,
      default: () => console.log('openCategory')
    },
    toggleCategory: {
      type: Function,
      default: () => console.log('toggleCategory')
    },
    onRename: {
      type: Function,
      default: () => console.log('onRename')
    },
    onRemove: {
      type: Function,
      default: () => console.log('onRemove')
    },
    onAdd: {
      type: Function,
      default: () => console.log('onAdd')
    },
    bold: {
      type: Boolean,
      default: false
    },
    level: {
      type: Number,
      default: 1
    }
  },
  data: function () {
    return {
      showCategoryRenameInput: false,
      categoryName: '',
      category: {},
      showSubcategoryTemplateInput: false,
      subcategoryName: 'Name'
    }
  },
  methods: {
    showCategoryRename (show, category) {
      this.showCategoryRename = show
      if (show) {
        this.category = category
        this.categoryName = category.name
        this.$nextTick(() =>
          this.$refs.rename.select()
        )
      }
    },
    renameCategory (category, name) {
      this.onRename({ [this.categoryKey]: category, name })
      this.showCategoryRename = false
      this.category = {}
      this.categoryName = ''
    },
    handleKeyDownCategoryRename: function (e) {
      if (e.keyCode === Key.ENTER) this.renameCategory(this.category, this.categoryName)
      if (e.keyCode === Key.ESCAPE) this.showCategoryRenameInput(false)
    },
    handleKeyDownSubcategoryCreate: function (e) {
      if (e.keyCode === Key.ENTER) this.addSubcategory(this.category)
      if (e.keyCode === Key.ESCAPE) this.showSubcategoryTemplate(false)
    },
    showSubcategoryTemplate: function (show, category) {
      this.category = category
      this.showSubcategoryTemplateInput = show
      if (show) {
        this.$nextTick(() =>
          this.$refs.name.select()
        )
      }
    },
    addSubcategory: function (category) {
      this.onAdd({ parent: category, name: this.subcategoryName })
      this.openCategory({ [this.categoryKey]: category })
      this.subcategoryName = 'Name'
      this.showSubcategoryTemplateInput = false
    }
  }
}
</script>

<style scoped>
.__item {
  color: var(--text-light1);
  line-height: 2rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: normal;
}

.__item.__bold {
  font-weight: bold;
}

.__category {
  display: flex;
  justify-content: flex-end;
  padding: 0 1rem;
}

.__category:hover{
  background-color: var(--hover);
}

.__category .__name {
  flex: 1;
}

.__category:hover .__controls {
  visibility: visible;
}

.__controls {
  visibility: hidden;
  display: flex;
  justify-content: flex-end;
  padding: 0.2rem 0;
}

.__controls > .__heading {
  flex: 1;
  line-height: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
}

.__control:hover {
  cursor: pointer;
  border-radius: 0.2rem;
  color: var(--text-light2);
  background-color: var(--hover);
}

.__template {
  display: flex;
  padding: 0 1rem 0 2rem;
}

.__template > input {
  flex: 1;
  margin-right: 0.5rem;
}

.__arrow {
  flex: 0;
  transition: transform 0.2s;
  transform: rotate(0);
  display: inline-block;
  margin-right: 0.3rem;
}

.__arrow.__open{
  transform: rotate(90deg);
}

.__rename {
  flex: 1;
}
</style>

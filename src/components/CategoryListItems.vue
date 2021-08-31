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
      <div class="__heading">
        <div
          v-if="!showCategoryRenameInput || (c.uid !== category.uid)"
          class="__row"
        >
          <span
            class="__arrow"
            :class="{__open: openCategories.includes(c.uid)}"
          >&#8250;</span>
          <span
            v-if="categoryIcon"
            class="material-icons"
          >{{ categoryIcon }}</span>
          <span>{{ c.name }}</span>
        </div>
        <input
          v-show="showCategoryRenameInput && c.uid === category.uid"
          ref="rename"
          v-model="categoryRename"
          type="text"
          @keydown="handleKeyDownCategoryRename($event)"
          @click.stop
        >
      </div>
      <div
        v-show="!showCategoryRenameInput"
        class="__controls"
      >
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
        >{{ addSubcategoryIcon }}</span>
        <span
          v-if="nested"
          class="material-icons __control"
          @click.stop="showCategoryTemplate(true, c)"
        >{{ addCategoryIcon }}</span>
      </div>
    </div>
    <!-- new category template -->
    <div
      v-show="showCategoryTemplateInput && c.uid === category.uid"
      class="__template"
    >
      <input
        ref="categoryName"
        v-model="categoryName"
        type="text"
        @keydown="handleKeyDownCategoryCreate($event)"
        @click.stop
      >
      <span
        class="material-icons __control"
        @click.stop="addCategory(category)"
      >done</span>
      <span
        class="material-icons __control"
        @click.stop="showCategoryTemplate(false)"
      >close</span>
    </div>
    <!-- new subcategory template -->
    <div
      v-show="showSubcategoryTemplateInput && c.uid === category.uid"
      class="__template"
    >
      <input
        ref="subcategoryName"
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
    onCategoryAdd: {
      type: Function,
      default: () => console.log('onCategoryAdd')
    },
    onSubcategoryAdd: {
      type: Function,
      default: () => console.log('onSubcategoryAdd')
    },
    categoryIcon: {
      type: String,
      default: ''
    },
    addCategoryIcon: {
      type: String,
      default: 'add_box'
    },
    addSubcategoryIcon: {
      type: String,
      default: 'create_new_folder'
    },
    bold: {
      type: Boolean,
      default: false
    },
    level: {
      type: Number,
      default: 1
    },
    nested: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      showCategoryRenameInput: false,
      categoryRename: '',
      category: {},
      showCategoryTemplateInput: false,
      categoryName: 'CategoryName',
      showSubcategoryTemplateInput: false,
      subcategoryName: 'SubcategoryName'
    }
  },
  methods: {
    handleKeyDownCategoryRename: function (e) {
      if (e.keyCode === Key.ENTER) this.renameCategory(this.category, this.categoryRename)
      if (e.keyCode === Key.ESCAPE) this.showCategoryRename(false)
    },
    handleKeyDownCategoryCreate: function (e) {
      if (e.keyCode === Key.ENTER) this.addCategory(this.category)
      if (e.keyCode === Key.ESCAPE) this.showCategoryTemplate(false)
    },
    handleKeyDownSubcategoryCreate: function (e) {
      if (e.keyCode === Key.ENTER) this.addSubcategory(this.category)
      if (e.keyCode === Key.ESCAPE) this.showSubcategoryTemplate(false)
    },
    showCategoryRename (show, category) {
      this.showCategoryRenameInput = show
      if (show) {
        this.category = category
        this.categoryRename = category.name
        this.$nextTick(() =>
          this.$refs.rename.select()
        )
      }
    },
    renameCategory (category, name) {
      this.onRename({ [this.categoryKey]: category, name })
      this.showCategoryRenameInput = false
      this.category = {}
      this.categoryRename = ''
    },
    showCategoryTemplate: function (show, category) {
      this.category = category
      this.showCategoryTemplateInput = show
      if (show) {
        this.$nextTick(() =>
          this.$refs.categoryName.select()
        )
      }
    },
    addCategory: function (category) {
      this.onCategoryAdd({ parent: category, name: this.categoryName })
      this.openCategory({ [this.categoryKey]: category })
      this.categoryName = 'CategoryName'
      this.showCategoryTemplateInput = false
    },
    showSubcategoryTemplate: function (show, category) {
      this.category = category
      this.showSubcategoryTemplateInput = show
      if (show) {
        this.$nextTick(() =>
          this.$refs.subcategoryName.select()
        )
      }
    },
    addSubcategory: function (category) {
      this.onSubcategoryAdd({ parent: category, name: this.subcategoryName })
      this.openCategory({ [this.categoryKey]: category })
      this.subcategoryName = 'SubcategoryName'
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

.__category .__heading {
  flex: 1;
}

.__category .__row {
  display: flex;
}

.__category .__row > span.material-icons{
  line-height: 2rem;
  font-size: 1rem;
  margin-right: 0.3rem;
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
</style>

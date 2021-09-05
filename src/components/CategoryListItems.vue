<template>
  <div
    v-for="c in options.categories"
    :key="`category${c.uid}`"
    class="__item"
    :class="{__bold: options.bold, __active: options.category.isActive && options.category.isActive(c.uid)}"
    @click.stop="options.category.onToggle({[options.category.key]: c})"
  >
    <div
      class="__category"
      :style="`padding-left: ${options.level}rem`"
    >
      <div class="__heading">
        <div
          v-if="!showCategoryRenameInput || (c.uid !== category.uid)"
          class="__row"
        >
          <span
            v-if="options.category.openArray"
            class="__arrow"
            :class="{__open: options.category.openArray.includes(c.uid)}"
          >&#8250;</span>
          <span
            v-if="options.category.icon"
            class="material-icons"
          >{{ options.category.icon }}</span>
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
          @click.stop="showRemoveCategoryModal(true, c)"
        >delete</span>
        <span
          v-if="options.subcategory"
          class="material-icons __control"
          @click.stop="showSubcategoryTemplate(true, c)"
        >{{ options.subcategory.addIcon }}</span>
        <span
          v-if="options.subcategory && options.nested"
          class="material-icons __control"
          @click.stop="showCategoryTemplate(true, c)"
        >{{ options.category.addIcon }}</span>
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
      v-if="options.subcategory"
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
    <slot :[options.category.key]="c" />
  </div>
  <Modal
    v-if="showRemoveModal"
    @close="showRemoveModal = false"
  >
    <template #body>
      Do you really want to remove this item?
    </template>
    <template #footer>
      <div class="__modalButtons">
        <Button
          :type="ButtonType.DANGER"
          @click="removeCategory()"
        >
          Yes
        </Button>
        <Button
          :type="ButtonType.DEFAULT"
          @click="showRemoveCategoryModal(false)"
        >
          No
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script>
import Key from '@/constants/Key'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import ButtonType from '@/constants/ButtonType'

export default {
  name: 'CategoryListItems',
  components: {
    Modal,
    Button
  },
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data: function () {
    return {
      ButtonType,
      showRemoveModal: false,
      showCategoryRenameInput: false,
      categoryRename: '',
      category: {},
      showCategoryTemplateInput: false,
      categoryName: this.options.category.name || 'CategoryName',
      showSubcategoryTemplateInput: false,
      subcategoryName: this.options.subcategory ? this.options.subcategory.name || 'SubcategoryName' : 'SubcategoryName'
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
    showRemoveCategoryModal (show, category) {
      this.showRemoveModal = show
      this.category = show ? category : {}
    },
    removeCategory () {
      const { key, onRemove } = this.options.category
      onRemove({ [key]: this.category })
      this.showRemoveCategoryModal(false)
    },
    renameCategory (category, name) {
      const { key, onRename } = this.options.category
      onRename({ [key]: category, name })
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
      const { key, onAdd, onOpen } = this.options.category
      onAdd({ parent: category, name: this.categoryName })
      onOpen({ [key]: category })
      this.categoryName = this.options.category.name || 'CategoryName'
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
      const { key, onOpen } = this.options.category
      const { onAdd } = this.options.subcategory
      onAdd({ parent: category, name: this.subcategoryName })
      onOpen({ [key]: category })
      this.subcategoryName = this.options.subcategory ? this.options.subcategory.name || 'SubcategoryName' : 'SubcategoryName'
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

.__item.__active {
  background-color: var(--hover);
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

.__modalButtons {
  margin-top: 1rem;
  display: flex;
  justify-content: space-around;
}

.__modalButtons button{
  min-width: 5rem;
}
</style>

<template>
  <div
    class="__textField"
    @click="editText(true)"
  >
    <span
      v-if="object.isHeading"
      class="__heading"
    >
      {{ object.chapter }}.
    </span>
    <div
      v-if="!edit"
      :class="{__heading: object.isHeading}"
      class="__text"
      v-html="getText()"
    />
    <div
      v-if="edit"
      class="__trix"
      @click.stop
    >
      <input
        :id="object.uid"
        :value="getText()"
        type="hidden"
        :name="`content${object.uid}`"
      >
      <trix-editor
        ref="edit"
        :input="object.uid"
        @trix-blur="editText(false)"
        @trix-change="onChange($event)"
      />
    </div>
    <div
      v-if="parseDocumentLinks()"
      class="__documentLinks"
    >
      <div
        v-for="(dl, index) in parseDocumentLinks()"
        :key="index"
      >
        <a
          href="#"
          @click.stop="goToLink(dl)"
        >{{ dl.document.name }} {{ dl.object.id }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import 'trix'
import 'trix/dist/trix.css'
import { mapGetters, mapMutations } from 'vuex'

const linkRegex = /&lt;[\w_-]*\s{1}\d+&gt;/g

export default {
  name: 'TextField',
  props: {
    object: {
      type: Object,
      default: null
    },
    name: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      edit: false
    }
  },
  computed: {
    ...mapGetters('objects', ['getObjectByObjectId']),
    ...mapGetters('documents', ['getDocumentByName'])
  },
  methods: {
    ...mapMutations('objects', ['setObjectProperty', 'setActiveObject']),
    ...mapMutations('documents', ['openDocument']),
    parseDocumentLinks () {
      const results = this.object[this.name].match(linkRegex)
      if (!results) return false
      return results.map(x => {
        const [name, id] = x.replace('&lt;', '').replace('&gt;', '')
          .split(' ')
        const document = this.getDocumentByName(name)
        if (!document) return false
        const object = this.getObjectByObjectId(document.uid, parseInt(id))
        if (!object) return false
        return {
          document,
          object
        }
      }).filter(x => x)
    },
    goToLink ({ document, object }) {
      this.openDocument({ document })
      this.setActiveObject({ object })
    },
    getText () {
      return this.object[this.name]
    },
    onChange (e) {
      this.setObjectProperty({ object: this.object, key: this.name, value: e.target.value })
    },
    editText (edit) {
      this.edit = edit
      if (edit) this.$nextTick(() => this.$refs.edit.focus())
    }
  }
}
</script>

<style>
.__textField {
  display: flex;
}

.__textField .__heading {
  font-size: 1rem;
  font-weight: bold;
}

.__textField .__text {
  flex: 3;
}

.__textField a {
  color: white;
}

.__textField a:hover {
  font-weight: bold;
}

.__textField .__documentLinks{
  flex: 1;
  text-align: center;
}

.__textField .__trix {
  flex: 1;
}

.__textField .__trix .trix-button-group {
  background-color: var(--bg-light1);
}

.__textField .__trix trix-editor {
  background-color: var(--bg-light1);
  color: black;
  cursor: text;
}

.__textField .__trix .trix-button-group--file-tools{
  display: none;
}
</style>

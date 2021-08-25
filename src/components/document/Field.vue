<template>
  <div class="__field">
    <TextField
      v-if="column.type === 'string'"
      :object="object"
      :name="column.name"
    />
    <NumberField
      v-if="column.type === 'number'"
      :object="object"
      :name="column.name"
    />
    <EnumField
      v-if="column.type === 'enum'"
      :object="object"
      :name="column.name"
      :values="column.values"
      :multiple="column.multiple"
    />
  </div>
</template>

<script>
import NumberField from '@/components/document/NumberField'
import EnumField from '@/components/document/EnumField'
import TextField from '@/components/document/TextField'

export default {
  name: 'Field',
  components: {
    NumberField,
    EnumField,
    TextField
  },
  props: {
    object: {
      type: Object,
      default: null
    },
    column: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped>
.__field{
  cursor: pointer;
  padding: 0.2rem 0.7rem;
}

.__field label:hover, .__field input:hover {
  cursor: pointer;
  color: #a4a4a4;
}

.__field:hover input, .__field:hover label{

}

.__enum input, .__enum label {
  display: none;
}

.__enum:hover input, .__enum:hover label {
  display: inherit;
}

.__enum > .__show > label {
  display: inherit;
}

.__noBreak{
  white-space: nowrap;
}

.__bold {
  font-weight: bold;
}

.__textarea {
  outline: none;
  background-color: #e6e6e6;
  width: 100%;
  border: none;
  resize: vertical;
  overflow: hidden;
}
</style>

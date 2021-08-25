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
</style>

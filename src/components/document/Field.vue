<template>
  <div class="__field">
    <TextField
      v-if="column.type === ColumnType.TEXT"
      :object="object"
      :name="column.name"
    />
    <NumberField
      v-if="column.type === ColumnType.NUMBER"
      :object="object"
      :name="column.name"
    />
    <EnumField
      v-if="column.type === ColumnType.ENUM"
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
import ColumnType from '@/constants/ColumnType'

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
  },
  data () {
    return {
      ColumnType
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

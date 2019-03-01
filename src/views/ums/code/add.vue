<template> 
  <code-detail :is-edit='false'></code-detail>
</template>
<script>
  import CodeDetail from './components/codeDetail'
  export default {
    name: 'addCode',
    components: { CodeDetail }
  }
</script>
<style>
</style>

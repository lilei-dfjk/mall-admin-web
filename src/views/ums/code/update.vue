<template> 
  <code-detail :is-edit='true'></code-detail>
</template>
<script>
  import CodeDetail from './components/codeDetail'
  export default {
    name: 'updateCode',
    components: { CodeDetail }
  }
</script>
<style>
</style>

<template> 
  <logicsRule-detail :is-edit='false'></logicsRule-detail>
</template>
<script>
  import LogicsRuleDetail from './components/logicsRuleDetail'
  export default {
    name: 'addLogicsRule',
    components: { LogicsRuleDetail }
  }
</script>
<style>
</style>

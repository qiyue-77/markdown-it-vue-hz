<template>
  <div id="app">
    <example />
  </div>
</template>

<script>
import Example from './components/example.vue'

export default {
  name: 'app',
  components: {
    Example
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: auto;
}
</style>

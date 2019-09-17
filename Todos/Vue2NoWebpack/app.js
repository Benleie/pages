var app = new Vue({
  el: '#root',
  data: {
    input: '# hello'
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.input, { sanitize: true })
    }
  },
  methods: {
    update: _.debounce(function (e) {
      console.log(e.target)
      this.input = e.target.value
    }, 300)
  }
})
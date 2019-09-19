
let Item = {
  template:'#Item',
  props:{
      todo: { 
          type:Object,
          required:true   
      }
  },
  methods:{
      deleteToDo(){
          console.log(this)
          this.$emit('del', this.todo.id)
      }
  }
}

let Tabs = {
  template:"#Tab",
  props:{
      filter: {
          type: String,
          required: true
      },
      todos: {
          type: Array,
          required: true
      }
  },
  computed: {
      uncompletedTodoLength(){
          return this.todos.filter(todo => !todo.completed).length
      }
  },
  data() {
      return {
          states: ['all', 'active',   'completed']
      }
  },
  methods: {
      toggleFilter(state){
          console.log(this)
          this.$emit("toggleTabs", state)
      },
      clearAllCompleted() { this.$emit('clearAll') } 
  }
}

let id = 0;

//全局注册组件

Vue.component('Tabs',Tabs)
Vue.component('Item',Item)

var app = new Vue({
  el: '#app',
  // 局部注册组件  失败。。
  /*components: { 
    'Tabs': Tabs 
  },
  hhh: {
    Tabs
  },*/
  data: {
    todos: [],
    filter: "all"
  },
  
  computed: {
      filteredTodos() {
          if (this.filter === 'all')  return this.todos
          const completed = this.filter === 'completed'
          return this.todos.filter(todo => completed === todo.completed)
          }
      },
  methods:{
      addTodo(e) {
          console.log(e.target.value);
          this.todos.unshift({
              id: id++,
              content: e.target.value.trim(),
              completed: false
          })
          e.target.value = '';
      },
      deleteTodo(id){
          this.todos.splice(this.todos.findIndex(todo => todo.id === id) ,1)
      },
      toggleFilter(state) {
          this.filter = state
      },
      clearAllCompleted(){
          this.todos = this.todos.filter(todo => !todo.completed)
      }

  }

})
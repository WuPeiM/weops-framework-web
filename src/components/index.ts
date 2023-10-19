import container from './container.vue'

const components = [
    container
]

const install = function(Vue) {
    components.forEach(component => {
        Vue.component(component.name, component)
    })
}

export default install

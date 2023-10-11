# 开发示例指引

## 在projects目录下创建您的第一个子应用example

### example目录 （src/projects/example）
```markdown
├── api # 请求
│    ├── modules # api模块管理
│    │    ├── example.ts # 自定义api模块
│    ├── index.ts # 统一引入api模块
├── assets # 静态文件
│    ├── svg # 例如图片文件
├── router # 路由
│    ├── frameRouter.ts # 自定义路由
├── store  # vuex
│    ├── modules # store模块管理
│    |    ├── example.ts # 自定义store模块
│    ├── index.ts # 统一引入store模块
├── views # vue文件
│    ├── index.vue # example的首页
└── main.ts # 入口 加载组件 自定义指令 初始化等
```
### example目录文件内容示例
``` js
//  api/modules/example.ts
import { get, post } from '@/api/axiosconfig/axiosconfig'

const mockUrl = 'http://yapi.canway.top/mock/1273' // 你可以使用yapi进行mock数据

export default {
    getList(params = {}) {
        return get(`${mockUrl}/example/list/`, params)
    },
    modifyList(params = {}) {
        return post(`${mockUrl}/example/list/`, params)
    }
}
```
``` js
//  api/index.ts
import example from './modules/example'

const exampleBaseApi = {
    example
}

export default exampleBaseApi
```
``` js
// router/frameRouter.ts

// 引入页面
const Example = () => import('@example/views/index.vue')

const routerPrefix = 'example'

export const frameRouter = [
    {
        path: `/${routerPrefix}/index`,
        name: 'Example',
        component: Example,
        meta: {
            title: '子应用首页'
        }
    }
]

// 子应用入口，主框架会找到该文件的路由配置，合并到主框架中
export const adminRouteConfig = [
    {
        // 相当于一级菜单
        name: '子应用',
        id: 'ExampleApp',
        // children数组相当于二级菜单，可配置多个对象
        children: [
            {
                name: '子应用首页',
                // id需要与上面frameRouter的name一致
                id: 'Example'
            }
        ]
    }
]

export const createAdminRouteConfig = () => adminRouteConfig
```
``` js
//  store/modules/example.ts
// initial state
const state = {
    list: [{'message': '我是信息'}]
}

// getters
const getters = {
    //
}

// mutations
const mutations = {
    setList(state, newData) {
        state.list = newData
    }
}

// actions
const actions = {
    updateList({ commit }, newData) {
        commit('setList', newData)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
```
``` js
//  store/index.ts
import example from './modules/example'

export default {
    example
}
```
``` js
//  views/index.vue
<template>
    <div class="example-wrapper" v-bkloading="{ isLoading: loading, zIndex: 10 }">
        <div class="example-wrapper-content">
            {{msg}}
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState, mapActions } from 'vuex'

@Component({
    components: {},
    computed: {
        ...mapState('example', { list: 'list' })
    },
    methods: {
        ...mapActions('example', { updateList: 'updateList' })
    }
})

export default class Example extends Vue {
    loading: boolean = false

    created() {
        this.getDetail()
    }

    get msg() {
        return this.list?.[0]?.message || '--'
    }

    async getDetail() {
        const { id } = this.$route.query
        this.loading = true
        try {
            const res = await this.$api.example.getList({ id })
            if (!res.result) {
                return this.$error(res.message)
            }
            this.updateList(res.data)
        } finally {
            this.loading = false
        }
    }
}
</script>

<style  lang="scss" scoped>
.example-wrapper {
    background: #fff;
    height: 100%;

    .example-wrapper-content {
        color: #000;
    }
}
</style>
```
``` js
//  main.ts
// 公共方法
import '../../controller/func/common'

```
### 服务启动及打包
``` js
# 服务启动
npm run dev

# 服务打包
npm run build:micro
```

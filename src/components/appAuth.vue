<template>
    <div class="cw-login-dialog" v-if="isShow">
        <div class="cw-login-wrapper">
            <iframe id="iframeBox" :src="loginUrl" scrolling="no" border="0" :width="width" :height="height" @load="onLoad"></iframe>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'

    @Component({})
    export default class AppAuth extends Vue {
        width: number = 400
        height: number = 400
        loginUrl: string = ''
        isShow: boolean = false

        hideLoginModal() {
            this.isShow = false
        }

        showLoginModal({ login_url: loginUrl, width = 400, height = 400 }) {
            this.loginUrl = loginUrl
            this.width = width
            this.height = height

            // setTimeout(() => {
            //     this.isShow = true
            // }, 300)
        }

        onLoad() {
            const iframeBox = document.getElementById('iframeBox')
            // 获取iframe html文件
            const doc = iframeBox.contentWindow.document
            // 获取body对象
            const body = doc.getElementsByTagName('body').item(0)
            const aStyle = doc.createElement('style') // 创建style标签对象
            aStyle.rel = 'stylesheet'
            aStyle.type = 'text/css'
            aStyle.id = 'Astyle' // 定义对象的一些属性
            body.appendChild(aStyle) // 向body对象中插入style标签对象
            aStyle.sheet.insertRule('.page-content .login-img { display: none }', 0)
        }
    }
</script>

<style scoped lang="scss">
.cw-login-dialog {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999999999;
    background: rgba(0, 0, 0, .7);
    .cw-login-wrapper {
        display: inline-block;
        border: 0;
        width: 620px;
        height: 400px;
        background: #fff;
        padding-right: 5px;
        margin: -225px auto auto -225px;
        top: 50%;
        left: 50%;
        position: relative;
        z-index: 10002;
        border-radius: 4px;
        iframe {
            text-align: center;
            border: none;
        }
    }
}
</style>

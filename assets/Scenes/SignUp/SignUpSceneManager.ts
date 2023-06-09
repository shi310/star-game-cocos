import { _decorator, Button, Component, director, EditBox, Node } from 'cc'
import { common, utils, userApi, Receive } from '../../Script'
const { ccclass, property } = _decorator

@ccclass('SignUpManager')
export class SignUpManager extends Component {
    @property(Node)
    private accountInput: Node

    @property(Node)
    private passwordInput: Node

    @property(Node)
    private passwordInputRe: Node

    @property(Node)
    private invitationInput: Node

    @property(Button)
    private signUpButton: Node

    @property(Node)
    private loading: Node

    private response: XMLHttpRequest


    start() {

    }

    update(deltaTime: number) {
        this.onTextChanged()
    }

    onDestroy(): void {
        if (this.response != undefined) {
            this.response.abort()
        }
    }


    private onBack() {
        director.loadScene('SignInScene')
    }

    private onTextChanged() {
        const isNotAccountInput = this.accountInput.getComponent(EditBox).string === ''
        const isNotPasswordInput = this.passwordInput.getComponent(EditBox).string === ''
        const isNotPasswordReInput = this.passwordInputRe.getComponent(EditBox).string === ''

        if (isNotAccountInput || isNotPasswordInput || isNotPasswordReInput) {
            this.signUpButton.getComponent(Button).interactable = false
        } else {
            this.signUpButton.getComponent(Button).interactable = true
        }
    }

    private signUpCallback(r: Receive) {
        setTimeout(() => {
            common.hideLoading()
            if (r.code == 200) {
                director.loadScene('SignInScene')
                setTimeout(() => common.showPop(r.message), 500)
            } else {
                common.showPop(r.message)
            }
        }, 1000)
    }

    /**
    * @text
    * 登陆按钮点击事件
    * @button
    * 向服务器请求登陆
    */
    private onSignUp() {
        let account = this.accountInput.getComponent(EditBox).string
        let password = this.passwordInput.getComponent(EditBox).string
        let passwordRe = this.passwordInputRe.getComponent(EditBox).string
        let invitationCode = this.invitationInput.getComponent(EditBox).string

        if (password !== passwordRe) {
            common.showPop('两次输入的密码不一致')
            return
        }

        this.loading.active = true

        this.response = userApi.signup({
            account: account,
            password: utils.encrypt(password),
            invitationCode: invitationCode,
            callBack: this.signUpCallback.bind(this),
        })
    }
}


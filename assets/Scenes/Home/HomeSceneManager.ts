import { _decorator, Component, director, Label, Node } from 'cc'
import { roomApi, userInfo, common, Receive } from '../../Script'

const { ccclass, property } = _decorator


@ccclass('HomeManager')
export class HomeManager extends Component {
    @property(Label)
    private nickNameLabel: Label

    @property(Label)
    private idLabel: Label

    @property(Node)
    private createRoom: Node

    @property(Node)
    private joinRoom: Node

    start() {
        this.nickNameLabel.getComponent(Label).string = userInfo.nickName
        this.idLabel.getComponent(Label).string = `ID: ${userInfo.uid}`
        this.checkInRoom()
    }

    update(deltaTime: number) {

    }

    private onShowCreateRoom() {
        this.createRoom.active = !this.createRoom.active
    }

    private onShowJoinRoom() {
        this.joinRoom.active = !this.createRoom.active

    }

    private onTeris() {
        director.loadScene("Tetris")
    }

    private checkInRoom() {
        common.showLoading()
        setTimeout(() => {
            roomApi.checkInRoom({
                uid: userInfo.uid,
                callBack: this.responseCallback
            })
        }, 500)
    }

    private responseCallback(r: Receive) {
        setTimeout(() => {
            common.hideLoading()
            if (r.code == 200) {
                userInfo.roomId = r.data.roomId
                userInfo.game = r.data.game
                if (userInfo.game == 'pin_san_zhang') {
                    director.loadScene('PinSanZhang')
                }
            } else {
                common.showPop(r.message)
            }
        }, 500)
    }
}



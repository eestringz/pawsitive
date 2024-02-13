import {
  OpenVidu,
  Publisher,
  Session as OVSession,
  Subscriber,
} from 'openvidu-browser'
import { useEffect, useState } from 'react'
import { publicRequest } from '@src/hooks/requestMethods'
import * as w from '@src/components/ChattingRoom/_style/WebcamScreenStyle'
import { WebcamScreenType } from '@src/types/callType'
import UserVideoComponent from '@src/components/ChattingRoom/UserVideoComponent'
import axios from 'axios'

const WebcamScreen = (props: WebcamScreenType) => {
  const { mySessionId, setMySessionId, setWebcamVisible } = props

  const [, setOV] = useState<OpenVidu | null>(null)
  const [myUserName, setMyUserName] = useState('')
  const [subscriber, setSubscriber] = useState<Subscriber | undefined>(
    undefined,
  )
  const [publisher, setPublisher] = useState<Publisher | undefined>(undefined)
  const [session, setSession] = useState<OVSession | undefined>(undefined)

  const sendLeave = async (sessionId: string) => {
    const url = ` https://i10c111.p.ssafy.io:8443/sessions/${sessionId}/disconnections`
    return axios.post(url, {})
  }

  const createToken = async (id: string) => {
    const url = `/sessions/${id}/connections`
    const response = await publicRequest.post(url, {})
    return response.data.token
  }

  // 토큰 가져오기
  const getToken = async () => {
    return createToken(mySessionId)
  }

  const joinSession = () => {
    // 1. openvidu 객체 생성
    const newOV = new OpenVidu()
    // socket 통신 과정에서 많은 log를 남기게 되는데 필요하지 않은 log를 띄우지 않게 하는 모드
    newOV.enableProdMode()
    // 2. initSesison 생성
    const newSession = newOV.initSession()
    // 3. 미팅을 종료하거나 뒤로가기 등의 이벤트를 통해 세션을 disconnect 해주기 위해 state에 저장
    setOV(newOV)
    setSession(newSession)

    const connection = () => {
      // 4-a token 생성
      getToken().then(async (token: string) => {
        console.log('token 잘 가져와졌어용 ~~~ ', token)
        newSession
          .connect(token, { clientData: myUserName })
          .then(async () => {
            console.log('connect 되냐요?')
            // 4-b user media 객체 생성
            newOV
              .getUserMedia({
                audioSource: false,
                videoSource: undefined,
                resolution: '1280x720',
                frameRate: 10,
              })
              .then(mediaStream => {
                console.log('userMedia 가져와 지나요?')
                const videoTrack = mediaStream.getVideoTracks()[0]

                const newPublisher = newOV.initPublisher(myUserName, {
                  audioSource: undefined,
                  videoSource: videoTrack,
                  publishAudio: true,
                  publishVideo: true,
                  resolution: '1280x720',
                  frameRate: 60,
                  insertMode: 'APPEND',
                  mirror: true,
                })
                // 4-c publish
                newPublisher.once('accessAllowed', () => {
                  newSession.publish(newPublisher)
                  setPublisher(newPublisher)
                })
              })
          })
          .catch(error => {
            console.warn(
              'There was an error connecting to the session:',
              error.code,
              error.message,
            )
          })
      })
    }
    // 1-1 session에 참여한 사용자 추가
    newSession.on('streamCreated', event => {
      const newSubscriber = newSession.subscribe(
        event.stream,
        JSON.parse(event.stream.connection.data).clientData,
      )
      setSubscriber(newSubscriber)
    })
    // 1-2 session에서 disconnect한 사용자 삭제
    newSession.on('streamDestroyed', event => {
      if (event.stream.typeOfVideo === 'CUSTOM') {
        setSubscriber(undefined)
      }
    })

    // 1-3 예외처리
    newSession.on('exception', exception => {
      console.warn(exception)
    })
    // 4. session에 connect
    connection()
  }

  // 세션 나가기
  const leaveSession = () => {
    // const maintainSessionId = user.mySessionId
    const maintainSessionId = mySessionId
    const mySession = session
    if (maintainSessionId) {
      sendLeave(maintainSessionId)
      if (mySession) {
        mySession.disconnect()
      }
    }
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
    // Empty all properties...
    setOV(null)
    setSession(undefined)
    setSubscriber(undefined)
    setMySessionId('')
    setMyUserName('')
    setPublisher(undefined)
  }

  // 종료 버튼 함수
  const onClickEndCall = () => {
    leaveSession()
    setWebcamVisible(false)
  }

  useEffect(() => {
    if (mySessionId !== '') {
      console.log('mySessionId 변경됨!!!!!', mySessionId)
      joinSession()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mySessionId])

  // 새로고침 시 axios 보내기
  // const beforeUnLoad = (e: BeforeUnloadEvent) => {
  //   e.stopPropagation()
  //   e.returnValue = ''
  // }
  //
  // useEffect(() => {
  //   window.addEventListener('beforeunload', beforeUnLoad)
  //   leaveSession()
  //
  //   return () => {
  //     window.removeEventListener('beforeunload', beforeUnLoad)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return (
    <w.Container>
      <button type="button" onClick={onClickEndCall}>
        종료
      </button>
      {session !== undefined && (
        <w.Wrap>
          <div>
            {publisher !== undefined && (
              <div>
                <UserVideoComponent streamManager={publisher} />
              </div>
            )}
            {subscriber !== undefined && (
              <div>
                <UserVideoComponent streamManager={subscriber} />
              </div>
            )}
          </div>
        </w.Wrap>
      )}
    </w.Container>
  )
}

export default WebcamScreen
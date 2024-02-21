import React, { Ref, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EuiButtonEmpty } from '@elastic/eui'
import {
  aiAssistantChatSelector,
  askAssistantChatbot,
  getAssistantChatHistoryAction,
  removeAssistantChatAction
} from 'uiSrc/slices/panels/aiAssistant'
import { scrollIntoView } from 'uiSrc/utils'
import { sendEventTelemetry, TelemetryEvent } from 'uiSrc/telemetry'
import ChatHistory from '../chat-history'
import ChatForm from '../chat-form'

import styles from './styles.module.scss'

const Chat = () => {
  const { id, messages } = useSelector(aiAssistantChatSelector)

  const [progressingMessage, setProgressingMessage] = useState(null)
  const scrollDivRef: Ref<HTMLDivElement> = useRef(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!id || messages.length) return

    dispatch(getAssistantChatHistoryAction(id, () => scrollToBottom('auto')))
  }, [])

  const handleSubmit = (message: string) => {
    scrollToBottom('smooth')

    dispatch(askAssistantChatbot(
      id,
      message,
      {
        onMessage: (message: any) => {
          setProgressingMessage({ ...message })
          scrollToBottom('auto')
        },
        onFinish: () => {
          setProgressingMessage(null)
          scrollToBottom('smooth')
        }
      }
    ))
  }

  const onClearSession = () => {
    dispatch(removeAssistantChatAction(id))

    sendEventTelemetry({
      event: TelemetryEvent.AI_CHAT_SESSION_RESTARTED,
    })
  }

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    setTimeout(() => {
      scrollIntoView(scrollDivRef?.current, {
        behavior,
        block: 'start',
        inline: 'start',
      })
    }, 0)
  }

  return (
    <div className={styles.wrapper}>
      {!!messages?.length && (
        <div className={styles.header}>
          <span />
          <EuiButtonEmpty
            disabled={!!progressingMessage}
            iconType="eraser"
            size="xs"
            onClick={onClearSession}
            className={styles.startSessionBtn}
          >
            Restart Session
          </EuiButtonEmpty>
        </div>
      )}
      <div className={styles.chatHistory}>
        <ChatHistory
          progressingMessage={progressingMessage}
          history={messages}
          scrollDivRef={scrollDivRef}
          onSubmit={handleSubmit}
        />
      </div>
      <div className={styles.chatForm}>
        <ChatForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export default Chat

import { Send, Mic, MicOff } from 'lucide-react';
import { Input } from '../../../../shared/ui/input/view/Input';
import { Button } from '../../../../shared/ui/button/view/Button';

import styles from './ChatInput.module.scss';
import { useState, type FC, type FormEvent } from 'react';
import { useChatStore } from '../../../../entities/aiChat';
import { useAuth } from '../../../../shared/hooks/useAuth';
import { Link } from 'react-router-dom';
import { paths } from '../../../../shared/constants/constants';
import { Typography } from '../../../../shared/ui/typography/view/Typography';

export const ChatInput: FC = () => {
  const [inputValue, setInputValue] = useState('');
  const {
    sendMessage,
    isLoading,
    startVoiceInput,
    stopVoiceInput,
    isListening,
  } = useChatStore();
  const { isAuth } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !isAuth) return;

    await sendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      startVoiceInput();
    }
  };

  return (
    <div className={styles.chatInput}>
      {!isAuth && (
        <div className={styles.authNotice}>
          <Typography variant="bodyT" color="dark">
            To use the chat, please <Link to={paths.loginPage}>log in</Link> to
            your account.
          </Typography>
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <div className={styles.inputContainer}>
          <Input
            type="text"
            placeholder={
              isAuth ? 'Write your question...' : 'Log in to send messages'
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading || isListening || !isAuth}
            className={styles.messageInput}
            noHighlight
          />

          <div className={styles.inputActions}>
            <Button
              variant="secondary"
              type="button"
              onClick={handleVoiceToggle}
              disabled={isLoading || !isAuth}
              className={`${styles.voiceButton} ${
                isListening ? styles.voiceActive : ''
              }`}
              ariaLabel={isListening ? 'Stop recording' : 'Start voice input'}
            >
              {isListening ? (
                <MicOff size={20} color="var(--error)" />
              ) : (
                <Mic size={20} color="var(--text-sec)" />
              )}
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={
                !inputValue.trim() || isLoading || isListening || !isAuth
              }
              className={styles.sendButton}
              ariaLabel="Send message"
            >
              <Send size={20} color="white" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

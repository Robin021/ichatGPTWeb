import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import { WechatOutlined } from '@ant-design/icons';
import { Input, Space,Spin,Button,Watermark } from 'antd';
const Nls = require('alibabacloud-nls')
//Nls内部含SpeechRecognition, SpeechTranscription, SpeechSynthesizer
//以下为使用import导入SDK
//import { SpeechRecognition } from "alibabacloud-nls"
//import { SpeechTranscription } from "alibabacloud-nls"
//import { SpeechSynthesizer } from "alibabacloud-nls"

function App() {
  const [error, setError] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [prevAnswer, setPrevAnswer] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [connectionError, setConnectionError] = useState(false);
  const inputRef = React.useRef();
  const { Search } = Input;
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const suffix = (
    <WechatOutlined
      style={{
        fontSize: 16,
        color: '#1890ff',
      }}
    />
  );

  const handleSubmit = (e) => {
    setQuestions([...questions, e]);
    setSearchValue('');
    setIsLoading(true);
    setPrevAnswer(prevAnswer + '<div class="question">' + e + '</div>');
  }
  
  const getAnswer = async () => {
    if (questions.length === 0) {
      return;
    }
    try {
      setIsLoading(true);
      let response = await fetch(`http://127.0.0.1:5001/ask?q=${questions[0]}&conversation_id=${conversationId}`);
      response = await response.json();
      setAnswers([...answers, response.answers]);
      setQuestions([]);
      setPrevAnswer(prevAnswer + '<div class="answer">' + response.answers + '</div>');
      setError(false);
      setIsLoading(false);
    } catch (e) {
      setError(true);
      setIsLoading(false);
    }
  }
  
  
  useEffect(() => {
    getAnswer();
  }, [questions]);
  useEffect(() => {
    inputRef.current.value = '';
  }, []);

  useEffect(() => {
    const getNewConversationId = async () => {
      try {
        let response = await fetch(`http://127.0.0.1:5001/new-conversation`);
        response = await response.json();
        const id = response.id;
        setConversationId(id);
      } catch (e) {
        setConnectionError(true);
      }
    };
    getNewConversationId();
  }, []);
  useEffect(() => {
    document.querySelector('.answer-area').scrollTop = document.querySelector('.answer-area').scrollHeight;
  }, [prevAnswer]);

  return (
    <Watermark content="">
    {connectionError && <div className="error-message">没有连上大脑，请刷下再产生会话</div>}
    <div className='container'>
      <div className="answer-area" dangerouslySetInnerHTML={{__html: prevAnswer}} />
      </div>

      <Space direction="vertical">
      <div className='alert-container'>
          {isLoading && <Spin />}
          {/* {isLoading && "正在获取答案"} */}
      </div>
        <Search
          placeholder="跟我聊两句吧"
          enterButton="Send"
          size="large"
          ref={inputRef}
          suffix={suffix}
          onSearch={handleSubmit}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
      </Space>
      {error && <Button color="danger" onClick={() => handleSubmit()}>重新产生回答</Button>}

    </Watermark>
  );
}

export default App;

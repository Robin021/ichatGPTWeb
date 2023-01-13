import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import { Button } from 'antd';
import { AliwangwangOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import { Input, Space } from 'antd';


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
    <AliwangwangOutlined
      style={{
        fontSize: 16,
        color: '#1890ff',
      }}
    />
  );
  const handleSubmit = (e) => {
    setQuestions([...questions, e]);
    // console.log(e)
    setSearchValue('');
    setIsLoading(true);
  };
  const getAnswer = async () => {
    if (questions.length === 0) {
      return;
    }
    try {
      setIsLoading(true);
      let response = await fetch(`http://chatgpt.021d.com:5001/ask?q=${questions[0]}&conversation_id=${conversationId}`);
      response = await response.json();
      setAnswers([...answers, response.answers]);
      setQuestions([]);
      setPrevAnswer(prevAnswer + '\n你: ' + questions[0] + '\n\nChatBot:' + response.answers + '\n');
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
        let response = await fetch(`http://chatgpt.021d.com:5001/new-conversation`);
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

    <div className='container'>
      {connectionError && <div className="error-message">没有连上大脑，请刷下再产生会话</div>}
      <pre className='answer-area'>
        {prevAnswer}
        <br />
      </pre>
      <Space direction="vertical">
        <div className='alert-container'>
          {isLoading && <Alert message="等待回复中..." type="info" />}
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
      {/* <Alert message="消息已发送" type="success" /> */}
      {isLoading && <div>等待回复中...</div>}
      {error && <Button color="danger" onClick={() => getAnswer()}>重新产生回答</Button>}
    </div>

  );
}

export default App;

import React, { useEffect, useState } from "react";
import { Button, Layout, Pagination, Space, Table } from "antd";
import './Messages.css';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../../redux-store/messageSlice";

const {Footer, Sider, Content} = Layout;

const Messages = () => {

  const [contentHeight, setContentHeight] = useState('calc(100vh - 73px)');
  const [size, setSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const {messages} = useSelector((state) => state.messages);
  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(getMessages({page: current, size: size}))
  }, [])

  function ReadStatus(check)
  {
    if(check)
    {
      return "READ"
    }
    return "UNREAD"
  }

  function SetMail(user)
  {
    return user.email;
  }

  const columns = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: 'User E-mail',
      dataIndex: 'user',
      key: 'user',
      render:(cell) => {
        return SetMail(cell)
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render:(cell)=> {
        return ReadStatus(cell)
      }
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/reply/${record.id}`}>
            <Button type="primary" >Reply</Button>
          </Link>
        </Space>
      ),
    },
  ]
  const handleChange = (newPage) => {
    setCurrent(newPage.current);
    setSize(newPage.pageSize);
    dispatch(getMessages({page: newPage.current, size: newPage.pageSize}))
  };

  return (
    <div>
      <h1>Messages</h1>
      <hr/>
      <Table columns={columns} onChange={handleChange} dataSource={messages.messages} pagination={{
        current:current,
        size:size,
        total:messages.total,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
      }}>
      </Table>
      <Footer style={{backgroundColor: "#1d8f8a"}} className='footerStyleMess'>
      </Footer>
    </div>
  )
}

export default Messages;
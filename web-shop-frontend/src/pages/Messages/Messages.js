import React, { useEffect, useState } from "react";
import { Button, Layout, Space, Table, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, readMessage } from "../../redux-store/messageSlice";
import SearchComponent from "../../components/Search/Search";
import ReplyMessageModal from "../CustomerSupport/ReplyMessageModal";
import { FaCircle } from "react-icons/fa";

const { Footer } = Layout;

const Messages = () => {

  const [content, setContent] = useState("");
  const [size, setSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const { messages } = useSelector((state) => state.messages);
  const dispatch = useDispatch();
  const [replyModal, setReplyModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);


  useEffect(() => {
    dispatch(getMessages({ page: current, size: size }));
  }, [replyModal]);

  const handleCloseReplyModal = () => {
    setReplyModal(false);
  };

  const handleReplyClick = (record) => {
    dispatch(readMessage({ value: record.id }));
    setReplyModal(true);
    setSelectedRecord(record);

  };

  function ReadStatus(check) {
    if (check) {
      return <Tooltip placement={"top"} title={"Read"}>
        <FaCircle color="green" size="1em" />
      </Tooltip>;
    }
    return <Tooltip placement={"top"} title={"Unread"}>
      <FaCircle color="blue" size="1em" />
    </Tooltip>;
  }

  function SetMail(user) {
    return user.email;
  }

  const columns = [
    {
      title: "Question",
      dataIndex: "question",
      key: "question"
    },
    {
      title: "User E-mail",
      dataIndex: "user",
      key: "user",
      render: (cell) => {
        return SetMail(cell);
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (cell) => {
        return ReadStatus(cell);
      }
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleReplyClick(record)}>
            Reply
          </Button>
        </Space>
      )
    }
  ];
  const handleChange = (newPage) => {
    setCurrent(newPage.current);
    setSize(newPage.pageSize);
    dispatch(getMessages({ page: newPage.current, size: newPage.pageSize, content: content }));
  };

  const onSearch = (value) => {
    setContent(value);
    setCurrent(1);
    const newPage = { current: 1, pageSize: size, content: value };
    dispatch(getMessages({ page: newPage.current, size: newPage.pageSize, content: newPage.content }));
  };
  return (
    <div>
      <SearchComponent onSearch={onSearch} />
      <h1>Messages</h1>
      <hr />
      <div style={{ minHeight: "61.8vh" }}>
        <Table columns={columns} onChange={handleChange} dataSource={messages.messages} pagination={{
          current: current,
          size: size,
          total: messages.total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"]
        }}>
        </Table>
      </div>
      <Footer style={{ backgroundColor: "#1d8f8a" }}>
      </Footer>
      {replyModal && <ReplyMessageModal show={replyModal} record={selectedRecord} onClose={handleCloseReplyModal} />}

    </div>
  );
};

export default Messages;
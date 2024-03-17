import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { blockUser, getAllUsers, getUser } from "../../redux-store/userSlice";
import SearchComponent from "../../components/Search/Search";
import { Button, Layout, Space, Table, Tooltip } from "antd";
import { FaCircle } from "react-icons/fa";
import { EditTwoTone, PlusOutlined, UserDeleteOutlined } from "@ant-design/icons";
import EditUser from "./EditUser";
import AddUser from "./AddUser";
const { Footer } = Layout;

const Users = () => {

  const [name, setName] = useState("");
  const [size, setSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const dispatch = useDispatch()
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [temp, setTemp] = useState('');


  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getAllUsers({ page: current, size: size }))
  }, [temp])


  const handleCloseReplyModal = () => {
    setEditModal(false);
    setTemp(true);
  };

  const handleCloseAddModal = () => {
    setAddModal(false);
    setTemp(null);
  };


  const handleEditClick = async (record) => {
    await dispatch(getUser({ id: record.id }))
    setEditModal(true);
    setSelectedRecord(record);
  };
  const handleDeleteClick = (record) => {
    dispatch(blockUser({id:record.id}))
    setTemp(false);
    setSelectedRecord(null);
  };


  const onSearch = (value) => {
    setName(value);
    setCurrent(1);
    const newPage = { current: 1, pageSize: size, name: value };
    dispatch(getAllUsers({ page: newPage.current, size: newPage.pageSize, name: newPage.name }))
  };

  function ReadStatus(check) {
    if (check === "ACTIVE") {
      return <Tooltip placement={"top"} title={"Active"}>
        <FaCircle color="green" size="1em" />
      </Tooltip>;
    }
    else if (check === "REQUESTED") {
      return <Tooltip placement={"top"} title={"Requested"}>
        <FaCircle color="blue" size="1em" />
      </Tooltip>;
    }
    return <Tooltip placement={"top"} title={"Blocked"}>
      <FaCircle color="red" size="1em" />
    </Tooltip>;
  }

  function ShowAvatar(avatar) {
    return <img width={50} src={avatar != null ? require(`../../assets/users/` + avatar + '.png') : require('../../assets/user_318-159711.avif')} alt={require('../../assets/user_318-159711.avif')} />
  }

  const columns = [
    {
      title: 'First name',
      dataIndex: 'firstname',
      key: 'firstname',
    },
    {
      title: 'Last name',
      dataIndex: 'lastname',
      key: 'lastname',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (cell) => {
        return ShowAvatar(cell)
      }
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (cell) => {
        return ReadStatus(cell)
      }
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip placement={"top"} title={"Edit"}>
            <Button onClick={() => handleEditClick(record)}>
              <EditTwoTone />
            </Button>
          </Tooltip>
          <Tooltip placement={"top"} title={"Block"}>
            <Button style={{ backgroundColor: 'red' }} onClick={() => handleDeleteClick(record)}>
              <UserDeleteOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const handleChange = (newPage) => {
    setCurrent(newPage.current);
    setSize(newPage.pageSize);
    dispatch(getAllUsers({ page: newPage.current, size: newPage.pageSize, name: name }))
  };

  return (
    <div>
      <SearchComponent onSearch={onSearch} />
      <Tooltip placement={"top"} title={"Add"}>
      <Button type="primary" shape="circle" onClick={() => setAddModal(true)} icon={<PlusOutlined />} style={{ float: 'right', width:'30px', marginRight: '20px', marginTop: '20px' }} />
      </Tooltip>
      <h1>Users</h1>
      <hr />
      <div style={{ minHeight: "61.8vh" }}>
        <Table columns={columns} onChange={handleChange} dataSource={users.users} pagination={{
          current: current,
          size: size,
          total: users.total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
        }}>
        </Table>
      </div>
      <Footer style={{ backgroundColor: "#1d8f8a" }}>
      </Footer>
      {editModal && <EditUser show={editModal} onClose={handleCloseReplyModal}/>}
      {addModal && <AddUser show={addModal} onClose={handleCloseAddModal}/>}

    </div>
  )
}

export default Users;

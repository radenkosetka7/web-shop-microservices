import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux-store/userSlice";
import SearchComponent from "../../components/Search/Search";
import { Button, Layout, Space, Table, Tooltip } from "antd";
import { FaCircle } from "react-icons/fa";
import { EditTwoTone, PlusOutlined, UserDeleteOutlined } from "@ant-design/icons";
const { Footer } = Layout;

const Users = () => {

  const [name, setName] = useState("");
  const [size, setSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const dispatch = useDispatch()
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getAllUsers({ page: current, size: size }))
  }, [])

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
    console.log("avatar " + avatar);
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
            <Button>
              <EditTwoTone />
            </Button>
          </Tooltip>
          <Tooltip placement={"top"} title={"Block"}>
            <Button style={{ backgroundColor: 'red' }}>
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
      <Button type="primary" shape="circle" icon={<PlusOutlined />} style={{ float: 'right', width:'30px', marginRight: '20px', marginTop: '20px' }} />
      </Tooltip>
      <h1>Users</h1>
      <hr />
      <div style={{ minHeight: "61.8vh" }}>
        <Table columns={columns} onChange={handleChange} dataSource={users.users} pagination={{
          current: current,
          size: size,
          total: users.total,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '50'],
        }}>
        </Table>
      </div>
      <Footer style={{ backgroundColor: "#1d8f8a" }}>
      </Footer>
    </div>
  )
}

export default Users;

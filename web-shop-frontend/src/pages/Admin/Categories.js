import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Layout, Space, Table, Tooltip } from "antd";
import { FaEye } from "react-icons/fa";
import { DeleteOutlined, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { getCategories } from "../../redux-store/categorySlice";
import { blockUser, getUser } from "../../redux-store/userSlice";
import EditUser from "./EditUser";
import AddUser from "./AddUser";
import EditCategory from "./EditCategory";
import AddCategory from "./AddCategory";
const { Footer } = Layout;

const Categories = () => {

  const [size, setSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const dispatch = useDispatch()
  const { categories } = useSelector((state) => state.categories);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [attributesModal, setAttributesModal] = useState(false);
  const [temp, setTemp] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    dispatch(getCategories({}))
  }, [])

  const handleCloseReplyModal = () => {
    setEditModal(false);
    setTemp(true);
  };

  const handleCloseAddModal = () => {
    setAddModal(false);
    setTemp(null);
  };

  const handleDeleteClick = (record) => {
    dispatch(blockUser({id:record.id}))
    setTemp(false);
    setSelectedRecord(null);
  };

  const handleEditClick = async (record) => {
    //await dispatch(getUser({ id: record.id }))
    setEditModal(true);
    setSelectedRecord(record);
  };

  const handleAttributesClick = async (record) => {
    //await dispatch(getUser({ id: record.id }))
    setAttributesModal(true);
    setSelectedRecord(record);
  };

  const handleCloseAttributesModal = () => {
    setAttributesModal(false);
    setTemp(false);
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: 'Attributes',
      key: 'attribute',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip placement={"top"} title={"View"}>
            <Button type={"primary"} onClick={() => handleAttributesClick(record)}>
              <FaEye />
            </Button>
          </Tooltip>
        </Space>
      ),
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
          <Tooltip placement={"top"} title={"Delete"}>
            <Button style={{ backgroundColor: 'red' }} onClick={() => handleDeleteClick(record)}>
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const handleChange = (newPage) => {
    setCurrent(newPage.current);
    setSize(newPage.pageSize);
  };

  return (
    <div>
      <Tooltip placement={"top"} title={"Add"}>
        <Button type="primary" onClick={() => setAddModal(true)} shape="circle" icon={<PlusOutlined />} style={{ float: 'right', width:'30px', marginRight: '20px', marginTop: '20px' }} />
      </Tooltip>
      <h1>Categories</h1>
      <hr />
      <div style={{ minHeight: "69.2vh" }}>
        <Table columns={columns}  onChange={handleChange} dataSource={categories} pagination={{
          current: current,
          size: size,
          total: categories.total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
        }}>
        </Table>
      </div>
      <Footer style={{ backgroundColor: "#1d8f8a" }}>
      </Footer>
      {editModal && <EditCategory show={editModal} onClose={handleCloseReplyModal}/>}
      {addModal && <AddCategory show={addModal} onClose={handleCloseAddModal}/>}
      {attributesModal && <AddCategory show={attributesModal} onClose={handleCloseAttributesModal}/>}
    </div>
  )
}

export default Categories;

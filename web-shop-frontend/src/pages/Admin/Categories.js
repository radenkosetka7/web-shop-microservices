import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Layout, Space, Table, Tooltip } from "antd";
import { FaEye } from "react-icons/fa";
import { DeleteOutlined, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { getCategories } from "../../redux-store/categorySlice";
const { Footer } = Layout;

const Categories = () => {

  const [size, setSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const dispatch = useDispatch()
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getCategories({}))
  }, [])

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
            <Button type={"primary"}>
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
            <Button>
              <EditTwoTone />
            </Button>
          </Tooltip>
          <Tooltip placement={"top"} title={"Delete"}>
            <Button style={{ backgroundColor: 'red' }}>
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
        <Button type="primary" shape="circle" icon={<PlusOutlined />} style={{ float: 'right', width:'30px', marginRight: '20px', marginTop: '20px' }} />
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
    </div>
  )
}

export default Categories;

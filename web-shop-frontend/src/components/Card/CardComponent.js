import React from "react";
import { Button, Card } from "antd";
import "./Card.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteProduct } from "../../redux-store/productSlice";

const { Meta } = Card;
const CardComponent = ({ product, handleChangeRefreshKey }) => {

  const dispatch = useDispatch();
  const urlParam = `${product.id}`;

  const { loggedUser } = useSelector((state) => state.users);

  const handleDeleteClick = async (e) => {
    e.preventDefault();
    const id = product.id;
    dispatch(deleteProduct({ id: id }));
    await new Promise(resolve => setTimeout(resolve, 500));
    handleChangeRefreshKey();
  };

  return (
    <Link to={`/${urlParam}`}>
      <Card
        hoverable
        className="card"
        cover={<img style={{ height: "200px" }} className="image" alt="Logo"
                    src={require("/usr/src/app/src/assets/products/" + product.images[0].productImage + ".png")} />}
      >
        <Meta className="price" title={product.title} description={`${product.price} BAM`} />
        <br />
        {loggedUser && product && product.userSeller === loggedUser.id && product.finished === 0 &&
          <Button type="primary" onClick={handleDeleteClick}
                  style={{ backgroundColor: "red", width: "fit-content" }}><DeleteOutlined /> Delete</Button>}
      </Card>
    </Link>
  );
};
export default CardComponent;
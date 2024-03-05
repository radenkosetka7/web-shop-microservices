import {Button, Form} from "antd";
import React from "react";

const Finished = ({onFinish,isDisabled}) =>
{

    return (
        <Form
            onFinish={onFinish}
            style={{
                maxWidth: 600,
            }}
            autoComplete="off"
        >
            <br/>
            <h1>You have filled in all the information.</h1>
            <h2>Click on finished to finish adding the product.</h2>
            <Form.Item wrapperCol={{offset: 18, span: 14}}>
                <Button disabled={isDisabled} type="primary" htmlType="submit">
                    Finished
                </Button>
            </Form.Item>
        </Form>
    )
}

export default Finished;
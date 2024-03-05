import React, { useState } from 'react';
import { Tree } from 'antd';


const CategoryList = ({ categories, onSelect,setSelectedCategoryTemp  }) => {
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const onExpand = (newExpandedKeys) => {
        setExpandedKeys(newExpandedKeys);
    };

    const handleSelect = (selectedKeys, info) => {
        const clickedKey = selectedKeys[0];

        if (clickedKey === 'root') {
            return;
        }

        setSelectedKeys(selectedKeys);
        onSelect(selectedKeys);
        setSelectedCategoryTemp(clickedKey);
    };

    const treeData = [
        {
            title: 'Categories',
            key: 'root',
            children: categories.map((category) => ({
                title: category.name,
                key: category.id.toString(),
            })),
        },
    ];

    return (
        <div>
            <Tree
                style={{ backgroundColor: '#c5c5c5' }}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                onSelect={handleSelect}
                selectedKeys={selectedKeys}
                treeData={treeData}
            />
        </div>
    );
};

export default CategoryList;

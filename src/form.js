import React from "react"
import { useState } from "react";
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { Table } from "antd";



const { Option } = Select;

export function Forms() {
    const [tableData, settableData] = useState(JSON.parse(localStorage.getItem("tableData")) || []);
    const [editingkey, seteditingkey] = useState(null);
    const [formvalues, setformvalues] = useState({ username: '', surname: '', password: '', email: '' });
    const [sortField, setSortField] = useState('username');
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setsearchField] = useState("username");
    const [selectAllCheckbox, setselectAllCheckbox] = useState(false);
    const [selectkeys, setselectkeys] = useState([]);


    const handleInputChange = (e) => {
        setformvalues({ ...formvalues, [e.target.name]: e.target.value });
    }



    const onFinish = () => {


        if (editingkey === null) {
            const newRecord = { ...formvalues, key: tableData.length };
            const updatedTableData = [...tableData, newRecord];
            settableData(updatedTableData);
            localStorage.setItem("tableData", JSON.stringify((updatedTableData)));


        } else {
            const updatedData = tableData.map((item) => {
                if (item.key === editingkey) {
                    return { ...item, ...formvalues };
                }
                return item;
            });
            settableData(updatedData);
            localStorage.setItem("tableData", JSON.stringify(updatedData));
            seteditingkey(null);

        }
        resetForm();

    };
    const resetForm = () => {
        setformvalues({ username: '', surname: '', password: '', email: '' });
        seteditingkey(null);

    }

    // const onFinishFailed = (errorInfo) => {
    //     console.log('Failed:', errorInfo);
    // };

    const handleDelete = (key) => {
        const newData = tableData.filter(item => item.key !== key);
        settableData(newData);
        localStorage.setItem("tableData", JSON.stringify(newData));
    };

    const handleEdit = (record) => {
        seteditingkey(record.key);
        setformvalues({ username: record.username, surname: record.surname, password: record.password, email: record.email });

    };


    const handleSortByUsername = () => {
        const sortedData = [...tableData].sort((a, b) => a.username.localeCompare(b.username));
        settableData(sortedData);
        localStorage.setItem("tableData", JSON.stringify(sortedData));
    }

    const handleSortByField = (field) => {
        const sortedDataa = [...tableData].sort((a, b) => {
            const aValue = a[field].toLowerCase();
            const bValue = b[field].toLowerCase();
            if (aValue < bValue) return -1;
            if (aValue > bValue) return 1;
            return 0;

        });
        settableData(sortedDataa);
        localStorage.setItem("tableData", JSON.stringify(sortedDataa));
    }

    const handleSearch = () => {
        const filtered = tableData.filter(item => {
            const username = item.username ? item.username.toLowerCase() : "";
            const password = item.password ? item.password.toLowerCase() : "";
            const surname = item.surname ? item.surname.toLowerCase() : "";
            const email = item.email ? item.email.toLowerCase() : "";

            return username.includes(searchTerm.toLowerCase()) ||
                password.includes(searchTerm.toLowerCase()) ||
                surname.includes(searchTerm.toLowerCase()) ||
                email.includes(searchTerm.toLowerCase());

        });
        settableData(filtered);
    };

    const handleheckboxChange = (recordkey) => {
        let updatedSelectkeys = [...selectkeys];

        if (updatedSelectkeys.includes(recordkey)) {
            updatedSelectkeys = updatedSelectkeys.filter(key => key !== recordkey);
        } else {
            updatedSelectkeys.push(recordkey);
        }

        setselectkeys(updatedSelectkeys);
        setselectAllCheckbox(updatedSelectkeys.length === tableData.length);
    };


    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setselectAllCheckbox(checked);

        if (checked) {
            const allkeys = tableData.map(item => item.key);
            setselectkeys(allkeys);
        } else {
            setselectkeys([]);

        }
    };

    const handleAllDeleted = () => {
        const newData = tableData.filter(item => selectkeys.includes(item.key));
        settableData(newData);
        localStorage.setItem("tableData", JSON.stringify(newData));
        setselectkeys([]);
        setselectAllCheckbox(false);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'username',
            key: 'username',


        },
        {
            title: 'Surname',
            dataIndex: 'surname',
            key: 'surname',

        },
        {
            title: 'Password',
            dataIndex: 'password',
            key: 'password',

        },

        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',

        },
        {
            title: 'Delete',
            key: 'delete',
            render: (text, record) => (
                <Button onClick={() => handleDelete(record.key)}>Delete</Button>
            )
        },
        {
            title: 'Edit',
            key: 'edit',
            render: (text, record) => (
                <Button onClick={() => { handleEdit(record) }} >Edit</Button>
            ),
        },
        {
            title: (
                < Checkbox
                    checked={selectAllCheckbox}
                    onChange={handleSelectAll} />
            ),
            dataIndex: 'checkbox',
            render: (text, record) => (
                <Checkbox
                    checked={selectkeys.includes(record.key)}
                    onChange={() => handleheckboxChange(record.key)} />
            ),
        },

    ];


    return (
        <div>
            <Form onFinish={onFinish} style={{ maxWidth: 500 }} labelCol={{ span: 8, }}   >
                <Form.Item label="Username" >
                    <Input name="username" value={formvalues.username} onChange={handleInputChange} />
                </Form.Item>
                <Form.Item label="Surname" >
                    <Input name="surname" value={formvalues.surname} onChange={handleInputChange} />
                </Form.Item>
                <Form.Item label="Password" >
                    <Input name="password" value={formvalues.password} onChange={handleInputChange} />
                </Form.Item>
                <Form.Item label="Email" >
                    <Input name="email" value={formvalues.email} onChange={handleInputChange} />
                </Form.Item>



                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                    <Button type="default" onClick={handleSortByUsername}>
                        Sort by Username
                    </Button>
                    <Select defaultValue="name" onChange={value => setSortField(value)}>
                        <Option value="name">Name</Option>
                        <Option value="surname">Surname</Option>
                        <Option value="password">Password</Option>
                        <Option value="email">Email</Option>

                    </Select>
                    <Button type="default" onClick={() => handleSortByField(sortField)}>Sorting</Button>
                    <div>
                        <Input placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <Button onClick={handleSearch}>Search</Button>
                    </div>
                    <Select defaultValue="name" onChange={value => setsearchField(value)}>
                        <Option value="name"> Search by Name</Option>
                        <Option value="surname">  Search by Surname</Option>
                        <Option value="password">  Search by Password</Option>
                        <Option value="email">  Search by Email</Option>

                    </Select>
                    <Input placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button type="default" onClick={() => handleSearch(sortField)}>Searching</Button>
                    <Button type="danger" onClick={handleAllDeleted}>Delete All selected</Button>
                </Form.Item>
            </Form>
            <Table columns={columns} dataSource={tableData} pagination={false} />;
        </div>

        
    )



}
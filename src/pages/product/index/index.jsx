import React, {Component, Fragment} from 'react'
import {Card,Table,Select,Button,Input,Icon,message} from 'antd'
import {Link} from 'react-router-dom'
import MyButton from '../../../components/my-button/index'
import {reqGetProducts} from "../../../api/index";
import './index.less'
const Option = Select.Option;

export default class Product extends Component{
  state={
    product:[],  //单页产品数据数组
    total:0,  //产品总数量
  }
  columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '商品描述',
      dataIndex: 'desc',
      key: 'desc',
    }, {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '状态',
      // dataIndex: 'address',
      key: 'status',
      render: () => {
        return <Fragment>
          <Button type="primary">下架</Button>
          &nbsp; &nbsp;在售
        </Fragment>
      }
    },
    {
      title: '操作',
      // dataIndex: 'address',
      key: 'operator',
      render: (product) => {
        return <Fragment>
          <MyButton>详情</MyButton>
          <MyButton onClick={this.updateProduct(product)}>修改</MyButton>
        </Fragment>
      }
    }
  ];
  updateProduct=(product)=>{
    return ()=>{
      this.props.history.push('/product/saveupdate',product);
    }
  }
  getProducts = async (pageNum,pageSize=3)=>{
    const result = await reqGetProducts(pageNum,pageSize);
    if(result.status === 0){
      this.setState({
        products:result.data.list,
        total:result.data.total
      })
    }else{
      message.error(result.msg);
    }
  }
  componentDidMount(){
    this.getProducts(1);
  }
  render(){
    const {products,total} = this.state;

    return (
      <Card
        title={
        <Fragment>
          <Select value={0}>
            <Option key={0} value={0}>根据商品</Option>
            <Option key={1} value={1}>根据商品描述</Option>
          </Select>
          <Input placeholder="关键字" className="search-input"/>
          <Button type="primary">搜索</Button>
        </Fragment>
      }
        extra={<Link to="/product/saveupdate"><Button type="primary"><Icon type="plus"/>添加产品</Button></Link>}
        className="product"
        >
        <Table
          dataSource={products}
          columns={this.columns}
          bordered
          pagination={{
            showSizeChanger:true,
            pageSizeOptions:['3','6','9','12'],
            defaultPageSize:3,
            showQuickJumper:true,
            total,
            onChange:this.getProducts,
            onShowSizeChange:this.getProducts
          }}
          loading={false}
          rowKey="_id"
        />
      </Card>
    );
  }
}
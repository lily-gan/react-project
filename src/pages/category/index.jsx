import React,{Component} from 'react'
import { Card ,Button,Icon,Table} from 'antd';
import MyButton from '../../components/my-button'
import './index.less'
export default class Category extends Component{
    render(){
      const columns =[
        {
          title:'品类名称',
          dataIndex:'name',  //显示data数据中的name属性值
        },
        {
          title:'操作',
          dataIndex:'operator',
          className:'operator',
          render: text=> <div>
            <MyButton>修改名称</MyButton>
            </div>
        }
      ]
      const data=[
        {
          key:'1',
          name:'苹果'
        },
        {
          key:'2',
          name:'橘子'
        },
        {
          key:'3',
          name:'鸡蛋'
        },
        {
          key:'4',
          name:'糖果'
        },
        {
          key:'5',
          name:'菠萝'
        },
        {
          key:'6',
          name:'菠萝蜜'
        },
        {
          key:'7',
          name:'芒果'
        },
        {
          key:'8',
          name:'火龙果'
        }
      ]
      return(
            <div>
              <Card
                title="品类管理"
                extra={<Button type='primary'><Icon type='plus'/>添加品类</Button>}
                className="card"
              >
                <Table
                  columns={columns}
                  dataSource={data}
                  borderd
                  pagination={
                    {
                      showSizeChanger:true,
                      defaultCurrent:1,
                      defaultPageSize:3,
                      showQuickJumper:true,
                      pageSizeOptions: ['3', '6', '9', '12'],
                    }
                  }
                />
              </Card>
            </div>
        )
    }
}
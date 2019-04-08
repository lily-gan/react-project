import React,{Component} from 'react'
import {Card,Icon,Form,Input,Cascader,InputNumber,Button,message} from 'antd'
import './save-update.less'
import RichTextEditor from './rich-text-editor'
import {reqGetCategories} from "../../api";

const Item = Form.Item;
@Form.create()
class SaveUpdate extends Component{
  constructor(props){
    super(props);
    this.state={
      options:[],  //级联选择器的数据数组
    }
    this.richTextEditor = React.createRef();
  }
  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 2 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
  };

  goBack=()=>{
    this.props.history.goBack();
  }

  onChange=(value)=>{
    console.log(value);
  }
  submit = (e)=>{
    e.preventDefault();
    //校验表单
    this.props.form.validateFields((err,values)=>{
      if(!err){
        console.log(values);
        console.log(this.richTextEditor.current.state.editorState.toHTML());
      }
    })
  }
  //加载二级分类数据
  loadData = (selectedOptions)=>{
    const targetOptions = selectedOptions[selectedOptions.length-1];
    //显示loading状态
    targetOptions.loading = true;
    //请求二级分类数据
    this.getCategories(targetOptions.value);
  };

  getCategories = async (parentId)=>{
    const result = await reqGetCategories(parentId);
    if(result.status === 0){
      //判断是一级/二级分类
      if(parentId === '0'){
        this.setState({
          options:result.data.map((item)=>{
            return {
              label:item.name,
              value:item._id,
              isLeaf:false,
            }
          })
        })
      }else{
        console.log(result.data);
        this.setState({
          options:this.state.options.map((option)=>{
            if(option.value === parentId){
              option.children = result.data.map((item)=>{
                return{
                  label:item.name,
                  value:item._id,
                }
              });
              //去掉loading状态
              option.loading = false;
              option.isLeaf = true;
            }
            return option;
          })
        })
      }
    } else{
      message.error(result.msg);
    }
  }
  componentDidMount(){
    this.getCategories('0');
  }

    render(){
    const {options} = this.state;
    const {getFieldDecorator} = this.props.form;
        return(
          <Card
            title={<div className="save-update-title" onClick={this.goBack}><Icon className="save-update-icon" type="arrow-left"/>&nbsp;&nbsp;<span>添加商品</span></div>}
          >
            <Form {...this.formItemLayout} onSubmit={this.submit}>
              <Item label="商品名称">
                {
                  getFieldDecorator(
                      'name',
                    {
                      rules: [{required: true, whiteSpace: true, message: '商品名称不能为空'}]
                    },
                  )(<Input placeholder="请输入商品名称"/>)
              }
              </Item>
              <Item label="商品描述">
                {
                  getFieldDecorator(
                    'desc',
                  {
                    rules:[{required:true,whiteSpace:true, message:'商品描述不能为空'}]
                  })(<Input placeholder="请输入商品描述"/>)
                }
              </Item>
              <Item
                label="选择分类"
                wrapperCol={{
                xs:{span:24},
                sm:{span:5},
              }}
              >
                {
                  getFieldDecorator(
                    'category',
                    {
                    rules:[{required:true,message:'请选择商品分类'}]
                  })(<Cascader
                    options={options}
                    onChange={this.onChange}
                    placeholder="请选择分类"
                    changeOnSelect
                    loadData={this.loadData}
                  />)
                }

              </Item>
              <Item
              label= "商品价格"
              wrapperCol={{
                xs:{span:24},
                sm:{span:5}
              }}
              >
                {
                  getFieldDecorator('price',{
                    rules:[{
                      required:true,message:'请输入商品价格'
                    }]
                  })(<InputNumber
                    className="save-update-input-number"
                    //每三位数字就有一个,并且开头￥
                    formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g,',')}
                    //去除非数字的内容
                    parse={value=>value.replace(/￥\s？(,*)/g,'')}
                    //onChange={this.onChange}
                  />)
                }

              </Item>
              <Item label="商品详情"
                wrapperCol={{
                  xs: { span: 24 },
                  sm: { span: 21 },
                }}
              >
                <RichTextEditor ref={this.richTextEditor}/>
              </Item>
              <Item>
                <Button type="primary" className="save-update-button" htmlType="submit" onClick={this.addProduct}>提交</Button>
              </Item>
            </Form>
          </Card>
        )
    }
}

export default SaveUpdate;

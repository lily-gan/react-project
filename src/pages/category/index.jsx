import React,{Component} from 'react'
import { Card ,Button,Icon,Table,message,Modal} from 'antd';
import AddCategoryForm from './add-category-form'
import UpdateCategoryNameForm from './update-category-name-form'
import MyButton from '../../components/my-button'
import {reqGetCategories,reqAddCategory,reqUpdateCategoryName} from "../../api";
import './index.less'
export default class Category extends Component{
  constructor(props){
    super(props);
    this.state={
      categories:[],//一级分类数据
      subCategories:[],  //二级分类数据
      isShowAddCategoryModal:false,  //添加分类名称对话框显示
      isShowUpdateCategoryNameModal:false, //修改分类名称对话框显示
      category:{},  //要操作分类数据
      parentCategory:{},
      isShowSubCategories:false,  //是否展示二级分类数据
    }
    this.createAddForm = React.createRef();
    this.createUpdateForm = React.createRef();
  }
  //当请求数据为空时,不要loading
  isLoading = true;
  //定义表格类
  columns =[
    {
      title:'品类名称',
      dataIndex:'name',  //显示data数据中的name属性值
    },
    {
      title:'操作',
      // dataIndex:'operator',  //render方法不能和dataIndex属性共存,这样会导致render方法中没有值
      className:'operator',
      render: category => {
        return <div>
          <MyButton onClick={this.showUpdateCategoryNameModal(category)}>修改名称</MyButton>
          {
            this.state.isShowSubCategories ? null : <MyButton onClick={this.showSubCategory(category)}>查看子类</MyButton>
          }
        </div>
      }
    }
  ]
  //显示二级分类列表
  showSubCategory=(parentCategory)=>{
    return ()=>{
      this.setState({
        parentCategory,
        isShowSubCategories:true,
      })
      //请求二级分类数据
      this.getCategories(parentCategory._id);
    }
  }

  //显示更新分类名称
  showUpdateCategoryNameModal =(category)=>{
    return ()=>{
      this.setState({
        category
      })
      this.changeModal('isShowUpdateCategoryNameModal',true)();
    }
  }
  //获取分类列表
  getCategories = async(parentId)=>{
    const result = await reqGetCategories(parentId);
    if(result.status === 0) {
      //判断是一级还是二级
      const options = {};
      if (result.data.length === 0) {
        this.isLoading = false;
        setTimeout(() => {
          this.isLoading = true;
        }, 0)
      }
      if (parentId === '0') {
        options.categories = result.data;
      } else {
        options.subCategories = result.data;
      }
      this.setState(options)
    }else{
      message.error(result.msg);
    }
  }

  //发送请求获取数据
  componentDidMount(){
    this.getCategories('0');
  }

  //添加分类
  addCategory=()=>{
    //获取的是普通组件的虚拟DOM对象,它的值就是Dom元素
    //获取的是组件,它的值就是组件的实例对象
    const {validateFields,resetFields} = this.createAddForm.current.props.form;
    //表单校验的方法
    validateFields(async (err,values)=>{
        if(!err){
          //校验成功  -->发送请求 添加分类数据 ,隐藏对话框,提示添加分类成功
          const {parentId,categoryName} = values;
          const result = await reqAddCategory(parentId,categoryName);
          if(result.status === 0){
            message.success('添加分类成功');
            const options = {isShowAddCategoryModal:false};
            console.log(options,'options');
              if(parentId === '0'){
                options.categories = [...this.state.categories,result.data];
            }else if(parentId === this.state.parentCategory._id){
                options.subCategories = [...this.state.subCategories,result.data];
            }
            this.setState(options);
              //重置表单项
              resetFields();
          }else{
            message.error(result.msg);
          }
        }else {
          //校验失败，啥也不做
          
        }
      })
  }

  //修改分类名称
  updateCategoryName = ()=>{
    const {validateFields,resetFields} = this.createUpdateForm.current.props.form;
    validateFields(async(err,values)=>{
      if(!err){
        const {categoryName} = values;
        const {category:{_id},isShowSubCategories} = this.state;
        const result = await reqUpdateCategoryName(_id,categoryName);
        if(result.status===0){
          //隐藏对话框,提示成功,修改显示的分类名称
          message.success('更新分类名称成功')
          //如果在一级分类,点击修改一级分类数据
          //如果在二级分类,点击修改二级分类数据
          let name = 'categories';
          if(isShowSubCategories){
            name = 'subCategories'
          }
          this.setState({
            isShowUpdateCategoryNameModal:false,
            [name]:this.state[name].map((category)=>{
              if(category._id === _id) return {...category,name:categoryName};
              return category
            })
          })
          //重置表单项
          resetFields();
        }else{
          message.error(result.msg);
        }
      }
    })
  }


  //切换对话框的显示隐藏
  changeModal=(name,isShow)=>{
    return ()=>{
      // 解决没有点击确认修改分类名称时，清空用户输入的数据，防止下次不能使用默认值
      if(name==='isShowUpdateCategoryNameModal'&&isShow===false) this.createUpdateForm.current.props.form.resetFields();
      this.setState({
        [name]:isShow
      })
    }
}

//回退到一级菜单
  goBack = ()=>{
    this.setState({
      isShowSubCategories:false
    })
  }
  render(){
    const {
      categories,
      subCategories,
      isShowAddCategoryModal,
      isShowUpdateCategoryNameModal,
      category:{name},
      parentCategory,
      isShowSubCategories
    } =this.state;
    return(
            <Card
              className="category"
              title={isShowSubCategories ? <div><MyButton onClick={this.goBack}>一级分类</MyButton> <Icon type="arrow-right"/><span>{parentCategory.name}</span></div>:'一级分类列表'}
              extra={<Button type='primary' onClick={this.changeModal('isShowAddCategoryModal',true)}><Icon type='plus'/>添加品类</Button>}
            >
              <Table
                columns={this.columns}
                dataSource={isShowSubCategories ? subCategories:categories}
                borderd
                pagination={
                  {
                    showSizeChanger:true,
                    pageSizeOptions: ['3', '6', '9', '12'],
                    defaultPageSize:3,
                    showQuickJumper:true,
                  }
                }
                rowKey = "_id"
                loading={isShowSubCategories ? this.isLoading && !subCategories.length : this.isLoading && !categories.length}
              />
              <Modal
                title="添加分类"
                visible={isShowAddCategoryModal}
                onOk={this.addCategory}
                onCancel={this.changeModal('isShowAddCategoryModal',false)}
                okText='确认'
                cancelText='取消'>
              <AddCategoryForm categories={categories} wrappedComponentRef={this.createAddForm}/>
              </Modal>
              <Modal
              title='修改分类名称'
              visible={isShowUpdateCategoryNameModal}
              onOk={this.updateCategoryName}
              onCancel={this.changeModal('isShowUpdateCategoryNameModal',false)}
              okText='确认'
              cancelText='取消'
              width={300}
              >
                <UpdateCategoryNameForm categoryName={name} wrappedComponentRef = {this.createUpdateForm}/>
              </Modal>
            </Card>
      )
    }
}
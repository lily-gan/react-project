import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Upload,Icon,Modal,message} from 'antd'
import {reqDelImage} from "../../../api";

export default class PicturesWall extends Component {
  static propTypes = {
    _id:PropTypes.string.isRequired,
    imgs:PropTypes.array.isRequired
  }
  constructor(props){
    super(props)
    this.state={
      previewVisible: false,
      previewImage: '',
      fileList:this.props.imgs.map((img,index)=>{
        return {
          uid: -index,
          name: img,
          status: 'done',
          url: 'http://localhost:5000/upload/'+img,
        }
      })
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = async ({ file,fileList }) => {
    if(file.status === 'done'){
      //图片上传完成,修改name
      //找到上传的图片--最后一张
      const lastFile = fileList[fileList.length-1];
      lastFile.name = file.response.data.name;
      lastFile.url = file.response.data.url;

    }else if(file.status === 'removed'){
      const {name} = file;
      const {_id} = this.props;
      const result = await reqDelImage(name, _id);
      if(result.status === 0){
        message.success('图片删除成功')
      }else{
        message.error('图片删除失败')
      }
    }else if(file.status === 'error'){
      message.error('图片上传失败');
    }
    this.setState({
      fileList
    })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const {_id}=this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          name="image"
          data={{id:_id}}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

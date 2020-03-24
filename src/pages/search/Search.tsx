import React from 'react';
import { connect } from 'dva';
import { Table,Input,message} from 'antd';

//定义函数组件
function SearchTest({ dispatch, list: dataSource, loading,searchNum }) {
  const columns = [
    {
      title: '序号',
      width: '10%',
      render:(text,record,index)=> `${index+1}`,
    },
    {
      title: '图片',
      dataIndex: 'image',
      key: 'name',
      render: (text,record) =>(
        <a href={record.path} target="_blank"><img src={record.image} /></a>
      )
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render:(text, record) => (
        <span>
          <a href={record.path} target="_blank">{record.title}</a>
        </span>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'passtime',
      key: 'passtime',
    }
  ];
  
  // 相关处理函数
  function handleChangeStart(val) {
    let num:number = Number(val.target.value);
    if(num&&/^[0-9]*[1-9][0-9]*$/.test(num)){
      // setNumVal
      dispatch({
        type: 'searchTest/setNumVal',
        payload:num,
      });
      // 请求数据
      dispatch({
        type: 'searchTest/fetch',
        // payload:num,//参数在store中取
      });
    }else{
       message.info('只能输入大于0的数字!');
       // setNumVal
       dispatch({
        type: 'searchTest/setNumVal',
        payload:"",
      });
       // 请求数据
       dispatch({
        type: 'searchTest/setList',
        payload:[],
      });
    }
  }
 
  function debounce(fn,wait){
    // console.log(wait)
    let timer = null;
    return function(){
      if(timer !== null){
          clearTimeout(timer);
      }
      timer = setTimeout(fn,wait);
    }
  }

  function handleChange(val){
    debounce(handleChangeStart(val),2000)()
  }

  return (
      <div>
        输入要显示的新闻条数:
        <Input placeholder="请输入数字!" onChange={handleChange} value={searchNum}
              style={{width:"200px",marginBottom:"15px",marginLeft:"10px"}}/>
       
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={record => record.path.substr(-10)}
          pagination={false}
        />
      </div>
  );
}

//connect 连接model(state) 与 UI
function mapStateToProps(state) {
  const { list,searchNum } = state.searchTest;
  return {
    loading: state.loading.models.searchTest,
    list,
    searchNum
  };
}

export default connect(mapStateToProps)(SearchTest);
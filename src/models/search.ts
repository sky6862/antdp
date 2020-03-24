import { Effect } from 'dva';
import { Reducer } from 'redux';
import {query as queryUsers } from '@/services/search';

export default {
  namespace: 'searchTest',
  state: {
    list:[], //列表数据
    searchNum:1//表单搜索的新闻条数
  },
  reducers: {
    // 保存列表数据
    setList(state, action) {
      return {
        ...state,
        list: action.payload || {},
      }
    },
    // 保存表单数据
    setNumVal(state, action){
      console.log("保存表单数据:",action.payload)
      return {
        ...state,
        searchNum: action.payload || ""
      }
    }
  },
  effects: {
    *fetch(params, { select,call, put }) {
      // 获取state
      const searchNum = yield select(state => state.searchTest.searchNum);
      console.log(params,searchNum)

      let data = {"page": 1,"count": searchNum}
      const response = yield call(queryUsers,data);
      
      // 调用 reducers，保存列表数据
      yield put({
        type: 'setList',
        payload: response.result
      });
    }
  },
  //用于订阅一个数据源，然后根据条件 dispatch 需要的 action：数据源可以是当前的时间、
  // 服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。
  subscriptions: {
    // 默认显示的数据
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/search') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  }
  //
};

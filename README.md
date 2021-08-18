# use-enhanced-reducer

Powerful enhanced usereducer hook, support redux-thunk, redux-promise, middlewares.

# Desc

On the basis of react useReducer, add redux-thunk and redux-promise functions.

All functions are as follows:

1. Support function/promise type actions
2. Support Promise type action.payload
3. Support getState method to get real-time state
4. Support middlewares

增强型usereducer hook, 在usereducer的基础上，实现redux-thunk,redux-promise的功能，支持自定义中间件。

功能明细如下：

1. 支持函数类型的action，包含普通function类型和异步promise类型
2. 支持异步的payload，即payload可以是promise函数
3. 增加getState方法，可以实时获取最新state
4. 支持自定义中间件

# Examples

### Support any type of action

```ts
const initialState = {
  loading: false,
  listData: []
}

// simple action
const simpleAction = { type: 'SIMPLE_ACTION', payload: true }
// async function action
const asyncFunctionAction = (args) => async ({ getState, dispatch }) => {
  await Apis.getList(args)
  dispatch(simpleAction)
}
// async payload
const asyncActionPayload = { type: 'ASYNC_ACTION_PAYLOAD', payload: Apis.getList() }

const reducer = (initialState, action) => {
  switch (action.type) {
    case 'SIMPLE_ACTION':
      return Object.assign({}, state, loading: action.payload)
    case 'ASYNC_ACTION_PAYLOAD':
      return Object.assign(
        {},
        state,
        // action.payload is the result of the asynchronous request of Apis.getList
        listData: action.payload
      )
    default:
      return state
  }
}
```

### Simple use

```ts
import * as React from 'react';
import useEnhancedReducer from 'use-enhanced-reducer';

const Example: React.FunctionComponent<{}> = () => {
	const [state, dispatch, getState] = useEnhancedReducer(reducer, initialState)
	// do something
}
```

### With middlewares

```ts
import * as React from 'react';
import useEnhancedReducer, { Middleware } from 'use-enhanced-reducer';

const loggerMiddleware: Middleware = ({ getState, dispatch }) => next => action => {
  console.group(action.type);
  console.log('before state', getState());
  await next(action);
  console.log('after state', getState());
  console.groupEnd();
};

const customMiddleware: Middleware = ({ getState, dispatch }) => dispatch => action => {
	// do something
};

const ExampleWithMiddlewares: React.FunctionComponent<{}> = () => {
	const [state, dispatch, getState] = useEnhancedReducer(reducer, initialState, [loggerMiddleware, customMiddleware])

	return <Context.Provider value={{ state, dispatch, getState }}>
    // ...
    </Context.Provider>
}
```


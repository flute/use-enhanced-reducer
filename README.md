# use-enhanced-reducer

Powerful enhanced usereducer hook, support redux-thunk, redux-promise, middlewares.

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


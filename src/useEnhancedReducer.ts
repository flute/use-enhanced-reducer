/**
 * Custom enhanced useReducer
 * On the basis of react useReducer, add redux-thunk and redux-promise functions
 * All functions are as follows:
 * 1. Support function/promise type actions
 * 2. Support Promise type action.payload
 * 3. Support getState method to get real-time state
 * 4. Support middlewares
 */
import React from 'react'
import { useReducer, useRef, useEffect, useCallback, useMemo } from 'react'
import { Middleware, Dispatch, EnhancedAction } from './types';

const compose = (fns: ((...args: any) => any)[]) => (initial: any) =>
  fns.reduceRight((v, f) => f(v), initial);

function useEnhancedReducer<R extends React.Reducer<any, any>>(
  reducer: R,
  initialState: React.ReducerState<R>,
  middlewares: Middleware[]
): [React.ReducerState<R>, Dispatch<R>, Middleware] {
  const latestState = useRef(initialState)
  const [state, originalDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    latestState.current = state
  }, [state])

  const getState = useCallback(() => latestState.current, [])

  const enhancedDispatch: Dispatch<R> = useCallback((action: EnhancedAction<any>) => {
    if (typeof action === 'function') {
      return action(enhancedDispatch, getState);
    } else {
      if (action.payload instanceof Promise) {
        return action.payload.then(function(result: any) {
          const promisedAction: EnhancedAction<any> = {
            type: action.type,
            payload: result
          }
          originalDispatch(promisedAction);
        });
      } else {
        return originalDispatch(action)
      }
    }
  }, []);

  const dispatch = useMemo(() => {
    const chain = middlewares.map(middleware => middleware({
      getState,
      dispatch: enhancedDispatch
    }));
    return compose(chain)(enhancedDispatch);
  }, [])

  return [state, dispatch, getState];
}

export default useEnhancedReducer
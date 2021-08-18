import React from 'react';
import { Action } from 'redux';

export interface MiddlewareAPI<
  R extends React.Reducer<any, any> = React.Reducer<any, any>,
> {
  getState: () => React.ReducerState<R>;
  dispatch: Dispatch<R>;
}

export type Dispatch<R extends React.Reducer<any, any>> = (
  action: React.ReducerAction<R>,
) => Promise<void>;

export type Middleware = <R extends React.Reducer<any, any>>({
  getState,
  dispatch,
}: MiddlewareAPI<R>) => (next: Dispatch<R>) => Dispatch<R>;

export interface IAction<T> extends Action<string> {
  type: string;
  payload?: T;
}

export type EnhancedAction<T> = T extends IAction<any> ? IAction<any> : T 
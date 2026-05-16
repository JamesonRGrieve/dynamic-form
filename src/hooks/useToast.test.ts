import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { reducer, toast, useToast } from './useToast';

describe('toast reducer', () => {
  it('ADD_TOAST adds the toast and respects TOAST_LIMIT', () => {
    const t1 = { id: '1', open: true };
    const t2 = { id: '2', open: true };
    let state = reducer({ toasts: [] }, { type: 'ADD_TOAST', toast: t1 });
    expect(state.toasts).toEqual([t1]);
    state = reducer(state, { type: 'ADD_TOAST', toast: t2 });
    // TOAST_LIMIT === 1
    expect(state.toasts).toEqual([t2]);
  });

  it('UPDATE_TOAST merges fields by id', () => {
    const state = { toasts: [{ id: '1', open: true, title: 'hi' }] };
    const next = reducer(state, { type: 'UPDATE_TOAST', toast: { id: '1', title: 'bye' } });
    expect(next.toasts[0].title).toBe('bye');
    expect(next.toasts[0].open).toBe(true);
  });

  it('DISMISS_TOAST marks the matching toast closed', () => {
    const state = { toasts: [{ id: '1', open: true }] };
    const next = reducer(state, { type: 'DISMISS_TOAST', toastId: '1' });
    expect(next.toasts[0].open).toBe(false);
  });

  it('DISMISS_TOAST without id closes all', () => {
    const state = { toasts: [{ id: '1', open: true }] };
    const next = reducer(state, { type: 'DISMISS_TOAST' });
    expect(next.toasts[0].open).toBe(false);
  });

  it('REMOVE_TOAST removes the matching toast', () => {
    const state = {
      toasts: [
        { id: '1', open: true },
        { id: '2', open: true },
      ],
    };
    const next = reducer(state, { type: 'REMOVE_TOAST', toastId: '1' });
    expect(next.toasts).toHaveLength(1);
    expect(next.toasts[0].id).toBe('2');
  });

  it('REMOVE_TOAST without id clears all', () => {
    const state = { toasts: [{ id: '1' }, { id: '2' }] };
    const next = reducer(state, { type: 'REMOVE_TOAST' });
    expect(next.toasts).toEqual([]);
  });
});

describe('useToast / toast', () => {
  it('toast() returns an id and handles', () => {
    const handle = toast({ title: 'Hi' });
    expect(typeof handle.id).toBe('string');
    expect(typeof handle.dismiss).toBe('function');
    expect(typeof handle.update).toBe('function');
    handle.dismiss();
  });

  it('useToast exposes toast + dismiss', () => {
    const { result } = renderHook(() => useToast());
    expect(typeof result.current.toast).toBe('function');
    expect(typeof result.current.dismiss).toBe('function');
  });

  it('dispatching toast adds to state visible via useToast', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.toast({ title: 'inline' });
    });
    expect(result.current.toasts.length).toBeGreaterThan(0);
    act(() => {
      result.current.dismiss();
    });
  });
});

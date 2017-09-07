import store from '../';

describe('Store', () => {
  it('should return an object', () => {
    expect(typeof store({})).toBe('object');  
  });

  it('should connect to the redux devtools, if available', () => {
    const key = '__REDUX_DEVTOOLS_EXTENSION__';
    window[key] = jest.fn();
    const spy = jest.spyOn(window, key);

    store({});

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

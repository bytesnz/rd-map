export class AsyncLoader {
  public loaded = false;
  public load = null;

  constructor(filename) {
    require.ensure(filename, (load) => {
      this.load = loaded;
      this.loaded = true;
  }
};

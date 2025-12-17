const isArray = Array.isArray || ((x) => Object.prototype.toString.call(x) === '[object Array]');

export default function onOne(emitter: NodeJS.EventEmitter, nameOrNames: string | string[], fn: (...args: unknown[]) => void) {
  const names = isArray(nameOrNames) ? (nameOrNames as string[]) : [nameOrNames as string];

  let called = false;
  const wrappers: Array<(...args: unknown[]) => void> = [];

  names.forEach((name) => {
    function wrapper(...args: unknown[]) {
      if (called) return;
      called = true;

      // cleanup
      for (let i = 0; i < names.length; i++) {
        emitter.removeListener(names[i], wrappers[i]);
      }

      return fn(...args, name);
    }
    wrappers.push(wrapper);
    emitter.on(name, wrapper);
  });
}

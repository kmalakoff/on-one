const isArray = Array.isArray || ((x) => Object.prototype.toString.call(x) === '[object Array]');

export default function onOne(emitter: NodeJS.EventEmitter, nameOrNames: string | string[], fn: (...args: unknown[]) => void) {
  const names = isArray(nameOrNames) ? (nameOrNames as string[]) : [nameOrNames as string];

  let called = false;
  function wrapper() {
    if (called) return;
    called = true;

    // cleanup
    names.forEach((name) => emitter.removeListener(name, wrapper));

    // biome-ignore lint/complexity/noArguments: Apply arguments
    return fn.apply(null, arguments);
  }

  names.forEach((name) => emitter.on(name, wrapper));
}

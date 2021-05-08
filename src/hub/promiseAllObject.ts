function mapPromises(object:object) {
    const resolved:any = Array.isArray(object) ? [] : {};
    let innerPromises:any[] = [];
    const promises = Object
      .entries(object)
      .map(async ([key, promise]) => {
        if (typeof promise !== 'object' || typeof promise.then !== 'undefined') {
          return resolved[key] = await promise;
        }
        const { promises: promises, resolved: resolved2 } = mapPromises(promise);
        innerPromises = innerPromises.concat(promises);
        resolved[key] = resolved2;
      });
    return {
      promises: promises.concat(innerPromises),
      resolved,
    };
  }

export default async function promiseObject(object:object) {
    const { promises, resolved } = mapPromises(object);
    await Promise.all(promises);
    return resolved;
};
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function mapPromises(object) {
    const resolved = Array.isArray(object) ? [] : {};
    let innerPromises = [];
    const promises = Object
        .entries(object)
        .map(([key, promise]) => __awaiter(this, void 0, void 0, function* () {
        if (typeof promise !== 'object' || typeof promise.then !== 'undefined') {
            return resolved[key] = yield promise;
        }
        const { promises: promises, resolved: resolved2 } = mapPromises(promise);
        innerPromises = innerPromises.concat(promises);
        resolved[key] = resolved2;
    }));
    return {
        promises: promises.concat(innerPromises),
        resolved,
    };
}
function promiseObject(object) {
    return __awaiter(this, void 0, void 0, function* () {
        const { promises, resolved } = mapPromises(object);
        yield Promise.all(promises);
        return resolved;
    });
}
exports.default = promiseObject;
;
//# sourceMappingURL=promiseAllObject.js.map
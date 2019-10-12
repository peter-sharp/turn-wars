// TODO remove
function map(fn, x) {
    if (x.map) return x.map(fn)
    return Object.keys(x).reduce(mapObject.bind(null, fn, x), {})
}
function mapObject(fn, x, obj, key) {
    obj[key] = fn(x[key], key, x)
    return obj
}

export default map
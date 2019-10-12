function length(x) {
    if ('length' in x) return x.length
    else return Object.keys(x).length
}

export default length
function inBounds({ columns, rows }, { column, row }) {
    return row >= 0 && column >= 0 && row < rows && column < columns
}

export default inBounds
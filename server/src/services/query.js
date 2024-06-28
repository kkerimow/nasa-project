
const DEFAUL_PAGE_NUMBER = 1
const DEFAUL_PAGE_LIMIT = 50;

function getPagination(query) {
    const page = Math.abs(query.page) || DEFAUL_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAUL_PAGE_LIMIT;

    const skip = (page - 1) * limit;

    return {
        skip,
        limit
    }
}

module.exports = {
    getPagination,
};
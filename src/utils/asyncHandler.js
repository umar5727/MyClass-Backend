const asyncHandler = (requsetHandler) => {
    return (req, res, next) => {
        Promise.resolve((req, res, next)).catch((err) =>
            next(err)
        )
    }
}


export { asyncHandler }
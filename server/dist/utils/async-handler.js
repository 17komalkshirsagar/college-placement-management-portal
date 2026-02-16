export function asyncHandler(controller) {
    return (req, res, next) => {
        controller(req, res, next).catch(next);
    };
}

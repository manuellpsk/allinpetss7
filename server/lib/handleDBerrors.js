module.exports = (err, res, next) => {
    if (err) {
        res.status(422).json({
            message: "Handle Database Error. Problema con la consulta",
            stack: err.message
        });
    } else {
        next();
    }
};
module.exports = (req,res, next) => {
    if (!req.user) {
        req.flash('Error', 'You must be signed in to accesss the page');
        res.redirect('/auth/login');
    } else {
        next();
    }
};
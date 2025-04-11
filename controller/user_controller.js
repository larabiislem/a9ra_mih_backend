const User = require('../models/user_model');
const { catchAsync, AppError, handleDBErrors } = require('./error');

exports.createUser = handleDBErrors(catchAsync(async (req, res, next) => {
    const { id_utilisateur, nom, prenom, email, password, age, telephone, adresse } = req.body;
    const keywords = req.body.keywords || [];

    if (!id_utilisateur || !nom || !prenom || !email || !password || !age || !telephone || !adresse) {
        return next(new AppError('Missing fields', 400));
    }

    const user = await User.create({
        id_utilisateur,
        nom,
        prenom,
        email,
        password,
        age,
        telephone,
        adresse
    }, keywords);
    
    res.status(201).json({
        status: 'success',
        data: {
            user
        }
    });
}));

exports.login = handleDBErrors(catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findByEmail(email);
    
    if (!user || !(await User.comparePassword(password, user.mot_de_passe))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
}));

exports.getProfile = handleDBErrors(catchAsync(async (req, res, next) => {
    const { id_utilisateur } = req.params;
    const profile = await User.getProfile(id_utilisateur);
    
    if (!profile) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            profile
        }
    });
}));

exports.updateProfile = handleDBErrors(catchAsync(async (req, res, next) => {
    const { id_utilisateur } = req.params;
    const updateData = req.body;

    const user = await User.updateProfile(id_utilisateur, updateData);
    
    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
}));

exports.updateKeywords = handleDBErrors(catchAsync(async (req, res, next) => {
    const { id_utilisateur } = req.params;
    const { keywords } = req.body;

    await User.updateKeywords(id_utilisateur, keywords);
    
    res.status(200).json({
        status: 'success',
        message: 'Keywords updated successfully'
    });
}));

exports.changePassword = handleDBErrors(catchAsync(async (req, res, next) => {
    const { id_utilisateur } = req.params;
    const { newPassword } = req.body;

    await User.changePassword(id_utilisateur, newPassword);
    
    res.status(200).json({
        status: 'success',
        message: 'Password changed successfully'
    });
}));

exports.deleteAccount = handleDBErrors(catchAsync(async (req, res, next) => {
    const { id_utilisateur } = req.params;
    const user = await User.deleteAccount(id_utilisateur);
    
    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
}));
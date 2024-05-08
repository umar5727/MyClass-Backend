const signUp = async (req, res, next) => {
    console.log('signUp page')
    res.status(200).json(
        "signup page data louded"
    )
}

export { signUp }
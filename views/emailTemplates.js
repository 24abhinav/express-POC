(function() {
    forgotPassword = (userData, link) => {
        const template = 
        `<div style="padding: 20px; background: #ef5c5c; text-align: center; font-family: sans-serif;">
        <img style="height: 50px;" src="https://propcatalyst-dev.s3.ap-south-1.amazonaws.com/propcatalyst-documents/Prop_final_logo_white.png">
            <h3 style="color: white">Hi, ${userData.name} click on the below link to reset your password</h3>
		    <br>
		    <a href = "${link}" target="_blank" style="border: none; cursor: pointer; padding: 15px; text-align: center; background: #cbcbff; color: black; text-decoration: none;">RESET PASSWORD</a>
        </div>`

        return template;
    },
    activateAccount = (userData, link) => {
        const template = 
        `<div style="padding: 20px; background: #ef5c5c; text-align: center; font-family: sans-serif;">
        <img style="height: 50px;" src="https://propcatalyst-dev.s3.ap-south-1.amazonaws.com/propcatalyst-documents/Prop_final_logo_white.png">
            <h3 style="color: white">Hi, ${userData.name} click on the below link to activate your account with us!!</h3>
		    <br>
		    <a href = "${link}" target="_blank" style="border: none; cursor: pointer; padding: 15px; text-align: center; background: #cbcbff; color: black; text-decoration: none;">RESET PASSWORD</a>
        </div>`
        return template;
    },
    module.exports = {
        forgotPassword,
        activateAccount,
    };

}());
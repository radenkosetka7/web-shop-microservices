export const statusCodeMessage = (code) => {
    switch (code) {
        case '400':
            return "Username/password are required.";
        case '401':
            return "Activation code sent. Please check your email.";
        case '404':
            return "No active account found with the given credentials";
        default:
            return "There is problem. Please try again later."
    }
}

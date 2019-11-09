function loggedReducer(state=false,action) {
    switch (action.type) {
        case 200: {
            return true;
        }
        default: {
            return false;
        }
    }

}

export default loggedReducer;
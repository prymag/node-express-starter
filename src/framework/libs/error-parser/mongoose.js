function parse(error) {
    //
    const errors = error.errors;
    const json = [];
    Object.keys(errors).forEach((key, index) => {
        //
        const data = {
            field: errors[key].path,
            type: errors[key].kind,
            message: errors[key].message.replace('Path ', '')
        };
        json.push(data);
    });

    return json;
}

export default parse;
function parse(error) {
    //
    const errors = error.errors;
    const json = [];
    for (var property in errors) {
        if (errors.hasOwnProperty(property)) {
            const data = {
                field: errors[property].path,
                type: errors[property].kind,
                message: errors[property].message.replace('Path ', '')
            };

            json.push(data);
        }
    }

    return json;
}

export default parse;
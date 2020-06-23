export default function(app) {
    //
    const port = process.env.SERVER_PORT || 3000;
    
    app.listen(port, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`App is listening at: http://localhost:${port}`)
        }
    });
}
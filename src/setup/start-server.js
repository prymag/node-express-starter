import { ErrorHandler } from "@core/middlewares/error-handler";

export default function(app) {
    //
    const port = process.env.SERVER_PORT || 3000;
    
    app.listen(port, (err) => {
        if (err) {
            console.error(`App Error: ${err}`);
        } else {
            console.log(`App is listening at: http://localhost:${port}`)
        }
    });

    app.use(ErrorHandler);
}
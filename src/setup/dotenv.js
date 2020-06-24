import dotenv from "dotenv";

export default function() {
    //
    const result = dotenv.config();
    if (result.error) {
        console.error(`DotEnv Error: ${result.error}`);
    }
}
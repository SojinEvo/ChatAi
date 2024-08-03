import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../styles/globals.css'


const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
                <meta name="description" content="ChatAI" />
                <title>ChatAI</title>
            </head>
            <body>
                {children}
            </body>
        </html>
    )
}
export default RootLayout
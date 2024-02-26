const ErrorFallback = ({ error }) => {
    return (
        <div className="error">
            <p>FOUT:</p>
            <pre>{error.message}</pre>

        </div>
    )
}
export default ErrorFallback
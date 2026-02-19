const ErrorState = ({ message }) => (
  <div className="p-6 text-center text-gray-400">
    {message || "Something went wrong"}
  </div>
);

export default ErrorState;
